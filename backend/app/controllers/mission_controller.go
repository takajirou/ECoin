package controllers

import (
	"ECoin/app/models"
	"encoding/json"
	"log"
	"net/http"
)

func HandleMissions(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		// 全ミッション一覧を取得
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

func HandleEditMissions(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPut:

	case http.MethodDelete:
		var req struct {
			MissionID int `json:"mission_id"`
		}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Println("リクエストのデコードに失敗:", err)
			http.Error(w, "リクエスト形式が正しくありません", http.StatusBadRequest)
			return
		}

		if err := models.DeleteMission(req.MissionID); err != nil {
			log.Println("DeleteMission エラー:", err)
			http.Error(w, "ミッションの削除に失敗しました。", http.StatusInternalServerError)
			return
		}

		// 削除成功した場合、削除したIDを返す（任意）
		resp := map[string]int{"deleted_id": req.MissionID}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)

	case http.MethodPost:
	default:
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
	}
}
