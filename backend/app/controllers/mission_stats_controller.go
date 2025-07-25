package controllers

import (
	"ECoin/app/models"
	"ECoin/middleware"
	"ECoin/utils"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

func HandleMissionStats(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*utils.Claims)
	if !ok {
		http.Error(w, "認証情報の取得に失敗しました", http.StatusUnauthorized)
		return
	}

	// URLから missionID を取得
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		http.Error(w, "URLが不正です", http.StatusBadRequest)
		return
	}
	missionIDStr := parts[3]
	missionID, err := strconv.Atoi(missionIDStr)
	if err != nil {
		http.Error(w, "mission_id は整数で指定してください", http.StatusBadRequest)
		return
	}

	if r.Method == http.MethodPost {
		err := models.UpsertMissionStatsAllPeriods(claims.UUID, missionID)
		if err != nil {
			http.Error(w, "ミッション統計の更新に失敗しました", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "ミッション統計を更新しました"})
		return
	}

	http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
}
