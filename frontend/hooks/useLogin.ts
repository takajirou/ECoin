import { useMutation } from "@tanstack/react-query";
import postLogin from "libs/postLogin";
import { setToken } from "@/config";
import { router } from "expo-router";

const useLogin = useMutation({
    mutationFn: postLogin,
    onSuccess: async (data) => {
        await setToken(data.token);
        router.push("/");
    },
});

export default useLogin;
