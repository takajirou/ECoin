package controllers

import (
	"ECoin/app/models"
	"ECoin/middleware"
	"ECoin/utils"
	"encoding/json"
	"net/http"
)

func HandleUserScore(w http.ResponseWriter, r *http.Request) {
	// JWTからユーザー情報を取得
	claims, ok := r.Context().Value(middleware.UserContextKey).(*utils.Claims)
	if !ok {
		http.Error(w, "認証情報の取得に失敗しました", http.StatusUnauthorized)
		return
	}
	userID := claims.UUID

	switch r.Method {
	case http.MethodPost:
		var s models.Score
		err := json.NewDecoder(r.Body).Decode(&s)
		if err != nil {
			http.Error(w, "無効なリクエストボディです", http.StatusBadRequest)
			return
		}

		// トークンから取得したユーザーIDを使用
		s.UserID = userID

		err = s.UpsertScore()
		if err != nil {
			http.Error(w, "スコアの更新に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "スコアを更新または作成しました"})

	case http.MethodGet:
		periodType := r.URL.Query().Get("period_type")
		periodValue := r.URL.Query().Get("period_value")

		if periodType == "" || periodValue == "" {
			http.Error(w, "period_type と period_value は必須です", http.StatusBadRequest)
			return
		}

		score, err := models.GetScoreByUserPeriod(userID, periodType, periodValue)
		if err != nil {
			http.Error(w, "スコアが見つかりません", http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(score)

	default:
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
	}
}
