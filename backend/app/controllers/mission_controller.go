package controllers

import (
	"ECoin/app/models"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"
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
		var mission models.Mission

		if err := json.NewDecoder(r.Body).Decode(&mission); err != nil {
			http.Error(w, "リクエストの解析に失敗しました", http.StatusBadRequest)
			return
		}

		if mission.ID == 0 {
			http.Error(w, "IDが指定されていません", http.StatusBadRequest)
			return
		}

		if err := mission.UpdateMission(); err != nil {
			log.Println("UpdateMission エラー:", err)
			http.Error(w, "ミッションの更新に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(mission)

	case http.MethodDelete:
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) < 4 {
			http.Error(w, "IDが指定されていません", http.StatusBadRequest)
			return
		}

		id, err := strconv.Atoi(parts[len(parts)-1])
		if err != nil {
			http.Error(w, "不正なIDです", http.StatusBadRequest)
			return
		}

		if err := models.DeleteMission(id); err != nil {
			log.Println("DeleteMission エラー:", err)
			http.Error(w, "ミッションの削除に失敗しました。", http.StatusInternalServerError)
			return
		}

		resp := map[string]int{"deleted_id": id}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)

	case http.MethodPost:
		// TODO: 新規作成処理をここに実装

	default:
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
	}
}
