package models

import (
	"ECoin/config" // 外部設定（config.go）から読み込む
	"crypto/sha256"
	"database/sql" // データベース操作に使用する標準パッケージ
	"encoding/hex"
	"fmt" // 文字列の整形に使用（SQL文の動的生成）
	"log" // ログ出力用

	_ "github.com/go-sql-driver/mysql" // SQLiteドライバ。明示的には使わないが、必要なため空インポートする
	"github.com/google/uuid"
)

// グローバル変数としてデータベース接続用のポインタを定義する
var Db *sql.DB

// エラー情報保持用（init関数内で使用）
var err error

// 使用するユーザーテーブル名を定数で定義
const (
	tableNameUser    	 = "users"
	tableNameMission 	 = "missions"
	tableNameUserMission = "user_mission"
	tableNameScore 		 = "score"
	tableNameRewards	 = "rewards"
	tableNameUserRewards = "user_rewards"
	tableNameEvents      = "events"
	tableNameUserEvents  = "user_events"
)


// パッケージ初期化時に実行される処理（mainより前に一度だけ実行される）
func init() {
	// データベース接続を開く（configで指定されたドライバ・DB名を使用）
	Db, err = sql.Open(config.Config.SQLDriver, config.GetMySQLDSN())
	if err != nil {
		log.Fatalln("DB接続エラー:", err)
	}

	// ユーザー情報を保存するためのテーブルを定義（なければ作成）
	cmdU := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		uuid VARCHAR(36) NOT NULL UNIQUE,
		name VARCHAR(100),
		email VARCHAR(100),
		password VARCHAR(255),
		coins INT DEFAULT 0,
		pref VARCHAR(100),
		city VARCHAR(100),
		created_at DATETIME
	)`, tableNameUser)
	Db.Exec(cmdU)

	cmdM := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		title VARCHAR(255),
		description TEXT,
		difficulty ENUM('easy', 'normal', 'hard'),
		point INT,
		require_proof boolean DEFAULT false,
		active boolean DEFAULT true,
		created_at DATETIME
	)`, tableNameMission)
	Db.Exec(cmdM)

	cmdUM := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		user_id VARCHAR(36),
		mission_id INT,
		finished_at DATETIME,
		proof_image_url VARCHAR(100),
		period_type ENUM('all', 'week', 'month'),
		period_value VARCHAR(100),
		created_at DATETIME,
		CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(uuid),
		CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES missions(id)
	)`, tableNameUserMission)
	Db.Exec(cmdUM)

	cmdS := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		user_id VARCHAR(36),
		earn_coin INT,
		period_type ENUM('all', 'week', 'month'),
		period_value VARCHAR(100),
		created_at DATETIME,
		CONSTRAINT fk_score_user FOREIGN KEY (user_id) REFERENCES users(uuid)
	)`, tableNameScore)
	Db.Exec(cmdS)

	cmdR := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100),
		description TEXT,
		required_points INT
	)`, tableNameRewards)
	Db.Exec(cmdR)

	cmdUR := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		user_id VARCHAR(36),
		reward_id INT,
		exchanged_at DATETIME,
		CONSTRAINT fk_rewards_user FOREIGN KEY (user_id) REFERENCES users(uuid),
		CONSTRAINT fk_reward FOREIGN KEY (reward_id) REFERENCES rewards(id)
	)`, tableNameUserRewards)
	Db.Exec(cmdUR)

	cmdE := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		request_user VARCHAR(36),
		venue VARCHAR(255),
		title VARCHAR(100),
		description TEXT,
		active BOOLEAN DEFAULT false,
		meeting_time DATETIME,
		end_time DATETIME,
		point INT,
		capacity INT,
		requested_at DATETIME,
		CONSTRAINT fk_event_user FOREIGN KEY (request_user) REFERENCES users(uuid)
	)`, tableNameEvents)
	Db.Exec(cmdE)

	cmdUE := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		event_id INT,
		user_id VARCHAR(36),
		active BOOLEAN DEFAULT true,
		requested_at DATETIME,
		CONSTRAINT fk_user_events_user FOREIGN KEY (user_id) REFERENCES users(uuid),
		CONSTRAINT fk_user_events_event FOREIGN KEY (event_id) REFERENCES events(id)
	)`, tableNameUserEvents)
	Db.Exec(cmdUE)

}

func createUUID() (uuidobj uuid.UUID){
	uuidobj, _ = uuid.NewUUID()
	return uuidobj
}

func Encrypt(pw string) string {
	hash := sha256.Sum256([]byte(pw))
	return hex.EncodeToString(hash[:])
}