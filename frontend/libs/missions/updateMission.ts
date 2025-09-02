import { apiClient } from "libs/apiClient";

interface UpdateMissionRequest {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    point: number;
    require_proof: boolean;
    active: boolean;
}

export const updateMission = async (params: UpdateMissionRequest) => {
    const res = await apiClient.put(`/admin/missions/${params.id}`, params);
    return res.data;
};
