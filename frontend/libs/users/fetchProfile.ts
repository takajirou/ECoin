import { apiClient } from "../apiClient";
import { profileResponse } from "types/profile";

const fetchProfile = async () => {
    const res = await apiClient.get<profileResponse>("/me");
    return res.data;
};

export default fetchProfile;
