package models

import (
	"fmt"
	"log"
	"time"
)

// SeedUpsertScore はシード用のスコア挿入関数（既存のscoreテーブルを使用）
func SeedUpsertScore(userID string, periodType string, date time.Time, score int) error {
	var periodValue string
	
	// 期間の値を計算
	switch periodType {
	case "week":
		periodValue = GetSeedYearWeekForDate(date)
	case "month":
		periodValue = GetSeedYearMonthForDate(date)
	default:
		return fmt.Errorf("サポートされていない期間タイプ: %s", periodType)
	}
	
	// 既存のUpsertScore関数を使用してダミーデータを挿入
	err := UpsertScore(userID, score, periodType, periodValue)
	if err != nil {
		log.Printf("シードスコア挿入エラー (ユーザー: %s, 期間: %s, 値: %s, スコア: %d): %v", 
			userID, periodType, periodValue, score, err)
		return fmt.Errorf("シードスコア挿入エラー: %w", err)
	}
	
	return nil
}

// GetSeedYearWeekForDate は指定された日付の年週を取得（シード用）
func GetSeedYearWeekForDate(date time.Time) string {
	year, week := date.ISOWeek()
	return fmt.Sprintf("%d-W%02d", year, week)
}

// GetSeedYearMonthForDate は指定された日付の年月を取得（シード用）
func GetSeedYearMonthForDate(date time.Time) string {
	return date.Format("2006-01")
}