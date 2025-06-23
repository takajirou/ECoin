package controllers

import (
	"ECoin/app/models"
	"encoding/json"
	"net/http"
)

func HandleMissions(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
		case http.MethodGet:
			missions, err := models.GetMission()
			if err != nil{
				http.Error(w, "Failed to get users", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(missions)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}