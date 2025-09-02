package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// JWT設定（本番環境では環境変数から読み込む）
var jwtSecret = []byte("your-secret-key-change-this-in-production")

type Claims struct {
	UserID int    `json:"user_id"`
	UUID   string `json:"uuid"`
	Email  string `json:"email"`
	Admin  bool   `json:"admin"`
	jwt.RegisteredClaims
}

// JWTトークンを生成
func GenerateToken(userID int, uuid, email string, admin bool) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour) // 24時間有効

	claims := &Claims{
		UserID: userID,
		UUID:   uuid,
		Email:  email,
		Admin:  admin,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// JWTトークンを検証
func ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("無効なトークンです")
	}

	return claims, nil
}
