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

func HandleUserScore(w http.ResponseWriter, r *http.Request) {
	// JWTからユーザー情報を取得
	claims, ok := r.Context().Value(middleware.UserContextKey).(*utils.Claims)
	if !ok {
		http.Error(w, "認証情報の取得に失敗しました", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		http.Error(w, "URLが不正です", http.StatusBadRequest)
		return
	}
	scoreStr := parts[3]
	score, err := strconv.Atoi(scoreStr)
	if err != nil {
		http.Error(w, "score は整数で指定してください", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPost:
		err := models.UpsertScoreAllPeriods(claims.UUID, score)
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

		score, err := models.GetScoreByUserPeriod(claims.UUID, periodType, periodValue)
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
