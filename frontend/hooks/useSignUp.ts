import { useMutation } from "@tanstack/react-query";
import postSignUp from "libs/postSignUp";
import { router } from "expo-router";

const useSignUp = () => {
    return useMutation({
        mutationFn: postSignUp,
        onSuccess: async () => {
            router.push("/");
        },
    });
};

export default useSignUp;
