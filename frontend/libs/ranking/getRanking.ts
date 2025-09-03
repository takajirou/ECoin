import { apiClient } from "../apiClient";

const getRanking = async (period_type: string, period_value: string) => {
    const res = await apiClient.get(`/ranking`, {
        params: {
            period_type,
            period_value,
        },
    });
    return res.data;
};

export default getRanking;
