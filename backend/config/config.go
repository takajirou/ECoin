package config

import (
	"ECoin/utils"
	"fmt"
	"log"

	"gopkg.in/ini.v1"
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
	LoadConfig()
	utils.LoggingSettings(Config.LogFile)
}

// iniファイルを読み込む
func LoadConfig() {
	cfg, err := ini.Load("config.ini")
	if err != nil {
		log.Fatalln(err)
	}

	Config = ConfigList{
		Port:      cfg.Section("web").Key("port").MustString("8080"),
		LogFile:   cfg.Section("web").Key("logfile").MustString("webapp.log"),
		SQLDriver: cfg.Section("db").Key("driver").String(),
		DbUser:    cfg.Section("db").Key("user").String(),
		DbPass:    cfg.Section("db").Key("password").String(),
		DbHost:    cfg.Section("db").Key("host").MustString("127.0.0.1"),
		DbPort:    cfg.Section("db").Key("port").MustString("3306"),
		DbName:    cfg.Section("db").Key("name").String(),
	}
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
