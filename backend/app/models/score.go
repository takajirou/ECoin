package models

import (
	"log"
	"time"
)

type Score struct {
	ID          int
	UserID      string
	EarnCoin    int
	PeriodType  string
	PeriodValue string
	CreatedAt   time.Time
}

// period_type と period_value に合致するスコアを取得
func GetUserScoreByPeriod(userID, periodType, periodValue string) (Score, error) {
	var s Score
	cmd := `SELECT id, user_id, earn_coin, period_type, period_value, created_at
			FROM score
			WHERE user_id = ? AND period_type = ? AND period_value = ?`
	err := Db.QueryRow(cmd, userID, periodType, periodValue).Scan(
		&s.ID, &s.UserID, &s.EarnCoin, &s.PeriodType, &s.PeriodValue, &s.CreatedAt,
	)
	return s, err
}

func GetRanking(periodType, periodValue string) (Score, error) {
	var s Score
	cmd := `SELECT id, user_id, earn_coin, period_type, period_value, created_at
			FROM score
			WHERE period_type = ? AND period_value = ?`
	err := Db.QueryRow(cmd, periodType, periodValue).Scan(
		&s.ID, &s.UserID, &s.EarnCoin, &s.PeriodType, &s.PeriodValue, &s.CreatedAt,
	)
	return s, err
}

// アップサート（存在すれば更新、なければ挿入）
func UpsertScoreAllPeriods(userID string, score int) error {
	periods := []struct {
		periodType  string
		periodValue string
	}{
		{"week", GetCurrentYearWeek()},
		{"month", GetCurrentYearMonth()},
	}

	for _, p := range periods {
		err := UpsertScore(userID, score, p.periodType, p.periodValue)
		if err != nil {
			return err
		}
	}
	return nil
}

func UpsertScore(userID string, score int, periodType, periodValue string) error {
	cmd := `
	INSERT INTO score (
		user_id, earn_coin, period_type, period_value, created_at
	)VALUES (?, ?, ?, ?, NOW())
	ON DUPLICATE KEY UPDATE
		earn_coin = earn_coin + ?,
		created_at = NOW()
	`
	_, err := Db.Exec(cmd, userID, score, periodType, periodValue, score)
	if err != nil {
		log.Println("UpsertScore error:", err)
	}
	return err
}
