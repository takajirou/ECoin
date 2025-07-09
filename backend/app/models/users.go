package models

import (
	"errors"
	"log"
	"time"
)

type User struct {
	ID        int       `json:"id"`
	UUID      string    `json:"uuid"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"password,omitempty"`
	Coins     int       `json:"coins"`
	Pref      string    `json:"pref"`
	City      string    `json:"city"`
	Admin     bool      `json:"admin"`
	CreatedAt time.Time `json:"created_at"`
}

// ログイン用の構造体
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string   `json:"token"`
	User  User `json:"user"`
}

// ユーザー作成
func (u *User) CreateUser() error {
	// パスワードをハッシュ化
	hashedPassword, err := HashPassword(u.Password)
	if err != nil {
		return err
	}

	cmd := `INSERT INTO users(
		uuid, name, email, password, coins, pref, city, admin, created_at
	) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

	_, err = Db.Exec(cmd,
		createUUID(),
		u.Name,
		u.Email,
		hashedPassword,
		u.Coins,
		u.Pref,
		u.City,
		u.Admin,
		time.Now(),
	)

	if err != nil {
		log.Printf("CreateUser error: %v", err)
		return err
	}

	return nil
}

// UUIDでユーザー取得
func GetUserByUUID(uuid string) (User, error) {
	user := User{}
	cmd := `SELECT id, uuid, name, email, password, coins, pref, city, admin, created_at 
			FROM users WHERE uuid = ?`

	err := Db.QueryRow(cmd, uuid).Scan(
		&user.ID,
		&user.UUID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Coins,
		&user.Pref,
		&user.City,
		&user.Admin,
		&user.CreatedAt,
	)

	return user, err
}

// メールアドレスでユーザー取得
func GetUserByEmail(email string) (User, error) {
	user := User{}
	cmd := `SELECT id, uuid, name, email, password, coins, pref, city, admin, created_at 
			FROM users WHERE email = ?`

	err := Db.QueryRow(cmd, email).Scan(
		&user.ID,
		&user.UUID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Coins,
		&user.Pref,
		&user.City,
		&user.Admin,
		&user.CreatedAt,
	)

	return user, err
}

func UpdateUserCoin(userID string, coin int) error {
	cmd := `UPDATE users SET coins = coins + ? WHERE uuid = ?`

	_, err := Db.Exec(cmd, coin, userID)
	return err
}

// ユーザー更新
func (u *User) UpdateUserByUUID() error {
	if u.UUID == "" {
		return errors.New("invalid UUID")
	}

	cmd := `UPDATE users SET name = ?, email = ?, coins = ?, pref = ?, city = ?, admin = ? 
			WHERE uuid = ?`

	_, err := Db.Exec(cmd, u.Name, u.Email, u.Coins, u.Pref, u.City, u.Admin, u.UUID)
	return err
}

// ユーザー削除
func (u *User) DeleteUserByUUID() error {
	if u.UUID == "" {
		return errors.New("invalid UUID")
	}

	cmd := `DELETE FROM users WHERE uuid = ?`
	_, err := Db.Exec(cmd, u.UUID)
	return err
}

// 全ユーザー取得
func GetAllUsers() ([]User, error) {
	rows, err := Db.Query(`SELECT id, uuid, name, email, password, coins, pref, city, admin, created_at FROM users`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		err := rows.Scan(
			&u.ID,
			&u.UUID,
			&u.Name,
			&u.Email,
			&u.Password,
			&u.Coins,
			&u.Pref,
			&u.City,
			&u.Admin,
			&u.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

// ログイン認証
func (u *User) Authenticate(email, password string) error {
	user, err := GetUserByEmail(email)
	if err != nil {
		return errors.New("ユーザーが見つかりません")
	}

	if !CheckPasswordHash(password, user.Password) {
		return errors.New("パスワードが間違っています")
	}

	*u = user
	return nil
}