package config

import (
	"ECoin/utils"
	"log" // エラーとかを表示するために使う

	"gopkg.in/ini.v1" // iniファイルを読み込むためのパッケージを読み込む
)

// サーバーの設定とか、データベースの設定をまとめて入れておく箱を作る
type ConfigList struct {
	Port      string // サーバーのポート番号（例：8080）
	SQLDriver string // どのデータベースを使うか（例：mysql, sqlite3）
	DbName    string // データベースの名前（例：sample.db）
	LogFile   string // ログファイルの場所（例：log/app.log）
}

// どこからでも使えるように「設定の箱」を用意しておく
var Config ConfigList

// プログラムが始まったら最初に呼ばれる関数
func init() {
	LoadConfig() // 設定ファイルを読み込んで値を入れる関数を呼び出す
	utils.LoggingSettings(Config.LogFile)
}

// iniファイル（設定ファイル）を読み込んで、値をConfigに入れる関数
func LoadConfig() {
	cfg, err := ini.Load("config.ini")
	if err != nil {
		log.Fatalln(err)
	}

	// iniファイルから読み取った値を、Configという箱に入れる
	Config = ConfigList{
		Port:      cfg.Section("web").Key("port").MustString("8080"), // webセクションのportキーを探す。なければ8080にする
		SQLDriver: cfg.Section("db").Key("driver").String(),           // dbセクションのdriverキーの値を取り出す
		DbName:    cfg.Section("db").Key("name").String(),             // dbセクションのnameキーの値を取り出す
		LogFile:   cfg.Section("web").Key("logfile").String(),         // webセクションのlogfileキーの値を取り出す
	}
}
