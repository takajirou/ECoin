package models

import "log"

type Rewards struct {
	ID 				int
	Name 			string
	Description 	string
	RequiredPoints 	int
}

func (r *Rewards) CreateRewards() (err error){
	cmd := `insert into users(
		name,
		description,
		required_points
	) values (?, ?, ?)`

	_, err = Db.Exec(cmd,
		r.Name,
		r.Description,
		r.RequiredPoints,
	)
	if err != nil {
		log.Fatalln(err)
	}

	return nil
}

func GetRewards() (rewards Rewards, err error) {
	rewards = Rewards{}

	cmd := `select id, name, description, required_points from rewards`

	err = Db.QueryRow(cmd).Scan(
		&rewards.ID,
		&rewards.Name,
		&rewards.Description,
		&rewards.RequiredPoints,
	)
	return rewards, err
}
