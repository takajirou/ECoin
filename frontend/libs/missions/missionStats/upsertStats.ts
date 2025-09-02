import { apiClient } from "../../apiClient";

export const upsertStats = async (missionId: number) => {
    await apiClient.post(`/status/${missionId}`);
};
