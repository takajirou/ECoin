import { useQuery } from "@tanstack/react-query";
import getRanking from "libs/ranking/getRanking";

export const useRanking = (period_type: string, period_value: string) => {
    return useQuery({
        queryKey: ["ranking", period_type, period_value],
        queryFn: () => getRanking(period_type, period_value),
        staleTime: 1000 * 60 * 5, // 5分間は再フェッチしない
        gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
        retry: 1,
    });
};
