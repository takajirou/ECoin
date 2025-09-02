import { apiClient } from "../apiClient";
import { RewardResponse } from "types/rewards";

const fetchReward = async () => {
    const res = await apiClient.get<RewardResponse>("/rewards");
    return res.data;
};

export default fetchReward;
