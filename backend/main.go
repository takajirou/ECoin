package main

import (
	"ECoin/config"
	"ECoin/controllers"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// エンドポイント登録
	http.HandleFunc("/api/users", controllers.HandleUsers)
	http.HandleFunc("/api/users/", controllers.HandleUserByID)

	// サーバー起動ポート
	addr := fmt.Sprintf(":%s", config.Config.Port)
	log.Printf("Server started at http://localhost%s\n", addr)

	// サーバー開始
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatal("サーバー起動失敗:", err)
	}
}
