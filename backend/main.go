package main

import (
	"ECoin/controllers"
	"log"
	"net/http"
)

func main() {
	// ユーザー関連のエンドポイント登録
	http.HandleFunc("/api/users", controllers.HandleUsers)         // POST, GET (一覧など)
	http.HandleFunc("/api/users/", controllers.HandleUserByID)     // GET(id), PUT, DELETE

	// サーバー起動
	log.Println("Server started at http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("サーバー起動失敗:", err)
	}
}
