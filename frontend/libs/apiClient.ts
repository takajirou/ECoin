import axios from "axios";

// APIクライアントの作成
export const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});
