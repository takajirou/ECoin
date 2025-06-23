package controllers

import (
	"encoding/json" // JSONのエンコード・デコードに使う（構造体 <-> JSON文字列）
	"io"            // HTTPリクエストボディの読み取りに使用

	"net/http" // HTTPサーバーやリクエストの処理に使用
	// 文字列と数値の変換（例："1" → 1）
	"strings" // 文字列処理（例：パス分解など）

	"ECoin/app/models" // モデル層（DBとのやり取り）をインポート
)

func HandleUsers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
		case http.MethodPost:
			var u models.User // 空のUser構造体を作成
			body, _ := io.ReadAll(r.Body) // リクエストボディ（JSON）を読み取り
			json.Unmarshal(body, &u) // JSONをUser構造体に変換（デコード）
			u.CreateUser()

			// レスポンスとして成功メッセージをJSONで返す
			json.NewEncoder(w).Encode(map[string]string{"message": "created"})

		case http.MethodGet:
			users, err := models.GetAllUsers()
			if err != nil {
				http.Error(w, "Failed to get users", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json") // JSONヘッダー設定
			json.NewEncoder(w).Encode(users) // JSONで返却

		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// HandleUserByID は /api/users/1 などのリクエストに対応（ID指定）
func HandleUserByUUID(w http.ResponseWriter, r *http.Request) {
	// URLパスから UUID 部分を取り出す（例：/api/users/1 → "1"）
	uuid := strings.Split(r.URL.Path, "/")[3] // スライスして4番目の要素がUUID

	switch r.Method {
	case http.MethodGet:
		user, err := models.GetUserByUUID(uuid)
		if err != nil {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(user)

	case http.MethodPut:
		var u models.User
		body, _ := io.ReadAll(r.Body)
		json.Unmarshal(body, &u)
		u.UUID = uuid
		err := u.UpdateUserByUUID()
		if err != nil {
			http.Error(w, "Failed to update user", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"message": "updated"})

	case http.MethodDelete:
		u := models.User{UUID: uuid}
		err := u.DeleteUserByUUID()
		if err != nil {
			http.Error(w, "Failed to delete user", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"message": "deleted"})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
