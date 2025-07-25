import { apiClient } from "./apiClient";

interface UserRewardRequest {
    reward_id: number;
}

const postUserReward = async (params: UserRewardRequest) => {
    const res = await apiClient.post("/user/rewards", params);
    return res.data;
};

export default postUserReward;
