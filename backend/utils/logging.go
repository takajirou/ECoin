package utils

import (
	"io"
	"log"
	"os"
)

// LoggingSettings はログ出力の設定を行う関数。
// logFile に指定されたファイルにログを書き出すように設定する。
// 標準出力（ターミナル）とファイルの両方にログが出力される。
func LoggingSettings(logFile string) {
	// ログファイルを開く（なければ作成し、末尾に追記する）
	logfile, err := os.OpenFile(logFile, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		// ログファイルが開けなかった場合はプログラムを停止する
		log.Fatalln(err)
	}

	// 標準出力（os.Stdout）とログファイルの両方にログを出力するよう設定
	multiLogFile := io.MultiWriter(os.Stdout, logfile)

	// ログの出力形式を設定
	// Ldate: 日付（例：2009/01/23）
	// Ltime: 時刻（例：01:23:23）
	// Lshortfile: ログ出力元のファイル名と行番号を表示
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	// ログの出力先を標準出力 + ファイルに設定
	log.SetOutput(multiLogFile)
}
