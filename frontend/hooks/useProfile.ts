import { useQuery } from "@tanstack/react-query";
import fetchProfile from "libs/fetchProfile";

const useProfile = () => {
    return useQuery({
        queryKey: ["fetchProfile"],
        queryFn: fetchProfile,
        staleTime: 1000 * 60 * 5, // 5分間は再フェッチしない
        gcTime: 10 * 60 * 1000, // 10分間キャッシュを保持
        retry: 1,
    });
};

export default useProfile;
