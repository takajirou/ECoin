import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "libs/apiClient";

// トークンキーの定数
const TOKEN_KEY = "jwt_token";

// トークンを設定する関数
export const setToken = async (token) => {
    try {
        if (token) {
            // AsyncStorageに保存
            await AsyncStorage.setItem(TOKEN_KEY, token);

            // デフォルトヘッダーに設定
            apiClient.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;

            console.log("トークンを設定しました");
        }
    } catch (error) {
        console.error("トークンの保存に失敗しました:", error);
    }
};

// トークンを削除する関数
export const removeToken = async () => {
    try {
        // AsyncStorageから削除
        await AsyncStorage.removeItem(TOKEN_KEY);

        // デフォルトヘッダーから削除
        delete apiClient.defaults.headers.common["Authorization"];

        console.log("トークンを削除しました");
    } catch (error) {
        console.error("トークンの削除に失敗しました:", error);
    }
};

// 現在のトークンを取得する関数
export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        return token;
    } catch (error) {
        console.error("トークンの取得に失敗しました:", error);
        return null;
    }
};

// トークンの有効性を確認する関数
export const checkTokenValidity = async () => {
    try {
        const token = await getToken();
        if (!token) {
            return false;
        }

        // トークンをヘッダーに設定
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // 認証が必要なエンドポイントで確認（例：/me）
        const response = await apiClient.get("/me");
        return response.status === 200;
    } catch (error) {
        console.error("トークンの検証に失敗しました:", error);
        // トークンが無効な場合は削除
        await removeToken();
        return false;
    }
};

// アプリ起動時にトークンを復元する関数
export const initializeAuth = async () => {
    try {
        const token = await getToken();
        if (token) {
            // トークンをヘッダーに設定
            apiClient.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;

            // トークンの有効性を確認
            const isValid = await checkTokenValidity();
            if (!isValid) {
                console.log("保存されているトークンが無効です");
                await removeToken();
                return false;
            }

            console.log("認証情報を復元しました");
            return true;
        }
        return false;
    } catch (error) {
        console.error("認証の初期化に失敗しました:", error);
        return false;
    }
};

// リクエストインターセプター
apiClient.interceptors.request.use(
    async (config) => {
        // トークンが設定されていない場合、AsyncStorageから取得
        if (!config.headers.Authorization) {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        console.log(
            `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
    },
    (error) => {
        console.error("リクエストエラー:", error);
        return Promise.reject(error);
    }
);

// レスポンスインターセプター
apiClient.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    async (error) => {
        console.error(
            "API エラー:",
            error.response?.status,
            error.response?.data || error.message
        );

        // 401エラー（認証エラー）の場合
        if (error.response?.status === 401) {
            console.log("認証エラーが発生しました。トークンを削除します。");
            await removeToken();

            // 必要に応じてログイン画面にリダイレクト
            // navigation.navigate('Login'); // NavigationServiceを使用する場合
        }

        return Promise.reject(error);
    }
);

// ログイン関数
export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post("/auth/login", {
            email,
            password,
        });

        const { token } = response.data;
        if (token) {
            await setToken(token);
            return {
                success: true,
                data: response.data,
            };
        } else {
            throw new Error("トークンが見つかりません");
        }
    } catch (error) {
        console.error("ログインエラー:", error);
        return {
            success: false,
            error: error.response?.data?.message || error.message,
        };
    }
};

// ログアウト関数
export const logoutUser = async () => {
    try {
        try {
            await apiClient.post("/auth/logout");
        } catch (error) {
            console.log("サーバーログアウトエラー:", error);
        }

        // ローカルのトークンを削除
        await removeToken();

        return { success: true };
    } catch (error) {
        console.error("ログアウトエラー:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};
