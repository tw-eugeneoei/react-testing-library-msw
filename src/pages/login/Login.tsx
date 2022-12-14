import { useForm, Controller } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import { loginSchema } from "../../schemas/loginSchema";
import { ILoginForm } from "../../interfaces/forms/loginForm";
import { useLogin } from "../../hooks/auth/useLogin";
import { useLoggedInUser } from "../../contexts/auth/useLoggedInUser";
import {
    Alert,
    TextField,
    CircularProgress,
    Button,
    Paper,
    Grid,
    Typography,
} from "@mui/material";
import { useState } from "react";

const Login = () => {
    const {
        // register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ILoginForm>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const { login, isLoginLoading, loginError } = useLogin();
    const { loggedInUser, updateUser } = useLoggedInUser();

    const [, setCounter] = useState(0)

    const handleLogin = async (data: ILoginForm) => {
        const user = await login(data.email, data.password);
        updateUser(user);
    };

    if (loggedInUser) {
        return <Navigate replace to="/" />;
    }

    return (
        <Grid
            container
            justifyContent="center"
            sx={{
                marginTop: 4,
            }}
        >
            <Paper
                elevation={24}
                square={false}
                sx={{
                    padding: 4,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        textAlign: "center",
                        marginBottom: 2
                    }}
                >
                    Login
                </Typography>
                {loginError && !isLoginLoading && (
                    <Alert severity="error" sx={{
                        marginBottom: 2
                    }}>{loginError}</Alert>
                )}
                <form onSubmit={handleSubmit(handleLogin)} name="login">
                    <Controller
                        render={({ field }) => (
                            <TextField
                                label="Email"
                                error={errors.email ? true : false}
                                helperText={errors.email?.message}
                                size="small"
                                fullWidth
                                sx={{
                                    marginTop: 2,
                                }}
                                FormHelperTextProps={{
                                    sx: {
                                        marginTop: 1
                                    }
                                }}
                                {...field}
                            />
                        )}
                        name="email"
                        control={control}
                        // defaultValue = {''}
                    />
                    <Controller
                        render={({ field }) => (
                            <TextField
                                label="Password"
                                type="password"
                                error={errors.password ? true : false}
                                helperText={errors.password?.message}
                                size="small"
                                fullWidth
                                sx={{
                                    marginTop: 3,
                                }}
                                {...field}
                            />
                        )}
                        name="password"
                        control={control}
                        // defaultValue = {''}
                    />
                    <div className="mt-6">
                        {isLoginLoading ? (
                            <CircularProgress />
                        ) : (
                            <Button
                                variant="contained"
                                type="submit"
                                fullWidth
                                disableElevation
                                onClick={() => {
                                    // console.log('asdf')
                                    setCounter(state => state + 1)
                                }}
                                sx={{
                                    marginTop: 3,
                                    fontSize: 16,
                                    textTransform: "none",
                                }}
                            >
                                Login
                            </Button>
                        )}
                    </div>
                </form>
            </Paper>
        </Grid>
    );
};

export { Login };
