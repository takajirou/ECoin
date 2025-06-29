package models

import (
	"ECoin/config" // 外部設定（config.go）から読み込む
	"crypto/sha256"
	"database/sql" // データベース操作に使用する標準パッケージ
	"encoding/hex"
	"fmt" // 文字列の整形に使用（SQL文の動的生成）
	"log" // ログ出力用
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// グローバル変数としてデータベース接続用のポインタを定義する
var Db *sql.DB

// エラー情報保持用（init関数内で使用）
var err error

// 使用するユーザーテーブル名を定数で定義
const (
	tableNameUser    	 	= "users"
	tableNameMission 		= "missions"
	tableNameMissionStats 	= "mission_stats"
	tableNameScore 		 	= "score"
	tableNameRewards	 	= "rewards"
	tableNameUserRewards 	= "user_rewards"
	tableNameEvents      	= "events"
	tableNameUserEvents  	= "user_events"
)


// パッケージ初期化時に実行される処理（mainより前に一度だけ実行される）
func init() {
	// データベース接続を開く（configで指定されたドライバ・DB名を使用）
	Db, err = sql.Open(config.Config.SQLDriver, config.GetMySQLDSN())
    if err != nil {
        log.Fatalln("DB接続エラー:", err)
    }

    // // 外部キー制約を一時的に無効化（MySQLの場合）
    // Db.Exec("SET FOREIGN_KEY_CHECKS = 0")

    // // すべてのテーブルをDROP（依存関係の逆順）
    // dropTables := []string{
    //     tableNameUserEvents,
    //     tableNameUserRewards,
    //     tableNameMissionStats,
    //     tableNameScore,
    //     tableNameEvents,
    //     tableNameRewards,
    //     tableNameMission,
    //     tableNameUser,
    // }

    // for _, tableName := range dropTables {
    //     cmdDrop := fmt.Sprintf(`DROP TABLE IF EXISTS %s`, tableName)
    //     if _, err := Db.Exec(cmdDrop); err != nil {
    //         log.Printf("テーブル削除エラー %s: %v", tableName, err)
    //     }
    // }

    // // 外部キー制約を再有効化
    // Db.Exec("SET FOREIGN_KEY_CHECKS = 1")

	cmdU := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		uuid VARCHAR(36) NOT NULL UNIQUE,
		name VARCHAR(100),
		email VARCHAR(100),
		password VARCHAR(255),
		coins INT DEFAULT 0,
		pref VARCHAR(100),
		city VARCHAR(100),
		admin BOOLEAN DEFAULT false,
		created_at DATETIME
	)`, tableNameUser)
	_, err = Db.Exec(cmdU)
	if err != nil {
		log.Fatalf("usersテーブル作成エラー: %v", err)
	}

	cmdM := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		title VARCHAR(255),
		description TEXT,
		difficulty ENUM('easy', 'normal', 'hard'),
		point INT,
		require_proof BOOLEAN DEFAULT false,
		active BOOLEAN DEFAULT true,
		created_at DATETIME
	)`, tableNameMission)
	_, err = Db.Exec(cmdM)
	if err != nil {
		log.Fatalf("missionテーブル作成エラー: %v", err)
	}

	cmdMS := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id VARCHAR(255) NOT NULL,
		mission_id INT NOT NULL,
		clear_count INT NOT NULL DEFAULT 0,
		period_type ENUM('week', 'month', 'total') NOT NULL,
		period_value VARCHAR(10) NOT NULL,
		updated_at DATETIME NOT NULL,
		FOREIGN KEY (user_id) REFERENCES users(uuid) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE ON UPDATE CASCADE,
		UNIQUE KEY unique_user_mission_period (user_id, mission_id, period_type, period_value)
	)`, tableNameMissionStats)
	_, err = Db.Exec(cmdMS)
	if err != nil {
		log.Fatalf("mission_statsテーブル作成エラー: %v", err)
	}

	cmdS := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		user_id VARCHAR(36),
		earn_coin INT,
		period_type ENUM('week', 'month'),
		period_value VARCHAR(100),
		created_at DATETIME,
		FOREIGN KEY (user_id) REFERENCES users(uuid),
		UNIQUE KEY unique_user_period (user_id, period_type, period_value)
	)`, tableNameScore)
	_, err = Db.Exec(cmdS)
	if err != nil {
		log.Fatalf("scoreテーブル作成エラー: %v", err)
	}

	cmdR := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100),
		description TEXT,
		required_points INT,
		active BOOLEAN DEFAULT true,
		created_at DATETIME
	)`, tableNameRewards)
	_, err = Db.Exec(cmdR)
	if err != nil {
		log.Fatalf("rewardテーブル作成エラー: %v", err)
	}

	cmdUR := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		user_id VARCHAR(36),
		reward_id INT,
		exchanged_at DATETIME,
		FOREIGN KEY (user_id) REFERENCES users(uuid),
		FOREIGN KEY (reward_id) REFERENCES rewards(id)
	)`, tableNameUserRewards)
	_, err = Db.Exec(cmdUR)
	if err != nil {
		log.Fatalf("user_rewardテーブル作成エラー: %v", err)
	}

	cmdE := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		request_user VARCHAR(36),
		title VARCHAR(100),
		description TEXT,
		address VARCHAR(255),
		active BOOLEAN DEFAULT false,
		meeting_time DATE,
		end_time DATE,
		point INT,
		pref VARCHAR(100),
		city VARCHAR(100),
		capacity INT,
		requested_at DATETIME,
		FOREIGN KEY (request_user) REFERENCES users(uuid)
	)`, tableNameEvents)
	_, err = Db.Exec(cmdE)
	if err != nil {
		log.Fatalf("eventテーブル作成エラー: %v", err)
	}

	cmdUE := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s (
		id INT PRIMARY KEY AUTO_INCREMENT,
		event_id INT,
		user_id VARCHAR(36),
		active BOOLEAN DEFAULT false,
		requested_at DATETIME,
		FOREIGN KEY (user_id) REFERENCES users(uuid),
		FOREIGN KEY (event_id) REFERENCES events(id)
	)`, tableNameUserEvents)
	_, err = Db.Exec(cmdUE)
	if err != nil {
		log.Fatalf("user_eventテーブル作成エラー: %v", err)
	}

}
func createUUID() uuid.UUID {
    uuidobj, err := uuid.NewUUID()
    if err != nil {
        log.Fatalf("UUID生成エラー: %v", err)
    }
    return uuidobj
}

func Encrypt(pw string) string {
	hash := sha256.Sum256([]byte(pw))
	return hex.EncodeToString(hash[:])
}

func GetCurrentYearWeek() string {
	now := time.Now()
	year, week := now.ISOWeek()
	return fmt.Sprintf("%d-%02d", year, week)
}

func GetCurrentYearMonth() string {
	now := time.Now()
	return fmt.Sprintf("%d-%02d", now.Year(), int(now.Month()))
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// パスワード検証
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}