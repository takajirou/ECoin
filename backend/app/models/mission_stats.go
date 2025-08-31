package models

import (
	"time"
)

type MissionStats struct {
	ID          int
	UserID      string
	MissionID   int
	ClearCount  int
	PeriodType  string
	PeriodValue string
	UpdatedAt   time.Time
}

func UpsertMissionStatsAllPeriods(userID string, missionID int) error {
	periods := []struct {
		periodType  string
		periodValue string
	}{
		{"week", GetCurrentYearWeek()},
		{"month", GetCurrentYearMonth()},
		{"total", "total"},
	}

	for _, p := range periods {
		err := UpsertMissionStats(userID, missionID, p.periodType, p.periodValue)
		if err != nil {
			return err
		}
	}
	return nil
}

func UpsertMissionStats(userID string, missionID int, periodType, periodValue string) error {
	cmd := `
		INSERT INTO mission_stats (
			user_id, mission_id, clear_count, period_type, period_value, updated_at
		) VALUES (?, ?, 1, ?, ?, NOW())
		ON DUPLICATE KEY UPDATE
			clear_count = clear_count + 1,
			updated_at = NOW();`

	_, err := Db.Exec(cmd, userID, missionID, periodType, periodValue)
	return err
}

// 当日のミッション達成状況
func GetTodayUserMissionByUUID(uuid string) (mission_stats MissionStats, err error) {
	mission_stats = MissionStats{}

	cmd := `select id, user_id, mission_id, clear_count, period_type, period_value, updated_at from mission_stats where user_id = ? and updated_at = CURDATE()`

	err = Db.QueryRow(cmd, uuid).Scan(
		&mission_stats.ID,
		&mission_stats.UserID,
		&mission_stats.MissionID,
		&mission_stats.ClearCount,
		&mission_stats.PeriodType,
		&mission_stats.PeriodValue,
		&mission_stats.UpdatedAt,
	)

	return mission_stats, err
}

// 統計用 週/月毎に取得
func GetTodayMissionStatsByPeriod(uuid string, period_type string, period_value string) (mission_stats MissionStats, err error) {
	mission_stats = MissionStats{}

	cmd := `select id, user_id, mission_id, clear_count, period_type, period_value, updated_at from mission_stats where user_id = ? and period_type = ? and period_value = ?`
	err = Db.QueryRow(cmd, uuid, period_type, period_value).Scan(
		&mission_stats.ID,
		&mission_stats.UserID,
		&mission_stats.MissionID,
		&mission_stats.ClearCount,
		&mission_stats.PeriodType,
		&mission_stats.PeriodValue,
		&mission_stats.UpdatedAt,
	)

	return mission_stats, err
}
