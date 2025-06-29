package models

import (
	"log"
	"time"
)

type Mission struct {
	ID            int       `json:"id"`
	Title         string    `json:"title"`
	Description   string    `json:"description"`
	Difficulty    string    `json:"difficulty"`
	Point         int       `json:"point"`
	Require_proof bool      `json:"require_proof"`
	Active        bool      `json:"active"`
	CreatedAt     time.Time `json:"created_at"`
}

// ミッション作成
func (m *Mission) CreateMission() error {
	cmd := `INSERT INTO missions(
		title,
		description,
		difficulty,
		point,
		require_proof,
		active,
		created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`

	_, err := Db.Exec(cmd,
		m.Title,
		m.Description,
		m.Difficulty,
		m.Point,
		m.Require_proof,
		m.Active,
		time.Now(),
	)

	if err != nil {
		log.Println("CreateMission error:", err)
	}

	return err
}

// 複数ミッション取得（active = true のみ）
func GetMission() ([]Mission, error) {
	cmd := `SELECT id, title, description, difficulty, point, require_proof, active, created_at FROM missions WHERE active = true`

	rows, err := Db.Query(cmd)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var missions []Mission

	for rows.Next() {
		var m Mission
		err := rows.Scan(
			&m.ID,
			&m.Title,
			&m.Description,
			&m.Difficulty,
			&m.Point,
			&m.Require_proof,
			&m.Active,
			&m.CreatedAt,
		)
		if err != nil {
			log.Println("GetMission Scan error:", err)
			continue
		}
		missions = append(missions, m)
	}

	return missions, nil
}

// ミッション削除（id指定）
func (m *Mission) DeleteMission() error {
	cmd := `DELETE FROM missions WHERE id = ?`
	_, err := Db.Exec(cmd, m.ID)
	if err != nil {
		log.Println("DeleteMission error:", err)
	}
	return err
}
