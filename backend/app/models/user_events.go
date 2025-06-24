package models

import (
	"log"
	"time"
)

type UserEvent struct {
	ID 			int
	EventID 	int
	UserID 		string
	Active 		bool
	RequestedAt time.Time
}

func (ue *UserEvent) CreateUserEvent(uuid string, event_id int) (err error){
	cmd := `insert into user_events(
		event_id,
		user_id,
		active,
		requested_at
	)`

	_, err = Db.Exec(cmd,
		event_id,
		uuid,
		ue.Active,
		time.Now(),
	)

	if err != nil {
		log.Fatalln(err)
	}

	return err
}

func GetUserEventsByUUID(uuid string) (user_event UserEvent, err error){
	user_event = UserEvent{}
	cmd := `select id, event_id, user_id, active, requested_at from user_events where uuid = ?`

	err = Db.QueryRow(cmd,uuid).Scan(
		&user_event.ID,
		&user_event.EventID,
		&user_event.UserID,
		&user_event.Active,
		&user_event.RequestedAt,
	)

	return user_event, err
}
