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
func GetScoreByUserPeriod(userID, periodType, periodValue string) (Score, error) {
	var s Score
	cmd := `SELECT id, user_id, earn_coin, period_type, period_value, created_at
			FROM score
			WHERE user_id = ? AND period_type = ? AND period_value = ?`
	err := Db.QueryRow(cmd, userID, periodType, periodValue).Scan(
		&s.ID, &s.UserID, &s.EarnCoin, &s.PeriodType, &s.PeriodValue, &s.CreatedAt,
	)
	return s, err
}


// アップサート（存在すれば更新、なければ挿入）
func (s *Score) UpsertScore() error {
	// 事前にDBで (user_id, period_type, period_value) にユニーク制約をつけておく必要があります
	cmd := `
	INSERT INTO score (user_id, earn_coin, period_type, period_value, created_at)
	VALUES (?, ?, ?, ?, NOW())
	ON DUPLICATE KEY UPDATE
		earn_coin = VALUES(earn_coin),
		created_at = NOW()
	`
	_, err := Db.Exec(cmd, s.UserID, s.EarnCoin, s.PeriodType, s.PeriodValue)
	if err != nil {
		log.Println("UpsertScore error:", err)
	}
	return err
}
