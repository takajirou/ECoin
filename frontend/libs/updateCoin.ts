import { apiClient } from "./apiClient";

export const updateCoin = async (action: "plus" | "minus", coin: number) => {
    const payload = { coin: coin };
    console.log(`送信データ:`, payload); // デバッグ用
    await apiClient.put(`/user/coin/${action}`, payload);
};
