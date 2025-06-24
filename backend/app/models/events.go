package models

import (
	"log"
	"time"
)

type Event struct {
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
	Capacity 		int
	RequestedAt 	time.Time
}

func (e *Event) CreateEvent(uuid string) (err error) {
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
		e.Capacity,
		time.Now(),
	)

	if err != nil {
		log.Fatalln(err)
	}

	return err
}

func GetNoneActiveEvents() (event Event, err error){
	event = Event{}

	cmd := `select id, request_user, title, description, address, active, meeting_time, end_time, point, pref, city, capacity, requested_at from events where active = 0`

	err = Db.QueryRow(cmd).Scan(
		&event.ID,
		&event.RequestUser,
		&event.Title,
		&event.Description,
		&event.Address,
		&event.Active,
		&event.MeetingTime,
		&event.EndTime,
		&event.Point,
		&event.Pref,
		&event.City,
		&event.Capacity,
		&event.RequestedAt,
	)

	return event, err
}
func GetEventsByEventID(event_id int) (event Event, err error){
	event = Event{}

	cmd := `select id, request_user, title, description, address, active, meeting_time, end_time, point, pref, city, capacity, requested_at from events where active = 1 and id = ?`

	err = Db.QueryRow(cmd, event_id).Scan(
		&event.ID,
		&event.RequestUser,
		&event.Title,
		&event.Description,
		&event.Address,
		&event.Active,
		&event.MeetingTime,
		&event.EndTime,
		&event.Point,
		&event.Pref,
		&event.City,
		&event.Capacity,
		&event.RequestedAt,
	)

	return event, err
}