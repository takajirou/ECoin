package controllers

import (
	"ECoin/app/models"
	"encoding/json"
	"net/http"
	"strings"
)

// 該当データがあれば更新、なければ作成（アップサート）を行うAPIの例

func HandleUserScore(w http.ResponseWriter, r *http.Request) {
	// URLパスから userID を取得（例: /api/user/score/{userID}）
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 5 {
		http.Error(w, "invalid URL", http.StatusBadRequest)
		return
	}
	userID := parts[4]

	switch r.Method {
	case http.MethodPost:
		var s models.Score
		err := json.NewDecoder(r.Body).Decode(&s)
		if err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}

		// userID はURLパスのものを利用。body内の userID は無視してもOK
		s.UserID = userID

		// アップサート処理
		err = s.UpsertScore()
		if err != nil {
			http.Error(w, "failed to upsert score", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"message": "score updated or created"})

	case http.MethodGet:
		// GETならクエリパラメータから periodType, periodValue を取得して該当スコアを返す
		query := r.URL.Query()
		periodType := query.Get("period_type")
		periodValue := query.Get("period_value")

		if periodType == "" || periodValue == "" {
			http.Error(w, "period_type and period_value are required", http.StatusBadRequest)
			return
		}

		score, err := models.GetScoreByUserPeriod(userID, periodType, periodValue)
		if err != nil {
			http.Error(w, "score not found", http.StatusNotFound)
			return
		}

		json.NewEncoder(w).Encode(score)

	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}
