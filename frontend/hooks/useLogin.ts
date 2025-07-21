import { useMutation } from "@tanstack/react-query";
import postLogin from "libs/postLogin";

const useLogin = useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
        console.log("ログイン成功", data.token);
    },
});

export default useLogin;
