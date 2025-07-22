import { apiClient } from "./apiClient";
import { Mission } from "types/mission";

const fetchMissions = async (): Promise<Mission[]> => {
    const res = await apiClient.get("/missions");
    return res.data;
};

export default fetchMissions;
