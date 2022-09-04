import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { UserProfile } from "../../interfaces/userProfile";

export interface ILoggedInUserContext {
    loggedInUser: UserProfile | undefined;
    updateUser: (user: UserProfile) => void;
    isLoading: boolean;
    serverError?: string | undefined;
}

const LoggedInUserContext = createContext<ILoggedInUserContext | undefined>(undefined);

const LoggedInUserProvider = ({ children }: { children: ReactNode }) => {
    const [loggedInUser, setLoggedInUser] = useState<UserProfile | undefined>(undefined);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [serverError, setServerError] = useState<string | undefined>(undefined);

    const updateUser = (user: UserProfile) => {
        setLoggedInUser(user);
    };

    useEffect(() => {
        const initialiseUser = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/auth`
                );
                updateUser(response.data)
            } catch (error: any) {
                if (error.response.status >= 500) {
                    setServerError(error.response.data);
                }
            } finally {
                setIsLoading(false);
            }
        };
        initialiseUser();
    }, []);

    const value = {
        loggedInUser,
        updateUser,
        isLoading,
        serverError
    };

    return (
        <LoggedInUserContext.Provider value={value}>
            {children}
        </LoggedInUserContext.Provider>
    );
};

const useLoggedInUser = () => {
    const context = useContext(LoggedInUserContext);
    if (context === undefined) {
        throw new Error("useLoggedInUser must be used within a LoggedInUserProvider.");
    }
    return context;
};

export { LoggedInUserProvider, useLoggedInUser };
