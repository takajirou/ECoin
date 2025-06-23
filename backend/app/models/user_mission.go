package models

import (
	"log"
	"time"
)

type UserMission struct {
	ID int
	UserID string
	MissionID int
	ProofImageUrl string
	FinishedAt string
	CreatedAt time.Time
}

func (um *UserMission) CreateUserMissionByUUID(uuid string, mission_id int) (err error) {
	cmd := `insert into user_mission(
		user_id,
		mission_id,
		proof_image_url,
		finished_at,
		created_at) values (?, ?, ?, ?, ?, ?, ?)`
	
	now := time.Now()
	finishedDate := now.Format("2006-01-02")

	_, err = Db.Exec(cmd,
		uuid,
		mission_id,
		um.ProofImageUrl,
		finishedDate,
		time.Now(),
	)

	if err != nil {
		log.Fatalln(err)
	}

	return err
}

func GetTodayUserMissionByUUID(uuid string, date string) (user_mission UserMission, err error){
	user_mission = UserMission{}

	cmd := `select id, user_id, mission_id, proof_image_url, finished_at, created_at from user_mission where user_id = ? and finished_at = CURDATE()`

	err = Db.QueryRow(cmd, uuid).Scan(
		&user_mission.ID,
		&user_mission.UserID,
		&user_mission.MissionID,
		&user_mission.ProofImageUrl,
		&user_mission.FinishedAt,
		&user_mission.CreatedAt,
	)

	return user_mission, err
}



