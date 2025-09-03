import { useQuery } from "@tanstack/react-query";
import getSavedAmount from "libs/amount/getSavedAmount";

export const useSavedAmount = (period_type: string) => {
    return useQuery({
        queryKey: ["saved_amount", period_type],
        queryFn: () => getSavedAmount(period_type),
        staleTime: 1000 * 60 * 5, // 5分間は再フェッチしない
        gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
        retry: 1,
    });
};
