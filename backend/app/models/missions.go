package models

import (
	"log"
	"time"
)

type Mission struct {
	ID 				int
	Title 			string
	Description 	string
	Difficulty 		string
	Point 			int 
	Require_proof 	bool
	Active 			bool
	CreatedAt 		time.Time
}

func (m *Mission) CreateMission() (err error) {
	cmd:= `insert into missions(
		title,
		description,
		difficulty,
		point,
		require_proof,
		active,
		created_at) values (?, ?, ?, ?, ?, ?, ?)`

	_, err = Db.Exec(cmd,
		m.Title,
		m.Description,
		m.Difficulty,
		m.Point,
		m.Require_proof,
		m.Active,
		time.Now(),
	)

	if err != nil {
		log.Fatalln(err)
	}

	return err
}

func GetMission() (mission Mission, err error) {
	mission = Mission{}

	cmd := `select id, title, description, difficulty, point, created_at, require_proof from missions where active = true`

	err = Db.QueryRow(cmd).Scan(
		&mission.ID,
		&mission.Title,
		&mission.Description,
		&mission.Difficulty,
		&mission.Point,
		&mission.Require_proof,
		&mission.CreatedAt,
	)

	return mission, err
}

func (m *Mission) DeleteMission() (err error){
	cmd := `delete from users where id = ?`
	_, err = Db.Exec(cmd, m.ID)
	if  err != nil{
		log.Fatalln(err)
	}
	return err
}