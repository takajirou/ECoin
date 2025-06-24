package models

import (
	"log"
	"time"
)

type UserRewards struct {
	ID 				int
	UserID 			string
	RewardID 		int
	ExchangedAt 	time.Time
}

func (ur *UserRewards) CreateUserReward(uuid string, reward_id int) (err error) {
	cmd := `insert into user_rewards(
		user_id,
		reward_id,
		exchanged_at) values(?, ?, ?)`

	_, err = Db.Exec(cmd,
		uuid,
		reward_id,
		time.Now(),
	)

	if err != nil {
		log.Fatalln(err)
	}

	return err
}

func GetUserRewardsByUUID(uuid string) (user_rewards UserRewards, err error){
	user_rewards = UserRewards{}
	cmd := `select id, user_id, reward_id, exchanged_at where user_id = ? from user_rewards`

	err = Db.QueryRow(cmd, uuid).Scan(
		&user_rewards.ID,
		&user_rewards.UserID,
		&user_rewards.RewardID,
		&user_rewards.ExchangedAt,
	)

	return user_rewards, err
}