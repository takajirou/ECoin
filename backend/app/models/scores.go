package models

import (
	"log"
	"time"
)

type Score struct {
	ID 			int
	UserID 		string
	EarnCoin 	int
	PeriodType 	string
	PeriodValue string
	CreatedAt 	time.Time
}

func (s *Score) CreateScores(uuid string) (err error){
	cmd := `insert into score(
		user_id,
		earn_coin,
		period_type,
		period_value,
		created_at) values(?, ?, ?, ?, ?)
	)`

	_, err = Db.Exec(cmd,
		s.ID,
		s.EarnCoin,
		s.PeriodType,
		s.PeriodValue,
		time.Now(),
	)

	if err != nil{
		log.Println(err)
	}

	return nil
}

func GetScores(period string) (score Score, err error) {
	score = Score{}

	cmd := `select id, user_id, earn_coin, period_type, period_value, created_at from score where period_type = ?`

	err = Db.QueryRow(cmd, period).Scan(
		&score.ID,
		&score.UserID,
		&score.EarnCoin,
		&score.PeriodType,
		&score.PeriodValue,
		&score.CreatedAt,
	)

	return score, err
}