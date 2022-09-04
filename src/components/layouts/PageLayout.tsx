import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useLoggedInUser } from "../../contexts/auth/useLoggedInUser";

const PageLayout = () => {
    const { loggedInUser } = useLoggedInUser();

    if (loggedInUser) {
        const { firstName, lastName } = loggedInUser
        return (
            <div>
                <AppBar position="static" sx={{
                    alignItems: "flex-end"
                }}>
                    <Toolbar component="nav">
                        <Typography
                            variant="h6"
                            component="div"
                        >
                            {firstName} {lastName}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Outlet />
            </div>
        );
    }

    return <Navigate replace to="/login" />;
};

export { PageLayout };
