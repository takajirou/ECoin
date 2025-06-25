package controllers

import (
	"ECoin/app/models"
	"encoding/json"
	"io"
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
	switch r.Method {
		case http.MethodPost:
			var um models.UserMission
			body, _ := io.ReadAll(r.Body)
			json.Unmarshal(body, &um)
			um.CreateUserMissionByUUID(uuid,missionID)
			json.NewEncoder(w).Encode(map[string]string{"message" : "created"})

		case http.MethodGet:
			user_mission, err := models.GetTodayUserMissionByUUID(uuid)
			if err != nil {
				http.Error(w, "User not found", http.StatusNotFound)
				return
			}
			json.NewEncoder(w).Encode(user_mission)

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}