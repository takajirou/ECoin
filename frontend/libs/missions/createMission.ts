import { apiClient } from "libs/apiClient";

interface CreateMissionRequest {
    title: string;
    description: string;
    difficulty: string;
    point: number;
    require_proof?: boolean;
    active?: boolean;
}

export const createMission = async (params: CreateMissionRequest) => {
    const res = await apiClient.post("/admin/missions", params);
    return res.data;
};
