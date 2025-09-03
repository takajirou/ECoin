package models

type Ranking struct {
	UUID     string
	UserName string
	Score    int
}

func GetRankingWithUsers(periodType, periodValue string) ([]Ranking, error) {
	cmd := `
		SELECT u.uuid, u.name, s.earn_coin
		FROM score s
		JOIN users u ON s.user_id = u.uuid
		WHERE s.period_type = ? AND s.period_value = ?
		ORDER BY s.earn_coin DESC
	`

	rows, err := Db.Query(cmd, periodType, periodValue)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rankings []Ranking
	for rows.Next() {
		var r Ranking
		if err := rows.Scan(&r.UUID, &r.UserName, &r.Score); err != nil {
			return nil, err
		}
		rankings = append(rankings, r)
	}
	return rankings, nil
}
