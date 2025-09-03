package seeds

import (
	"ECoin/app/models"
	"fmt"
	"log"
	"math/rand/v2"
	"time"
)

// ScorePair は月間と週間のスコアペアを表す
type ScorePair struct {
	Monthly int
	Weekly  int
}

// generateScorePair は月間スコアが週間スコアを下回らないようにスコアペアを生成
func generateScorePair() ScorePair {
	monthly := rand.IntN(101) + 100 // 100～200
	weekly := rand.IntN(monthly-49) + 50 // 50～monthly
	if weekly > monthly {
		weekly = monthly
	}
	return ScorePair{Monthly: monthly, Weekly: weekly}
}

// SeedScores は全ユーザーのスコアを作成
func SeedScores() {
	log.Println("全ユーザーのスコア作成を開始します...")
	err := SeedScoresForAllUsers()
	if err != nil {
		log.Printf("スコア作成に失敗: %v\n", err)
	} else {
		log.Println("全ユーザーのスコア作成が完了しました！")
	}
}

// SeedScoresForAllUsers は全ユーザーに対して過去5期間分のスコアデータを作成
func SeedScoresForAllUsers() error {
	users, err := models.GetAllUsers()
	if err != nil {
		return fmt.Errorf("ユーザー取得に失敗: %w", err)
	}

	now := time.Now()
	
	// 対象期間の定義
	periods := []struct {
		name string
		date time.Time
	}{
		{"今", now},
		{"先週", now.AddDate(0, 0, -7)},
		{"先々週", now.AddDate(0, 0, -14)},
		{"先月", now.AddDate(0, -1, 0)},
		{"先々月", now.AddDate(0, -2, 0)},
	}

	log.Printf("スコアデータ作成開始: %d ユーザー × %d 期間\n", len(users), len(periods))

	for i, user := range users {
		log.Printf("ユーザー %d/%d 処理中: %s\n", i+1, len(users), user.UUID)
		
		for _, period := range periods {
			scores := generateScorePair()

			// 月間スコアを保存
			err := models.SeedUpsertScore(user.UUID, "month", period.date, scores.Monthly)
			if err != nil {
				return fmt.Errorf("ユーザー %s の%s月間スコア更新失敗: %w", user.UUID, period.name, err)
			}

			// 週間スコアを保存
			err = models.SeedUpsertScore(user.UUID, "week", period.date, scores.Weekly)
			if err != nil {
				return fmt.Errorf("ユーザー %s の%s週間スコア更新失敗: %w", user.UUID, period.name, err)
			}

			log.Printf("  %s: 月間=%d, 週間=%d\n", period.name, scores.Monthly, scores.Weekly)
		}
	}

	return nil
}

// SeedSpecificUserScores は特定のユーザーにスコアを作成（テスト用）
func SeedSpecificUserScores(userID string) error {
	now := time.Now()
	
	periods := []struct {
		name string
		date time.Time
	}{
		{"今", now},
		{"先週", now.AddDate(0, 0, -7)},
		{"先々週", now.AddDate(0, 0, -14)},
		{"先月", now.AddDate(0, -1, 0)},
		{"先々月", now.AddDate(0, -2, 0)},
	}
	
	log.Printf("ユーザー %s のスコアデータ作成開始\n", userID)
	
	for _, period := range periods {
		scores := generateScorePair()
		
		// 月間スコアを保存
		err := models.SeedUpsertScore(userID, "month", period.date, scores.Monthly)
		if err != nil {
			return fmt.Errorf("ユーザー %s の%s月間スコア更新失敗: %w", userID, period.name, err)
		}
		
		// 週間スコアを保存
		err = models.SeedUpsertScore(userID, "week", period.date, scores.Weekly)
		if err != nil {
			return fmt.Errorf("ユーザー %s の%s週間スコア更新失敗: %w", userID, period.name, err)
		}
		
		log.Printf("  %s: 月間=%d, 週間=%d\n", period.name, scores.Monthly, scores.Weekly)
	}
	
	log.Println("スコアデータ作成完了")
	return nil
}