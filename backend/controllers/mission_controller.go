package controllers

import (
	"ECoin/app/models"
	"encoding/json"
	"net/http"
)

// func HandleMissions(w http.ResponseWriter, r *http.Request) {
// 	_, ok := r.Context().Value(middleware.UserContextKey).(*utils.Claims)
// 	if !ok {
// 		http.Error(w, "ユーザー情報が取得できません", http.StatusUnauthorized)
// 		return
// 	}

// 	switch r.Method {
// 	case http.MethodGet:
// 		missions, err := models.GetMission()
// 		if err != nil {
// 			http.Error(w, "ミッションの取得に失敗しました", http.StatusInternalServerError)
// 			return
// 		}
// 		w.Header().Set("Content-Type", "application/json")
// 		json.NewEncoder(w).Encode(missions)

// 	default:
// 		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
// 	}
// }

func HandleMissions(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		// ユーザー認証をチェックせず、全ミッション一覧を取得
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
