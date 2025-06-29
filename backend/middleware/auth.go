package middleware

import (
	"ECoin/utils"
	"context"
	"net/http"
	"strings"
)

type contextKey string

const UserContextKey contextKey = "user"

// JWT認証ミドルウェア
func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "認証が必要です", http.StatusUnauthorized)
			return
		}

		bearerToken := strings.Split(authHeader, " ")
		if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
			http.Error(w, "無効な認証形式です", http.StatusUnauthorized)
			return
		}

		claims, err := utils.ValidateToken(bearerToken[1])
		if err != nil {
			http.Error(w, "無効なトークンです", http.StatusUnauthorized)
			return
		}

		// ユーザー情報をコンテキストに追加
		ctx := context.WithValue(r.Context(), UserContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// 管理者権限チェックミドルウェア
func AdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := r.Context().Value(UserContextKey).(*utils.Claims)
		if !ok || !claims.Admin {
			http.Error(w, "管理者権限が必要です", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}
