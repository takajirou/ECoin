package models

import (
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
	CreatedAt time.Time // ユーザー登録日時
}

// CreateUser メソッド：User構造体の値を使ってデータベースに新しいユーザーを登録する
func (u *User) CreateUser() (err error) {
	// ユーザー情報を挿入するSQL文（? はプレースホルダ）
	cmd := `insert into users(
		uuid,
		name,
		email,
		password,
		created_at) values (?, ?, ?, ?, ?)`
	
	// SQL実行（UUID生成・パスワードはハッシュ化、日時は現在時刻を使用）
	_, err = Db.Exec(cmd,
		createUUID(),           // UUIDはランダムに生成
		u.Name,                 // 入力された名前
		u.Email,                // 入力されたメールアドレス
		Encrypt(u.Password),    // パスワードは暗号化して保存
		time.Now())             // 登録日時は現在時刻

	// 実行時にエラーが発生した場合、ログに出力して終了
	if err != nil {
		log.Fatalln(err)
	}

	// エラーがなければnilが返る
	return err
}

// GetUser 関数：指定したIDのユーザー情報をデータベースから取得し、User構造体として返す
func GetUser(id int) (user User, err error) {
	user = User{} // 空のUser構造体を初期化

	// SQL文：指定されたIDのユーザー情報を全項目取得する
	cmd := `select id, uuid, name, email, password, created_at from users where id = ?`

	// SQLを実行し、結果をUser構造体に代入
	err = Db.QueryRow(cmd, id).Scan(
		&user.ID,
		&user.UUID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
	)

	// 構造体（user）とエラー（err）を返す
	return user, err
}


func (u *User) UpdateUser() (err error){
	cmd := `update users set name = ?, email = ? where id = ?`
	_, err = Db.Exec(cmd, u.Name, u.Email, u.ID)
	if  err != nil{
		log.Fatalln(err)
	}
	return err
}

func (u *User) DeleteUser() (err error){
	cmd := `delete from users where id = ?`
	_, err = Db.Exec(cmd, u.ID)
	if  err != nil{
		log.Fatalln(err)
	}
	return err
}