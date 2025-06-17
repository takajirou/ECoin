package controllers // このファイルは「controllers」パッケージに属する

import (
	"encoding/json" // JSONのエンコード・デコードに使う（構造体 <-> JSON文字列）
	"io"            // HTTPリクエストボディの読み取りに使用

	// デバッグ用にfmt.Printfなどが使える（今回は未使用）
	"net/http" // HTTPサーバーやリクエストの処理に使用
	"strconv"  // 文字列と数値の変換（例："1" → 1）
	"strings"  // 文字列処理（例：パス分解など）

	"ECoin/app/models" // モデル層（DBとのやり取り）をインポート
)

// HandleUsers は /api/users に対するリクエストを処理する
func HandleUsers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
		case http.MethodPost: // HTTPメソッドが POST の場合（ユーザーの作成）
			var u models.User // 空のUser構造体を作成
			body, _ := io.ReadAll(r.Body) // リクエストボディ（JSON）を読み取り
			json.Unmarshal(body, &u) // JSONをUser構造体に変換（デコード）
			u.CreateUser() // モデル層の関数でデータベースにユーザーを登録

			// レスポンスとして成功メッセージをJSONで返す
			json.NewEncoder(w).Encode(map[string]string{"message": "created"})

		case http.MethodGet:
			// 一覧取得処理
			users, err := models.GetAllUsers()
			if err != nil {
				http.Error(w, "Failed to get users", http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json") // JSONヘッダー設定
			json.NewEncoder(w).Encode(users) // JSONで返却

		default:
			// POST以外のメソッドは許可しない
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// HandleUserByID は /api/users/1 などのリクエストに対応（ID指定）
func HandleUserByID(w http.ResponseWriter, r *http.Request) {
	// URLパスから ID 部分を取り出す（例：/api/users/1 → "1"）
	idStr := strings.Split(r.URL.Path, "/")[3] // スライスして4番目の要素がID
	id, err := strconv.Atoi(idStr) // 文字列をintに変換（例："1" → 1）
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest) // 数値変換できなければエラー
		return
	}

	switch r.Method {
		case http.MethodGet: // ユーザー1件を取得
			user, _ := models.GetUser(id) // 指定IDのユーザーを取得
			json.NewEncoder(w).Encode(user) // JSONとして返す

		case http.MethodPut: // ユーザーの更新処理
			var u models.User
			body, _ := io.ReadAll(r.Body) // 更新用のJSONを読み取り
			json.Unmarshal(body, &u) // JSON → User構造体
			u.ID = id // URLのIDを使って更新対象を明示
			u.UpdateUser() // モデル層で更新を実行
			json.NewEncoder(w).Encode(map[string]string{"message": "updated"})

		case http.MethodDelete: // ユーザーの削除処理
			u := models.User{ID: id} // IDだけを指定してUser構造体を作る
			u.DeleteUser() // モデル層の関数でDBから削除
			json.NewEncoder(w).Encode(map[string]string{"message": "deleted"})

		default:
			// 上記以外のメソッド（POSTなど）は許可しない
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
