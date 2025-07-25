package models

import (
	"time"
)

type UserRewards struct {
	ID 				int
	UserID 			string
	RewardID 		int
	ExchangedAt 	time.Time
}

func CreateUserReward(uuid string, rewardID int) (*UserRewards, error) {
    ur := &UserRewards{
        UserID:      uuid,
        RewardID:    rewardID,
        ExchangedAt: time.Now(),
    }
    
    cmd := `insert into user_rewards(user_id, reward_id, exchanged_at) values(?, ?, ?)`
    _, err := Db.Exec(cmd, ur.UserID, ur.RewardID, ur.ExchangedAt)
    if err != nil {
        return nil, err
    }
    
    return ur, nil
}

func GetUserRewardsByUUID(uuid string) (user_rewards UserRewards, err error){
	user_rewards = UserRewards{}
	cmd := `select id, user_id, reward_id, exchanged_at from user_rewards where user_id = ?`

	err = Db.QueryRow(cmd, uuid).Scan(
		&user_rewards.ID,
		&user_rewards.UserID,
		&user_rewards.RewardID,
		&user_rewards.ExchangedAt,
	)

	return user_rewards, err
}