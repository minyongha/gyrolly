import { db } from "./db_connection.js";

var query = "DROP PROCEDURE IF EXISTS get_user;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE get_user (
    IN input_user_id CHAR(8)
  )
  BEGIN
      SELECT user_id, wallet_address, profile_image, nickname, referral_user_id
      FROM user
      WHERE user_id = input_user_id;
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = "DROP PROCEDURE IF EXISTS get_today_count;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE get_today_count(
    IN input_user_id CHAR(8)
  )
  BEGIN
    DECLARE today DATE;
    SET today = CURDATE();
    
    SELECT 
        COALESCE(spin_count, 0) AS spin_count,
        COALESCE(slide_count, 0) AS slide_count
    FROM 
        daily_count
    WHERE user_id = input_user_id 
      AND date = today;
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = "DROP PROCEDURE IF EXISTS get_today_max_count;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE get_today_max_count ()
  BEGIN
    SELECT (SELECT spin_count FROM daily_count WHERE date = CURDATE() ORDER BY spin_count DESC LIMIT 1) AS spin_max_count, 
      (SELECT slide_count FROM daily_count WHERE date = CURDATE() ORDER BY slide_count DESC LIMIT 1) AS slide_max_count;
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = "DROP PROCEDURE IF EXISTS get_total_point;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE get_total_point (
    IN input_user_id CHAR(8)
  )
  BEGIN
    SELECT total_count, total_point
    FROM user
    WHERE user_id = input_user_id;
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = "DROP PROCEDURE IF EXISTS get_week_point;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE get_week_point (
    IN input_user_id CHAR(8)
  )
  BEGIN
    SELECT 
        date,
        COALESCE(spin_count * (SELECT spin_point_per_count FROM config ORDER BY id DESC LIMIT 1) + slide_count * (SELECT slide_point_per_count FROM config ORDER BY id DESC LIMIT 1), 0) AS total_point,
        COALESCE(nft_point, 0) AS nft_point, 
        COALESCE(referral_point, 0) AS referral_point 
    FROM 
        daily_count 
    WHERE
        user_id = input_user_id 
        AND date >= CURDATE() - INTERVAL 6 DAY
    ORDER BY 
        date;

    DROP TEMPORARY TABLE IF EXISTS week_date;
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = "DROP PROCEDURE IF EXISTS get_leaderboard;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE get_leaderboard (
    IN input_from INT,
    IN input_to INT
  )
  BEGIN
    SELECT 
        num,
        user_id,
        wallet_address,
        profile_image,
        nickname,
        total_point 
    FROM (
      SELECT
        ROW_NUMBER() OVER (ORDER BY total_point DESC) AS num,
        user_id,
        wallet_address,
        profile_image,
        nickname,
        total_point
      FROM user
    ) AS ranked_user
    WHERE num BETWEEN input_from AND input_to;
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("get_leaderboard 쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("get_leaderboard 쿼리 결과:", results);
});

var query = "DROP PROCEDURE IF EXISTS get_rank;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE get_rank (
    IN input_user_id CHAR(8)
  )

  BEGIN
    SELECT my_rank
    FROM (
        SELECT 
            user_id,
            total_point,
            ROW_NUMBER() OVER (ORDER BY total_point DESC) AS my_rank
        FROM 
            user
    ) AS ranked_users
    WHERE user_id = input_user_id;
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("get_rank 쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("get_rank 쿼리 결과:", results);
});

var query = "DROP PROCEDURE IF EXISTS verify_token;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE verify_token (
    IN input_token CHAR(64)
  )

  BEGIN
    SELECT 
      IF(
        EXISTS (
            SELECT 1
            FROM auth_tokens
            WHERE token = input_token
              AND expired_at >= CURDATE()
        ), 
        TRUE, 
        FALSE
      ) AS token_valid;
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = "DROP PROCEDURE IF EXISTS set_user;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE set_user (
    IN input_token CHAR(64),
    IN input_profile_image VARCHAR(100),
    IN input_nickname VARCHAR(20),
    IN input_referral_user_id CHAR(8)
  )
  BEGIN
    UPDATE user 
    SET profile_image = input_profile_image,
      nickname = input_nickname,
      referral_user_id = input_referral_user_id
    WHERE user_id = (SELECT user_id FROM auth_tokens WHERE token = input_token);
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("set_user 쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("set_user 쿼리 결과:", results);
});

// 3. auth_tokens
var query = "DROP PROCEDURE IF EXISTS set_token;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE set_token (  
    IN input_user_id CHAR(8),
    IN input_token CHAR(64)
  )
  BEGIN
    INSERT INTO auth_tokens (user_id, token, created_at, expired_at)
    VALUES (input_user_id, input_token, CURDATE(), CURDATE() + INTERVAL 7 DAY)
    ON DUPLICATE KEY UPDATE 
      token = input_token, created_at = CURDATE(), expired_at = CURDATE() + INTERVAL 7 DAY;
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("set_token 쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

// 입력(INSERT) ########################################################################
// 1. user : 처음 지갑 연결 시
var query = "DROP PROCEDURE IF EXISTS insert_user;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE insert_user (
    IN input_user_id CHAR(8),
    IN input_wallet_address CHAR(42),
    IN input_nickname VARCHAR(20)
  )
  BEGIN
    INSERT INTO user (user_id, wallet_address, nickname) VALUES
    (input_user_id, input_wallet_address, input_nickname);
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

// 2. auth_tokens : 처음 서명 시
var query = "DROP PROCEDURE IF EXISTS insert_token;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE insert_token (
    IN input_user_id CHAR(8),
    IN input_token CHAR(64)
  )
  BEGIN
    INSERT INTO auth_tokens (user_id, token, created_at, expired_at) VALUES
    (input_user_id, input_token, CURDATE(), CURDATE() + INTERVAL 7 DAY );
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

db.end();
