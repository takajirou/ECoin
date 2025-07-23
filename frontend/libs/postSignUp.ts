import { apiClient } from "./apiClient";

interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}

const postSignUp = async (params: SignUpRequest) => {
    const res = await apiClient.post("/auth/register", params);
    return res.data;
};

export default postSignUp;
