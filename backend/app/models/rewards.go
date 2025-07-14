package models

import (
	"log"
	"time"
)

type Reward struct {
	ID             int
	Name           string
	Description    string
	RequiredPoints int
	ImagePath      string
	Active         bool
	CreatedAt      time.Time
}

func (r *Reward) CreateReward() (err error) {
	cmd := `insert into rewards(
		name,
		description,
		required_points,
		image_path,
		active,
		created_at
	) values (?, ?, ?, ?, ?, ?)`

	_, err = Db.Exec(cmd,
		r.Name,
		r.Description,
		r.RequiredPoints,
		r.ImagePath,
		r.Active,
		r.CreatedAt,
	)
	if err != nil {
		log.Fatalln(err)
	}

	return nil
}
func GetRewards() (rewards []Reward, err error) {
	rewards = []Reward{}

	cmd := `select id, name, description, required_points, image_path, active, created_at from rewards`

	rows, err := Db.Query(cmd)
	if err != nil {
		return rewards, err
	}
	defer rows.Close()

	for rows.Next() {
		var reward Reward
		err = rows.Scan(
			&reward.ID,
			&reward.Name,
			&reward.Description,
			&reward.RequiredPoints,
			&reward.ImagePath,
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
