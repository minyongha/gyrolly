const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { db } = require("./db_connection");
const multer = require("multer");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "Images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // 폴더가 없으면 생성
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 현재 시간과 랜덤 숫자를 조합하여 고유한 파일 이름 생성
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  const query = "CALL verify_token (?)";
  const values = [token];

  db.query(query, values, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(403).json({ message: "Invalid token" });
    }

    next();
  });
}

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

app.post("/api/getUser", (req, res) => {
  const query = "CALL get_user (?) ";
  const { user_id } = req.body;
  const values = [user_id];
  db.query(query, values, (err, results) => {
    if (err) {
      res.json({
        result: 0,
        message: err.message,
        data: {},
      });
      return;
    }

    res.json({
      result: 1,
      message: "success",
      data: { results },
    });
  });
});

app.post("/api/setUser", verifyToken, upload.none(), (req, res) => {
  const query = "CALL set_user (?,?,?,?) ";
  const token = req.headers.authorization;
  const { profile, nickname, referral_user_id } = req.body;

  const values = [token, profile, nickname, referral_user_id];

  db.query(query, values, (err, results) => {
    if (err) {
      res.json({
        result: 0,
        message: err.message,
        data: {},
      });
      return;
    }

    res.json({
      result: 1,
      message: "success",
      data: { results },
    });
  });
});

app.post("/getAuthToken", (req, res) => {
  const { timestamp, signature, address } = req.body;

  if (verifySignedTimestamp(timestamp, signature, address)) {
    const query = 'CALL set_token (?, ?)';
    const token = crypto.randomBytes(32).toString("hex");
    const userId = encodeEthereumAddress(address);
    const values = [userId, token];

    db.query(query, values, (err, results) => {
      if (err) {
        res.json({
          result: 0,
          message: err.message,
          data: {},
        });
        return;
      }

      res.json({
        result: 1,
        message: "success",
        data: {
          result: [
            [
              {
                token,
              },
            ],
          ],
        },
      });
      return;
    });
  } else {
    res.status(400).json({
      error: "Invalid signature",
      message: "The signature does not match the provided address.",
    });
  }
});

app.post("/signUp", (req, res) => {
    const query = 'CALL insert_user (?,?,?)';
    const { walletAddress, nickname } = req.body;
    const userId = encodeEthereumAddress(walletAddress);
  
    const values = [userId, walletAddress, nickname];
  
    db.query(query, values, (err, results) => {
      if (err) {
        res.json({
          result: 0,
          message: err.message,
          data: {},
        });
        return;
      }
  
      res.json({
        result: 1,
        message: "success",
        data: { results },
      });
    });
  });

app.get("/api/getTodayMaxCount", (req, res) => {
  const query = "CALL get_today_max_count ";
  db.query(query, (err, results) => {
    if (err) {
      res.json({
        result: 0,
        message: err.message,
        data: {},
      });
      return;
    }

    res.json({
      result: 1,
      message: "success",
      data: { results },
    });
  });
});

app.post("/api/getTotalPoint", (req, res) => {
  const query = "select total_point from user where user_id = ? ";
  const { user_id } = req.body;
  const values = [user_id];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("getTotalPoint Error", err);
      return res.status(500).json({ error: "DB 에러" });
    }
    res.json(results);
  });
});

app.post("/api/getTotalCount", (req, res) => {
  const query = "select total_count from user where user_id = ?";
  const { user_id } = req.body;
  const values = [user_id];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("getTotalCount Error", err);
      return res.status(500).json({ error: "DB 에러" });
    }
    res.json(results);
  });
});

app.post("/api/getNftPoint", (req, res) => {
  const query = "select nft_point from daily_count where user_id = ? ";
  const { user_id } = req.body;
  const values = [user_id];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("getTotalPoint Error", err);
      return res.status(500).json({ error: "DB 에러" });
    }
    res.json(results);
  });
});

app.post("/api/getSlideCount", (req, res) => {
  const query = "select slide_count from daily_count where user_id = ? ";
  const { user_id } = req.body;
  const values = [user_id];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("getSlideCount Error", err);
      return res.status(500).json({ error: "DB 에러" });
    }
    res.json(results);
  });
});

app.post("/api/getSpinCount", (req, res) => {
  const query = "select spin_count from daily_count where user_id = ? ";
  const { user_id } = req.body;
  const values = [user_id];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("getSlideCount Error", err);
      return res.status(500).json({ error: "DB 에러" });
    }
    res.json(results);
  });
});

app.post("/api/setCount", (req, res) => {
  const query =
    "update daily_count set slide_count = ?, spin_count = ? where user_id = ?";
  const { user_id, slide_count, spin_count } = req.body;
  const values = [slide_count, spin_count, user_id];
  db.query(query, values, (err, results) => {
    if (err) {
      console.error("setCount Error", err);
      return res.status(500).json({ error: "DB 에러" });
    }
    res.json(results);
  });
});

app.post("/api/getRank", (req, res) => {
  const query = "CALL get_rank (?) ";
  const { user_id } = req.body;
  const values = [user_id];
  db.query(query, values, (err, results) => {
    if (err) {
      res.json({
        result: 0,
        message: err.message,
        data: {},
      });
      return;
    }

    res.json({
      result: 1,
      message: "success",
      data: { results },
    });
  });
});

app.post("/api/getLeaderboard", (req, res) => {
  const query = "CALL get_leaderboard (?, ?) ";
  const { from, to } = req.body;
  const values = [from, to];
  db.query(query, values, (err, results) => {
    if (err) {
      res.json({
        result: 0,
        message: err.message,
        data: {},
      });
      return;
    }

    res.json({
      result: 1,
      message: "success",
      data: { results },
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
