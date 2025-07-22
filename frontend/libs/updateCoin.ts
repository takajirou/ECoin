import { apiClient } from "./apiClient";

export const updateCoin = async (coin: number) => {
    await apiClient.put(`/user/coin/${coin}`);
};
