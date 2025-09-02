import { useQuery } from "@tanstack/react-query";
import fetchMissions from "libs/missions/fetchMissions";

export const useMissions = () => {
    return useQuery({
        queryKey: ["missions"],
        queryFn: fetchMissions,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 1,
    });
};
