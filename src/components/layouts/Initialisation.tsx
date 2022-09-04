import { ReactNode } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Alert } from "@mui/material";

import { useLoggedInUser } from "../../contexts/auth/useLoggedInUser";

interface IInitialisation {
    children: ReactNode;
}

const Initialisation = ({ children }: IInitialisation) => {
    const { isLoading, serverError } = useLoggedInUser();

    if (isLoading) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (serverError) {
        return (
            <Box
                sx={{
                    maxWidth: "400px",
                    marginX: "auto",
                    marginY: 4,
                }}
            >
                <Alert severity="error">{serverError}</Alert>
            </Box>
        );
    }

    return <>{children}</>;
};

export { Initialisation };
