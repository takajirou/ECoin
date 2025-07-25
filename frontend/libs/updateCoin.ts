import { apiClient } from "./apiClient";

export const updateCoin = async (action: "plus" | "minus", coin: number) => {
    await apiClient.put(`/user/coin/${action}`, { coin });
};
