package models

import (
	"log"
	"time"
)

type Rewards struct {
	ID 				int
	Name 			string
	Description 	string
	RequiredPoints 	int
	Active			bool
	CreatedAt		time.Time
}

func (r *Rewards) CreateRewards() (err error){
	cmd := `insert into users(
		name,
		description,
		required_points,
		active,
		created_at
	) values (?, ?, ?, ?, ?)`

	_, err = Db.Exec(cmd,
		r.Name,
		r.Description,
		r.RequiredPoints,
		r.Active,
		time.Now(),
	)
	if err != nil {
		log.Fatalln(err)
	}

	return nil
}

func GetRewards() (rewards []Rewards, err error) {
	rewards = []Rewards{}

	cmd := `select id, name, description, required_points, active, created_at from rewards`

	rows, err := Db.Query(cmd)
	if err != nil {
		return rewards, err
	}
	defer rows.Close()

	for rows.Next() {
		var reward Rewards
		err = rows.Scan(
			&reward.ID,
			&reward.Name,
			&reward.Description,
			&reward.RequiredPoints,
			&reward.Active,
			&reward.CreatedAt,
		)
		if err != nil {
			return rewards, err
		}
		rewards = append(rewards, reward)
	}

	// rows.Next()のループでエラーが発生した場合をチェック
	if err = rows.Err(); err != nil {
		return rewards, err
	}

	return rewards, nil
}