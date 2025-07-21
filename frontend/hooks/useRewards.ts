import { useQuery } from "@tanstack/react-query";
import fetchReward from "libs/fetchRewards";

const useReward = () => {
    return useQuery({
        queryKey: ["fetchReward"],
        queryFn: fetchReward,
        staleTime: 1000 * 60 * 5, // 5分間は再フェッチしない
        gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
        retry: 1,
    });
};

export default useReward;
