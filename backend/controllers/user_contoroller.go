package controllers

import (
	"ECoin/app/models"
	"ECoin/middleware"
	"ECoin/utils"
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

// 一般ユーザー用：自分の情報のみ操作
func HandleMyProfile(w http.ResponseWriter, r *http.Request) {
	// JWTトークンからユーザー情報を取得
	claims, ok := r.Context().Value(middleware.UserContextKey).(*utils.Claims)
	if !ok {
		http.Error(w, "認証情報の取得に失敗しました", http.StatusInternalServerError)
		return
	}

	switch r.Method {
	case http.MethodGet:
		// 自分の情報を取得
		user, err := models.GetUserByUUID(claims.UUID)
		if err != nil {
			http.Error(w, "ユーザーが見つかりません", http.StatusNotFound)
			return
		}

		// パスワードは返さない
		user.Password = ""
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)

	case http.MethodPut:
		// 自分の情報を更新
		var u models.User
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "リクエストの読み取りに失敗しました", http.StatusBadRequest)
			return
		}

		if err := json.Unmarshal(body, &u); err != nil {
			http.Error(w, "JSONの解析に失敗しました", http.StatusBadRequest)
			return
		}

		// JWTトークンのUUIDを使用（URLのUUIDは無視）
		u.UUID = claims.UUID

		// 管理者権限は一般ユーザーが変更できない
		if !claims.Admin {
			u.Admin = false
		}

		if err := u.UpdateUserByUUID(); err != nil {
			http.Error(w, "ユーザー情報の更新に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "プロフィールを更新しました"})

	case http.MethodDelete:
		// 自分のアカウントを削除
		u := models.User{UUID: claims.UUID}
		if err := u.DeleteUserByUUID(); err != nil {
			http.Error(w, "アカウントの削除に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "アカウントを削除しました"})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// 管理者用：全ユーザー管理
func HandleUsers(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		// 新規ユーザー作成（認証不要 - 登録用）
		var u models.User
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "リクエストの読み取りに失敗しました", http.StatusBadRequest)
			return
		}

		if err := json.Unmarshal(body, &u); err != nil {
			http.Error(w, "JSONの解析に失敗しました", http.StatusBadRequest)
			return
		}

		if err := u.CreateUser(); err != nil {
			http.Error(w, "ユーザーの作成に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "ユーザーを作成しました"})

	case http.MethodGet:
		// 全ユーザー一覧取得（管理者のみ）
		users, err := models.GetAllUsers()
		if err != nil {
			http.Error(w, "ユーザー一覧の取得に失敗しました", http.StatusInternalServerError)
			return
		}

		// パスワードは返さない
		for i := range users {
			users[i].Password = ""
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// 管理者用：特定ユーザー管理（UUIDで指定）
func HandleUserByUUID(w http.ResponseWriter, r *http.Request) {
	// 管理者権限をチェック
	claims, ok := r.Context().Value(middleware.UserContextKey).(*utils.Claims)
	if !ok || !claims.Admin {
		http.Error(w, "管理者権限が必要です", http.StatusForbidden)
		return
	}

	// URLパスからUUID部分を取り出す
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 4 {
		http.Error(w, "無効なURLです", http.StatusBadRequest)
		return
	}
	uuid := pathParts[3]

	switch r.Method {
	case http.MethodGet:
		user, err := models.GetUserByUUID(uuid)
		if err != nil {
			http.Error(w, "ユーザーが見つかりません", http.StatusNotFound)
			return
		}

		// パスワードは返さない
		user.Password = ""
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)

	case http.MethodPut:
		var u models.User
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "リクエストの読み取りに失敗しました", http.StatusBadRequest)
			return
		}

		if err := json.Unmarshal(body, &u); err != nil {
			http.Error(w, "JSONの解析に失敗しました", http.StatusBadRequest)
			return
		}

		u.UUID = uuid // URLのUUIDを使用
		if err := u.UpdateUserByUUID(); err != nil {
			http.Error(w, "ユーザー情報の更新に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "ユーザー情報を更新しました"})

	case http.MethodDelete:
		u := models.User{UUID: uuid}
		if err := u.DeleteUserByUUID(); err != nil {
			http.Error(w, "ユーザーの削除に失敗しました", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "ユーザーを削除しました"})

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}