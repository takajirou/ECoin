package controllers

import (
	"ECoin/app/models"
	"ECoin/middleware"
	"ECoin/utils"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
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

		if periodType == "" {
			http.Error(w, "period_type は必須です", http.StatusBadRequest)
			return
		}

		// 現在の period_value を生成
		now := time.Now()
		var periodValue string

		switch periodType {
		case "week":
			year, week := now.ISOWeek()
			periodValue = fmt.Sprintf("%d-%02d", year, week)
		case "month":
			periodValue = fmt.Sprintf("%d-%02d", now.Year(), int(now.Month()))
		default:
			http.Error(w, "不正な period_type です (week または month を指定してください)", http.StatusBadRequest)
			return
		}

		// 節約金額を取得
		totalSaved, err := models.GetSavedAmountByMissionStats(claims.UUID, periodType, periodValue)
		if err != nil {
			http.Error(w, "節約金額取得に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"period_type":  periodType,
			"period_value": periodValue,
			"saved_amount": totalSaved,
		})

	default:
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
	}
}
