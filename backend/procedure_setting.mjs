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


var query = "DROP PROCEDURE IF EXISTS add_count;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE add_count (
    IN input_token CHAR(64),
    IN input_spin_count INT,
    IN input_slide_count INT
  )
  BEGIN
    DECLARE temp_spin_point_per_count INT;
    DECLARE temp_slide_point_per_count INT;
    DECLARE temp_nft_count INT;
    DECLARE temp_nft_benefit INT;
    DECLARE temp_user_id CHAR(8);    
    SELECT 
      spin_point_per_count, 
      slide_point_per_count,
      nft_benefit
    INTO 
      temp_spin_point_per_count, 
      temp_slide_point_per_count,
      temp_nft_benefit
    FROM config
    ORDER BY id DESC LIMIT 1;

    SELECT user_id INTO temp_user_id FROM auth_tokens WHERE token = input_token;
    SELECT nft_count INTO temp_nft_count FROM user WHERE user_id = temp_user_id;

    INSERT INTO daily_count (user_id, date, spin_count, slide_count)
    VALUES (temp_user_id, CURDATE(), input_spin_count, input_slide_count)
    ON DUPLICATE KEY UPDATE 
        spin_count = spin_count + input_spin_count,
        slide_count = slide_count + input_slide_count,
        nft_point = nft_point + ((input_spin_count * temp_spin_point_per_count + input_slide_count * temp_slide_point_per_count) * temp_nft_count * temp_nft_benefit);
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

// 4. auth_tokens 추가 및 업데이트
var query = "DROP PROCEDURE IF EXISTS upsert_token;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE upsert_token (
    IN input_user_id CHAR(8),
    IN input_token CHAR(64)
  )
  BEGIN
      DECLARE user_exists INT DEFAULT 0;

      -- user_id가 존재하는지 확인
      SELECT COUNT(*) INTO user_exists
      FROM auth_tokens
      WHERE user_id = input_user_id;

      -- user_id가 존재하지 않으면 insert_token 호출
      IF user_exists = 0 THEN
          CALL insert_token(input_user_id, input_token);
      -- 존재하면 set_token 호출
      ELSE
          CALL set_token(input_user_id, input_token);
      END IF;
  END;
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});


// 이벤트 스케줄러
var query = `SET GLOBAL event_scheduler = ON;`;
// 매일 0시
// [daily_count] referral_point 업데이트 - 오늘 날짜, 데이터 없으면 insert / 있으면 update, spin_count*spin_point_per_count + slide_count*slide_point_per_count + daily_count.nft_point) * config.referral_benefit
// daily_count 데이터를 user 테이블에 업데이트
var query = `
  CREATE EVENT IF NOT EXISTS update_total_count
  ON SCHEDULE EVERY 1 DAY
  STARTS '2024-11-02 00:00:00'
  DO
  BEGIN
    DECLARE temp_spin_point_per_count INT;
    DECLARE temp_slide_point_per_count INT;
    DECLARE temp_referral_benefit DECIMAL(2,2);
    SELECT 
      spin_point_per_count, 
      slide_point_per_count, 
      nft_benefit
    INTO 
      temp_spin_point_per_count, 
      temp_slide_point_per_count, 
      temp_referral_benefit
    FROM config
    ORDER BY id DESC LIMIT 1;

    
    INSERT INTO daily_count (user_id, date, referral_point)
    SELECT u.referral_user_id, CURDATE() AS date,
      (dc.spin_count * temp_spin_point_per_count + dc.slide_count * temp_slide_point_per_count + dc.nft_point) * temp_referral_benefit AS temp_referral_point
    FROM daily_count dc
    LEFT JOIN user u
    ON dc.user_id = u.user_id
      AND u.referral_user_id IS NOT NULL
    WHERE dc.date = CURDATE()
    ON DUPLICATE KEY UPDATE 
      date = CURDATE(),
      referral_point = FLOOR((spin_count * temp_spin_point_per_count + slide_count * temp_slide_point_per_count + nft_point) * temp_referral_benefit);

    UPDATE user u
    JOIN daily_count dc ON u.user_id = dc.user_id
    SET 
        u.total_count = u.total_count + dc.spin_count + dc.slide_count,
        u.total_point = u.total_count + dc.spin_count * temp_spin_point_per_count + dc.slide_count * temp_slide_point_per_count + dc.nft_point + dc.referral_point
    WHERE dc.date = CURDATE();

  END;
`;

var query = "DROP PROCEDURE IF EXISTS update_total_count;";
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE PROCEDURE update_total_count ()
  BEGIN
    DECLARE temp_spin_point_per_count INT;
    DECLARE temp_slide_point_per_count INT;
    DECLARE temp_referral_benefit DECIMAL(2,2);
    SELECT 
      spin_point_per_count, 
      slide_point_per_count, 
      referral_benefit
    INTO 
      temp_spin_point_per_count, 
      temp_slide_point_per_count, 
      temp_referral_benefit
    FROM config
    ORDER BY id DESC LIMIT 1;
    
    INSERT INTO daily_count (user_id, date, referral_point)
    SELECT u.referral_user_id, CURDATE() AS date,
      FLOOR((dc.spin_count * temp_spin_point_per_count + dc.slide_count * temp_slide_point_per_count + dc.nft_point) * temp_referral_benefit) AS temp_referral_point
    FROM daily_count dc
    LEFT JOIN user u
    ON dc.user_id = u.user_id
    WHERE dc.date = CURDATE()
      AND u.referral_user_id IS NOT NULL
    ON DUPLICATE KEY UPDATE 
      date = CURDATE(),
      referral_point = FLOOR((dc.spin_count * temp_spin_point_per_count + dc.slide_count * temp_slide_point_per_count + dc.nft_point) * temp_referral_benefit);

    UPDATE user u
    JOIN daily_count dc ON u.user_id = dc.user_id
    SET 
        u.total_count = u.total_count + dc.spin_count + dc.slide_count,
        u.total_point = u.total_point + dc.spin_count * temp_spin_point_per_count + dc.slide_count * temp_slide_point_per_count + dc.nft_point + dc.referral_point
    WHERE dc.date = CURDATE();

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
