package controllers

import (
	"ECoin/app/models"
	"ECoin/middleware"
	"ECoin/utils"
	"encoding/json"
	"io"
	"net/http"
)

// ログイン処理
func HandleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var loginReq models.LoginRequest
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "リクエストの読み取りに失敗しました", http.StatusBadRequest)
		return
	}

	if err := json.Unmarshal(body, &loginReq); err != nil {
		http.Error(w, "JSONの解析に失敗しました", http.StatusBadRequest)
		return
	}

	var user models.User
	if err := user.Authenticate(loginReq.Email, loginReq.Password); err != nil {
		http.Error(w, "認証に失敗しました", http.StatusUnauthorized)
		return
	}

	// JWTトークンを生成
	token, err := utils.GenerateToken(user.ID, user.UUID, user.Email, user.Admin)
	if err != nil {
		http.Error(w, "トークンの生成に失敗しました", http.StatusInternalServerError)
		return
	}

	// レスポンス作成
	response := models.LoginResponse{
		Token: token,
		User: models.User{
			ID:        user.ID,
			UUID:      user.UUID,
			Name:      user.Name,
			Email:     user.Email,
			Password:  user.Password,
			Coins:     user.Coins,
			Pref:      user.Pref,
			City:      user.City,
			Admin:     user.Admin,
			CreatedAt: user.CreatedAt,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// ログアウト処理
func HandleLogout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "ログアウトしました",
	})
}

// 現在のユーザー情報を取得
func HandleMe(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	claims, ok := r.Context().Value(middleware.UserContextKey).(*utils.Claims)
	if !ok {
		http.Error(w, "ユーザー情報の取得に失敗しました", http.StatusInternalServerError)
		return
	}

	user, err := models.GetUserByUUID(claims.UUID)
	if err != nil {
		http.Error(w, "ユーザーが見つかりません", http.StatusNotFound)
		return
	}

	User := models.User{
		ID:        user.ID,
		UUID:      user.UUID,
		Name:      user.Name,
		Email:     user.Email,
		Password:  user.Password,
		Coins:     user.Coins,
		Pref:      user.Pref,
		City:      user.City,
		Admin:     user.Admin,
		CreatedAt: user.CreatedAt,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(User)
}
