import { useState } from "react";
import { UserProfile } from "../../interfaces/userProfile";
import axios from "axios";

interface IUseLoginResponse {
    login: (email: string, password: string) => Promise<UserProfile>;
    isLoginLoading: boolean;
    loginError: string | undefined;
}

const useLogin = (): IUseLoginResponse => {
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | undefined>(undefined);

    const login = async (email: string, password: string) => {
        try {
            setIsLoginLoading(true);
            const response = await axios.post(
                `${process.env.REACT_APP_API}/login`,
                {
                    email,
                    password,
                }
            );
            return response.data;
        } catch (error: any) {
            setLoginError(error.response.data);
        } finally {
            setIsLoginLoading(false);
        }
    };

    return { login, isLoginLoading, loginError };
};

export { useLogin };
