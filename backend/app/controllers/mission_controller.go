package controllers

import (
	"ECoin/app/models"
	"encoding/json"
	"net/http"
)

func HandleMissions(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		// 全ミッション一覧を取得
		missions, err := models.GetMission()
		if err != nil {
			http.Error(w, "ミッションの取得に失敗しました", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(missions)

	default:
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
	}
}

func HandleEditMissions(w http.ResponseWriter,r *http.Request){
	switch r.Method {
		case http.MethodPut:


		case http.MethodDelete:

		case http.MethodPost:
	}
}
