package main

import (
	"ECoin/app/models"
	"ECoin/config"
	"ECoin/controllers"
	"ECoin/middleware"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	createMissions := false // 実行したい時はtrueに変更
	
	if createMissions {
		log.Println("ミッションデータの作成を開始します...")
		
		missionsData := []struct {
			Title         string
			Description   string
			Difficulty    string
			Point         int
			Require_proof bool
		}{
			{"歯みがき中に水を止める", "歯みがき中は水道の蛇口を止めて、水の無駄遣いを防ごう！", "easy", 10, false},
			{"レジ袋を使わずエコバッグで買い物", "プラスチック削減のため、エコバッグを持参して買い物をしよう！", "easy", 10, false},
			{"買い物でラベルレス商品を選ぶ", "ラベルレス商品を選んでプラスチック廃棄物を減らそう！", "easy", 10, false},
			{"お風呂の残り湯を洗濯に使う", "お風呂の残り湯を有効活用して節水に貢献しよう！", "medium", 20, false},
			{"マイボトルで1日過ごす", "ペットボトルを使わず、マイボトルで水分補給をしよう！", "medium", 20, false},
			{"使っていないコンセントを抜く", "待機電力を削減するため、使用していない電気製品のコンセントを抜こう！", "medium", 20, false},
			{"車・バスを使わず徒歩・自転車で移動", "CO2排出量を削減するため、徒歩や自転車で移動しよう！", "hard", 30, false},
		}

		for i, data := range missionsData {
			mission := &models.Mission{
				Title:         data.Title,
				Description:   data.Description,
				Difficulty:    data.Difficulty,
				Point:         data.Point,
				Require_proof: data.Require_proof,
				Active:        true,
				CreatedAt:     time.Now(),
			}

			err := mission.CreateMission()
			if err != nil {
				log.Printf("ミッション%d作成に失敗: %v\n", i+1, err)
			} else {
				log.Printf("ミッション作成成功: %s\n", mission.Title)
			}
		}
		log.Println("ミッションデータの作成が完了しました！")
	}

	// 認証が不要なエンドポイント
	http.HandleFunc("/api/auth/login", controllers.HandleLogin)
	http.HandleFunc("/api/auth/logout", controllers.HandleLogout)
	http.HandleFunc("/api/auth/register", controllers.HandleUsers)
	http.HandleFunc("/api/missions", controllers.HandleMissions)

	// 認証が必要なエンドポイント（一般ユーザー用）
	http.Handle("/api/me", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleMe)))
	http.Handle("/api/profile", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleMyProfile)))
	http.Handle("/api/status/", middleware.JWTMiddleware(http.HandlerFunc(controllers.HandleMissionStats)))

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