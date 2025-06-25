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


	// エンドポイント登録
	http.HandleFunc("/api/users", controllers.HandleUsers)
	http.HandleFunc("/api/users/", controllers.HandleUserByUUID)
	http.HandleFunc("/api/missions", controllers.HandleMissions)
	http.HandleFunc("/api/missions/", controllers.HandleUserMissions)
	// http.HandleFunc("/api/scores/", controllers.HandleScoreFilter)
	// http.HandleFunc("/api/scores", controllers.HandleScoreAll)

	// サーバー起動ポート
	addr := fmt.Sprintf(":%s", config.Config.Port)
	log.Printf("Server started at http://localhost%s\n", addr)

	// サーバー開始
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatal("サーバー起動失敗:", err)
	}
}