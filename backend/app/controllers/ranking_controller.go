package controllers

import (
	"ECoin/app/models"
	"encoding/json"
	"net/http"
)

func HandleRankingWithUsers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		periodType := r.URL.Query().Get("period_type")
		periodValue := r.URL.Query().Get("period_value")

		if periodType == "" || periodValue == "" {
			http.Error(w, "period_type と period_value は必須です", http.StatusBadRequest)
			return
		}

		rankings, err := models.GetRankingWithUsers(periodType, periodValue)
		if err != nil {
			http.Error(w, "ランキング取得に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(rankings)

	default:
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
	}
}
