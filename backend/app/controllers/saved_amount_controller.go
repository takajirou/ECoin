package controllers

import (
	"ECoin/app/models"
	"ECoin/middleware"
	"ECoin/utils"
	"encoding/json"
	"net/http"
)

func HandleSavedAmount(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*utils.Claims)
	if !ok {
		http.Error(w, "認証情報の取得に失敗しました", http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodGet:
		periodType := r.URL.Query().Get("period_type")
		periodValue := r.URL.Query().Get("period_value")

		if periodType == "" || periodValue == "" {
			http.Error(w, "period_type と period_value は必須です", http.StatusBadRequest)
			return
		}

		// ここで節約金額を取得
		totalSaved, err := models.GetSavedAmountByMissionStats(claims.UUID, periodType, periodValue)
		if err != nil {
			http.Error(w, "節約金額取得に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]int{
			"saved_amount": totalSaved,
		})

	default:
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
	}
}
