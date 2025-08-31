import { apiClient } from "../apiClient";

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

const postLogin = async (params: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>("/auth/login", params);
    return res.data;
};

export default postLogin;
