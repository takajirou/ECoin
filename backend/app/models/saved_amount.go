package models

import "log"

func GetSavedAmountByMissionStats(uuid, periodType, periodValue string) (int, error) {
	// 対象期間の mission_stats を取得
	cmd := `
		SELECT mission_id, clear_count 
		FROM mission_stats 
		WHERE user_id = ? AND period_type = ? AND period_value = ?
	`
	rows, err := Db.Query(cmd, uuid, periodType, periodValue)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	// ミッション情報を全件取得して map にする
	missions, err := GetMission()
	if err != nil {
		return 0, err
	}
	missionMap := make(map[int]int) // mission_id -> saved_amount
	for _, m := range missions {
		missionMap[m.ID] = m.Saved_amount
	}

	// ミッションごとの clear_count に saved_amount を乗算して合計
	totalSaved := 0
	for rows.Next() {
		var missionID, clearCount int
		if err := rows.Scan(&missionID, &clearCount); err != nil {
			log.Println("Scan error:", err)
			continue
		}
		if saved, ok := missionMap[missionID]; ok {
			totalSaved += saved * clearCount
		}
	}

	return totalSaved, nil
}
