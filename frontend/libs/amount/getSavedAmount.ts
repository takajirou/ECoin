import { apiClient } from "../apiClient";
import { SavedAmountResponse } from "types/saved_amount";

const getSavedAmount = async (period_type: string) => {
    const res = await apiClient.get<SavedAmountResponse>(`/saved`, {
        params: {
            period_type,
        },
    });
    return res.data;
};

export default getSavedAmount;
