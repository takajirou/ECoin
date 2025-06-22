package models

import (
	"ECoin/config" // 外部設定（config.go）から読み込む
	"crypto/sha256"
	"database/sql" // データベース操作に使用する標準パッケージ
	"encoding/hex"
	"fmt" // 文字列の整形に使用（SQL文の動的生成）
	"log" // ログ出力用

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3" // SQLiteドライバ。明示的には使わないが、必要なため空インポートする
)

// グローバル変数としてデータベース接続用のポインタを定義する
var Db *sql.DB

// エラー情報保持用（init関数内で使用）
var err error

// 使用するユーザーテーブル名を定数で定義
const (
	tableNameUser = "users"
)

// パッケージ初期化時に実行される処理（mainより前に一度だけ実行される）
func init() {
	// データベース接続を開く（configで指定されたドライバ・DB名を使用）
	Db, err = sql.Open(config.Config.SQLDriver, config.Config.DbName)
	if err != nil {
		// 接続に失敗した場合は、エラーメッセージを出力して強制終了
		log.Fatalln(err)
	}

	// ユーザー情報を保存するためのテーブルを定義（なければ作成）
	cmdU := fmt.Sprintf(`CREATE TABLE IF NOT EXISTS %s(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		uuid STRING NOT NULL UNIQUE,
		name STRING,
		email STRING,
		password STRING,
		created_at DATETIME,
		coins INTEGER DEFAULT 0,
		pref STRING,
		city STRING
	)`, tableNameUser)

	// 上記のSQLコマンドを実行（失敗してもエラー処理はしない）
	Db.Exec(cmdU)
}

func createUUID() (uuidobj uuid.UUID){
	uuidobj, _ = uuid.NewUUID()
	return uuidobj
}

func Encrypt(pw string) string {
	hash := sha256.Sum256([]byte(pw))
	return hex.EncodeToString(hash[:])
}