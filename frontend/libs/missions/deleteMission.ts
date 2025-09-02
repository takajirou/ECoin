import { apiClient } from "libs/apiClient";

export const deleteMissions = async (missionId: number) => {
    await apiClient.delete(`/admin/missions/${missionId}`);
};
