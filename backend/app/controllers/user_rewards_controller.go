package controllers

import (
	"ECoin/app/models"
	"ECoin/middleware"
	"ECoin/utils"
	"encoding/json"
	"log"
	"net/http"
)

func HandleUserRewards(w http.ResponseWriter, r *http.Request) {
	// JWTからユーザー情報を取得
	claims, ok := r.Context().Value(middleware.UserContextKey).(*utils.Claims)
	if !ok {
		http.Error(w, "認証情報の取得に失敗しました", http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodPost:
		// リクエストボディからreward_idを読み取る
		var req struct {
			RewardID int `json:"reward_id"`
		}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Println("リクエストのデコードに失敗:", err)
			http.Error(w, "リクエスト形式が正しくありません", http.StatusBadRequest)
			return
		}

		// reward_id をもとに報酬を登録
		rewards, err := models.CreateUserReward(claims.UUID, req.RewardID)
		if err != nil {
			log.Println("CreateUserReward エラー:", err)
			http.Error(w, "交換履歴の作成に失敗しました。", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(rewards); err != nil {
			log.Println("JSONエンコードエラー:", err)
			http.Error(w, "JSONエンコードに失敗しました", http.StatusInternalServerError)
			return
		}
			
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
	}
	
}