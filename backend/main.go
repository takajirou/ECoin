package main

import (
	"ECoin/config"
	"ECoin/controllers"
	"ECoin/middleware"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	/* ミッション作成用{
		testMission := &models.Mission{
			Title:         "車や公共交通機関を使わず徒歩・自転車で移動",
			Description:   "CO2排出量を削減！",
			Difficulty:    "hard",
			Point:         30,
			Require_proof: false,
			Active:        true,
			CreatedAt:     time.Now(),
		}

		err := testMission.CreateMission()
		if err != nil {
			log.Println("ミッション作成に失敗:", err)
		} else {
			log.Println("ミッション作成成功！")
		}
	 }	*/


	// 認証が不要なエンドポイント
	http.HandleFunc("/api/auth/login", controllers.HandleLogin)
	http.HandleFunc("/api/auth/logout", controllers.HandleLogout)
	http.HandleFunc("/api/auth/register", controllers.HandleUsers)
	http.HandleFunc("/api/missions", controllers.HandleMissions)

	// 認証が必要なエンドポイント（一般ユーザー用）
	http.Handle("/api/me", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleMe)))
	http.Handle("/api/profile", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleMyProfile)))
	http.Handle("/api/status", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleMissionStats)))
	// http.Handle("/api/status", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleMissionStats)))

	// 管理者権限が必要なエンドポイント
	http.Handle("/api/admin/users", 
	middleware.JWTMiddleware(
		middleware.AdminMiddleware(
			http.HandlerFunc(controllers.HandleUsers))))

	http.Handle("/api/admin/users/", 
		middleware.JWTMiddleware(
			middleware.AdminMiddleware(
				http.HandlerFunc(controllers.HandleUserByUUID))))
				
	http.HandleFunc("/api/users/", controllers.HandleUserByUUID)
	http.HandleFunc("/api/user/score/", controllers.HandleUserScore)

	// サーバー起動ポート
	addr := fmt.Sprintf(":%s", config.Config.Port)
	log.Printf("Server started at http://localhost%s\n", addr)

	// サーバー開始
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatal("サーバー起動失敗:", err)
	}
}