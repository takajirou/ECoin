import { apiClient } from "../apiClient";

export const upsertScore = async (score: number) => {
    await apiClient.post(`/score/${score}`);
};
