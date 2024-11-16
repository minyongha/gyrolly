import { db } from "./db_connection.js";

var query = `
  CREATE TABLE user (
    user_id CHAR(8) PRIMARY KEY,
    wallet_address CHAR(42) NOT NULL UNIQUE,
    profile_image VARCHAR(100),
    nickname VARCHAR(20) NOT NULL,
    referral_user_id CHAR(8),
    total_count INT DEFAULT 0,
    total_point INT DEFAULT 0,
    nft_count INT DEFAULT 0,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mod_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (referral_user_id) REFERENCES user(user_id) ON DELETE SET NULL
  );
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE TABLE config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spin_point_per_count INT NOT NULL,
    slide_point_per_count INT NOT NULL,
    referral_benefit DECIMAL(2,2),
    nft_benefit INT,
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE TABLE daily_count (
    user_id CHAR(8) NOT NULL,
    date DATE NOT NULL,
    spin_count INT DEFAULT 0,
    slide_count INT DEFAULT 0,
    nft_point INT DEFAULT 0,
    referral_point INT DEFAULT 0,
    PRIMARY KEY (user_id, date),
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
  );
`;

db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

var query = `
  CREATE TABLE auth_tokens (
    user_id CHAR(8) NOT NULL PRIMARY KEY,
    token CHAR(64) NOT NULL UNIQUE, 
    created_at DATE NOT NULL,
    expired_at DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
  );
`;
db.query(query, (err, results, fields) => {
  if (err) {
    console.error("쿼리 실행에 실패했습니다:", err);
    return;
  }

  console.log("쿼리 결과:", results);
});

db.end();
