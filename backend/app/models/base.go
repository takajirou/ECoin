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
	tableNameUser    = "users"
	tableNameMission = "missions"
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

	// 上記のSQLコマンドを実行（失敗してもエラー処理はしない）
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
}

func createUUID() (uuidobj uuid.UUID){
	uuidobj, _ = uuid.NewUUID()
	return uuidobj
}

func Encrypt(pw string) string {
	hash := sha256.Sum256([]byte(pw))
	return hex.EncodeToString(hash[:])
}