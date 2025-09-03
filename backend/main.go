package main

import (
	"ECoin/app/controllers"
	"ECoin/app/seeds"
	"ECoin/config"
	"ECoin/middleware"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// シード処理のオプション設定
	seedOpts := seeds.SeedOptions{
		CreateDefaultData: false,
		CreateMissions:    false,
		CreateReward:      false,
		CreateAccounts:    false,
		CreateScore:       false,
	}

	// シード処理実行
	seeds.RunSeeds(seedOpts)

	// 認証が不要なエンドポイント
	http.HandleFunc("/api/auth/login", controllers.HandleLogin)
	http.HandleFunc("/api/auth/logout", controllers.HandleLogout)
	http.HandleFunc("/api/auth/register", controllers.HandleUsers)
	http.HandleFunc("/api/missions", controllers.HandleMissions)

	// 認証が必要なエンドポイント（一般ユーザー用）
	http.Handle("/api/me", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleMe)))
	http.Handle("/api/profile", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleMyProfile)))
	http.Handle("/api/status/", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleMissionStats)))
	http.Handle("/api/ranking", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleScore)))
	http.Handle("/api/score/", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleUserScore)))
	http.Handle("/api/user/coin/plus", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleUserCoin)))
	http.Handle("/api/user/coin/minus", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleUserCoin)))
	http.Handle("/api/rewards", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleRewards)))
	http.Handle("/api/user/rewards", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleUserRewards)))

	// 管理者権限が必要なエンドポイント
	http.Handle("/api/admin/users",
		middleware.JWTMiddleware(
			middleware.AdminMiddleware(
				http.HandlerFunc(controllers.HandleUsers))))

	http.Handle("/api/admin/users/",
		middleware.JWTMiddleware(
			middleware.AdminMiddleware(
				http.HandlerFunc(controllers.HandleUserByUUID))))

	http.Handle("/api/admin/missions/",
		middleware.JWTMiddleware(
			middleware.AdminMiddleware(
				http.HandlerFunc(controllers.HandleEditMissions))))
	http.Handle("/api/admin/missions",
		middleware.JWTMiddleware(
			middleware.AdminMiddleware(
				http.HandlerFunc(controllers.HandleCreateMission))))

	// サーバー起動ポート
	addr := fmt.Sprintf(":%s", config.Config.Port)
	log.Printf("Server started at http://localhost%s\n", addr)

	// サーバー開始
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatal("サーバー起動失敗:", err)
	}
}