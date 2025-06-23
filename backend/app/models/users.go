package models

import (
	"errors"
	"log"  // ログ出力用（エラー時に使用）
	"time" // 日時の取得・管理に使用
)

// User構造体：ユーザー情報を表すデータモデル
type User struct {
	ID        int       // ユーザーID（自動採番）
	UUID      string    // ユーザーごとのユニークな識別子
	Name      string    // ユーザー名
	Email     string    // メールアドレス
	Password  string    // パスワード（ハッシュ化前）
	Coins 	  int		// 所持コイン
	Pref      string    // 住んでる県
	City   	  string	// 住んでる市
	CreatedAt time.Time // ユーザー登録日時
}

func (u *User) CreateUser() (err error) {
	// ユーザー情報を挿入するSQL文（? はプレースホルダ）
	
	cmd := `insert into users(
		uuid,
		name,
		email,
		password,
		coins,
		pref,
		city,
		created_at) values (?, ?, ?, ?, ?, ?, ?, ?)`
	
	// SQL実行
	_, err = Db.Exec(cmd,
		createUUID(),
		u.Name,
		u.Email,
		Encrypt(u.Password),
		u.Coins,
		u.Pref,
		u.City,
		time.Now(),
	)

	// エラー処理
	if err != nil {
		log.Fatalln(err)
	}

	return nil
}

// GetUser 関数：指定したIDのユーザー情報をデータベースから取得し、User構造体として返す
func GetUserByUUID(uuid string) (user User, err error) {
	user = User{} // 空のUser構造体を初期化

	// SQL文：指定されたIDのユーザー情報を全項目取得する
	cmd := `select id, uuid, name, email, password, coins, pref, city, created_at from users where uuid = ?`

	// SQLを実行し、結果をUser構造体に代入
	err = Db.QueryRow(cmd, uuid).Scan(
		&user.ID,
		&user.UUID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Coins,
		&user.Pref,
		&user.City,
		&user.CreatedAt,
	)

	// 構造体（user）とエラー（err）を返す
	return user, err
}


func (u *User) UpdateUserByUUID() (err error){
	if u.UUID == "" {
		return errors.New("invalid UUID")
	}
	cmd := `UPDATE users SET name = ?, email = ?, coins = ?, pref = ?, city = ? WHERE uuid = ?`
	_, err = Db.Exec(cmd, u.Name, u.Email, u.Coins, u.Pref, u.City, u.UUID)
	return err
}

func (u *User) DeleteUserByUUID() (err error){
	if u.UUID == "" {
		return errors.New("invalid UUID")
	}
	cmd := `DELETE FROM users WHERE uuid = ?`
	_, err = Db.Exec(cmd, u.UUID)
	return err
}

// GetAllUsers 関数：全ユーザー情報をデータベースから取得してスライスで返す
func GetAllUsers() ([]User, error) {
	// SQL文：全ユーザーの情報を取得
	rows, err := Db.Query(`SELECT id, uuid, name, email, password, created_at, coins, pref, city FROM users`)
	if err != nil {
		return nil, err // エラーがあればnilとエラーを返す
	}
	defer rows.Close() // 処理が終わったらクローズ

	var users []User // 結果を格納するスライス

	for rows.Next() {
		var u User
		err := rows.Scan(
			&u.ID,
			&u.UUID,
			&u.Name,
			&u.Email,
			&u.Password,
			&u.CreatedAt,
			&u.Coins,
			&u.Pref,
			&u.City,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, u) // 取得したユーザーをスライスに追加
	}
	return users, nil
}