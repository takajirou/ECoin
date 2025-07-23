package controllers

import (
	"ECoin/app/models"
	"encoding/json"
	"log"
	"net/http"
)

func HandleRewards(w http.ResponseWriter, r *http.Request) {
	switch r.Method{
	case http.MethodGet:
		rewards, err := models.GetRewards()
		if err != nil {
			log.Println("GetRewards エラー:", err)
			http.Error(w, "ミッションの取得に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		err = json.NewEncoder(w).Encode(rewards)
		if err != nil {
			log.Println("JSONエンコードエラー:", err)
			http.Error(w, "JSONエンコードに失敗しました", http.StatusInternalServerError)
			return
		}
			
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
	}
	
}