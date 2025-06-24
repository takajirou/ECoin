package models

import (
	"log"
	"time"
)

type Events struct {
	ID 				int
	RequestUser 	string
	Address 		string
	Title 			string
	Description 	string
	Active 			bool
	MeetingTime 	time.Time
	EndTime 		time.Time
	Point 			int
	Pref			string
	City			string
	capacity 		int
	RequestedAt 	time.Time
}

func (e *Events) CreateEvents(uuid string) (err error) {
	cmd := `insert into events(
		request_user,
		address,
		title,
		description,
		active,
		meeting_time,
		end_time,
		point,
		pref,
		city,
		capacity,
		requested_at) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err = Db.Exec(cmd,
		uuid,
		e.Address,
		e.Title,
		e.Description,
		e.Active,
		e.MeetingTime,
		e.EndTime,
		e.Point,
		e.Pref,
		e.City,
		e.capacity,
		time.Now(),
	)

	if err != nil {
		log.Fatalln(err)
	}

	return err
}