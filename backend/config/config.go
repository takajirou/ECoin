package config

import (
	"ECoin/utils"
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// 設定を保持する構造体
type ConfigList struct {
	Port      string
	SQLDriver string
	DbUser    string
	DbPass    string
	DbHost    string
	DbPort    string
	DbName    string
	LogFile   string
}

// グローバルに使える設定変数
var Config ConfigList

// 最初に実行される
func init() {
	_ = godotenv.Load()
	LoadEnv()
	utils.LoggingSettings(Config.LogFile)
}

// 環境変数を読み込む関数
func LoadEnv() {
	Config = ConfigList{
		Port:      getEnv("APP_PORT", "8080"),
		LogFile:   getEnv("LOG_FILE", "webapp.log"),
		SQLDriver: getEnv("DB_DRIVER", "mysql"),
		DbUser:    os.Getenv("DB_USER"),
		DbPass:    os.Getenv("DB_PASS"),
		DbHost:    getEnv("DB_HOST", "127.0.0.1"),
		DbPort:    getEnv("DB_PORT", "3306"),
		DbName:    os.Getenv("DB_NAME"),
	}
}

// fallback付きの環境変数取得関数
func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

// MySQL接続文字列を作る便利関数
func GetMySQLDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4",
		Config.DbUser,
		Config.DbPass,
		Config.DbHost,
		Config.DbPort,
		Config.DbName,
	)
}
