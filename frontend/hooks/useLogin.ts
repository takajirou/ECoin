import { useMutation } from "@tanstack/react-query";
import postLogin from "libs/auth/postLogin";
import { setToken } from "@/config";
import { router } from "expo-router";

const useLogin = () => {
    return useMutation({
        mutationFn: postLogin,
        onSuccess: async (data) => {
            await setToken(data.token);
            router.push("/");
        },
    });
};

export default useLogin;
