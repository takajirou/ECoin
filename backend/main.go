package main

import (
	"ECoin/app/controllers"
	"ECoin/app/models"
	"ECoin/config"
	"ECoin/middleware"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// ミッション作成のコード
	createMissions := false
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

	// 報酬作成のコード
	createReward := false
	if createReward {
		log.Println("リワードデータの作成を開始します...")

		rewardsData := []struct {
			Name           string
			Description    string
			ImagePath      string
			RequiredPoints int
		}{
			{"エコタオル", "廃材や再生繊維から作られた環境にやさしいタオル", "towel", 10},
			{"マイボトル", "再利用可能でデザイン性のある水筒", "waterBottle", 10},
			{"シリコンストロー", "繰り返し使える柔らかいストロー。", "siliconeStraw", 10},
			{"再生紙ノート", "古紙から作られたノート。ナチュラルな風合いが魅力", "note", 10},
			{"エコバッグ", "小さく折り畳めるタイプなど種類豊富に展開可能", "bag", 20},
			{"ラベルレスウォーター", "分別・リサイクルがしやすいミネラルウォーター", "labelFree", 20},
			{"蜜蝋ラップ", "ラップの代わりに使える自然素材のフードラップ", "wrap", 20},
			{"木製カトラリーセット", "竹や木材を使用したカトラリー。持ち運び袋付き", "cutlery", 30},
		}

		for i, data := range rewardsData {
			reward := &models.Reward{
				Name:           data.Name,
				Description:    data.Description,
				ImagePath:      data.ImagePath,
				RequiredPoints: data.RequiredPoints,
				Active:         true,
				CreatedAt:      time.Now(),
			}

			err := reward.CreateReward()
			if err != nil {
				log.Printf("リワード%d作成に失敗: %v\n", i+1, err)
			} else {
				log.Printf("リワード作成成功: %s\n", reward.Name)
			}
		}
		log.Println("リワードデータの作成が完了しました！")
	}

	createAccounts := false
	if createAccounts {
		log.Println("ユーザーアカウントの作成を開始します...")

		users := []models.User{
			{
				Name:     "一般ユーザー",
				Email:    "eco@example.com",
				Password: "ts20060219",
				Coins:    0,
				Pref:     "東京都",
				City:     "新宿区",
				Admin:    false,
			},
			{
				Name:     "管理者ユーザー",
				Email:    "admin@example.com",
				Password: "admin0219",
				Coins:    0,
				Pref:     "東京都",
				City:     "千代田区",
				Admin:    true,
			},
		}

		for _, user := range users {
			err := user.CreateUser()
			if err != nil {
				log.Printf("ユーザー %s の作成に失敗: %v\n", user.Email, err)
			} else {
				log.Printf("ユーザー作成成功: %s\n", user.Email)
			}
		}
		log.Println("ユーザーアカウントの作成が完了しました！")
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
				http.HandlerFunc(controllers.HandleUserByUUID))))

	// サーバー起動ポート
	addr := fmt.Sprintf(":%s", config.Config.Port)
	log.Printf("Server started at http://localhost%s\n", addr)

	// サーバー開始
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Fatal("サーバー起動失敗:", err)
	}
}
