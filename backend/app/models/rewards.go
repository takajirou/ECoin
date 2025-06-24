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

func GetRewards() (rewards Rewards, err error) {
	rewards = Rewards{}

	cmd := `select id, name, description, required_points, active, created_at from rewards`

	err = Db.QueryRow(cmd).Scan(
		&rewards.ID,
		&rewards.Name,
		&rewards.Description,
		&rewards.RequiredPoints,
		&rewards.Active,
		&rewards.CreatedAt,
	)
	return rewards, err
}
