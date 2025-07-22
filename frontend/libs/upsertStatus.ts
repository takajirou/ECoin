import { apiClient } from "./apiClient";

export const upsertStatus = async (missionId: number) => {
    await apiClient.post(`/status/${missionId}`);
};
