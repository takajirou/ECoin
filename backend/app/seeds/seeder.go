package seeds

import (
	"ECoin/app/models"
	"log"
	"time"
)

// SeedOptions はシード処理のオプションを定義
type SeedOptions struct {
	CreateDefaultData bool
	CreateMissions    bool
	CreateReward      bool
	CreateAccounts    bool
	CreateScore       bool
}

// RunSeeds は指定されたオプションに基づいてシード処理を実行
func RunSeeds(opts SeedOptions) {
	if opts.CreateMissions || opts.CreateDefaultData {
		SeedMissions()
	}

	if opts.CreateReward || opts.CreateDefaultData {
		SeedRewards()
	}

	if opts.CreateScore {
		SeedScores()
	}

	if opts.CreateAccounts || opts.CreateDefaultData {
		SeedUsers()
	}
}

// SeedMissions はミッションデータを作成
func SeedMissions() {
	log.Println("ミッションデータの作成を開始します...")

	missionsData := []struct {
		Title         string
		Description   string
		Difficulty    string
		Point         int
		Saved_amount  int
		Require_proof bool
	}{
		{"歯みがき中に水を止める(1回)", "歯みがき中は水道の蛇口を止めて、水の無駄遣いを防ごう！", "easy", 10, 3, false},
		{"レジ袋を使わずエコバッグで買い物(1回)", "プラスチック削減のため、エコバッグを持参して買い物をしよう！", "easy", 10, 3, false},
		{"買い物でラベルレス商品を選ぶ(1回)", "ラベルレス商品を選んでプラスチック廃棄物を減らそう！", "easy", 10, 30, false},
		{"洗濯をまとめて行う(1回短縮)", "", "medium", 20, 15, false},
		{"お風呂の残り湯を洗濯に使う(1回)", "お風呂の残り湯を有効活用して節水に貢献しよう！", "medium", 20, 15, false},
		{"マイボトルのみを使用して過ごす(1日)", "ペットボトルを使わず、マイボトルで水分補給をしよう！", "medium", 20, 120, false},
		{"使っていないコンセントを抜く(1日)", "待機電力を削減するため、使用していない電気製品のコンセントを抜こう！", "medium", 20, 15, false},
		{"車・バスを使わず徒歩・自転車で移動(1km)", "CO2排出量を削減するため、徒歩や自転車で移動しよう！", "hard", 30, 30, false},
	}

	for i, data := range missionsData {
		mission := &models.Mission{
			Title:         data.Title,
			Description:   data.Description,
			Difficulty:    data.Difficulty,
			Point:         data.Point,
			Saved_amount:  data.Saved_amount,
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

// SeedRewards はリワードデータを作成
func SeedRewards() {
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

// SeedUsers はユーザーアカウントを作成
func SeedUsers() {
	log.Println("ユーザーアカウントの作成を開始します...")

	users := []models.User{
		{
			Name:     "一般ユーザー",
			Email:    "eco@example.com",
			Password: "ts20060219",
			Coins:    300,
			Pref:     "東京都",
			City:     "新宿区",
			Admin:    false,
		},
		{
			Name:     "管理者ユーザー",
			Email:    "admin@example.com",
			Password: "admin0219",
			Coins:    900,
			Pref:     "東京都",
			City:     "千代田区",
			Admin:    true,
		},
		{
			Name:     "テストユーザー1",
			Email:    "test1@example.com",
			Password: "test0219",
			Coins:    300,
			Pref:     "東京都",
			City:     "千代田区",
			Admin:    false,
		},
		{
			Name:     "テストユーザー2",
			Email:    "test2@example.com",
			Password: "test0219",
			Coins:    500,
			Pref:     "東京都",
			City:     "千代田区",
			Admin:    false,
		},
		{
			Name:     "テストユーザー3",
			Email:    "test3@example.com",
			Password: "test0219",
			Coins:    200,
			Pref:     "東京都",
			City:     "千代田区",
			Admin:    false,
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