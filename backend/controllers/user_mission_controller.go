package controllers

import (
	"ECoin/app/models"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

func HandleUserMissions(w http.ResponseWriter, r *http.Request) {
	uuid := strings.Split(r.URL.Path, "/")[3]
	missionIDStr := strings.Split(r.URL.Path, "/")[4]
	missionID, err := strconv.Atoi(missionIDStr)
	if err != nil {
		http.Error(w, "mission_id must be an integer", http.StatusBadRequest)
		return
	}

	if r.Method == http.MethodPost {
		err := models.UpsertMissionStatsAllPeriods(uuid, missionID)
		if err != nil {
			http.Error(w, "Failed to update mission stats", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"message": "mission stats updated"})
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}