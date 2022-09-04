import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { server } from "../../../msw/browser";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LoggedInUserProvider } from "../../../contexts/auth/useLoggedInUser";
import { Login } from "../Login";
import { PageLayout } from "../../../components/layouts/PageLayout";
import { Home } from "../../home/Home";

const LoginComponentWithWrapper = () => (
    <LoggedInUserProvider>
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route element={<PageLayout />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </LoggedInUserProvider>
);

test("should display email and password input fields", () => {
    render(<LoginComponentWithWrapper />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
});

test("login button should be enabled on load", () => {
    render(<LoginComponentWithWrapper />);

    const loginButton = screen.getByRole("button", { name: /login/i });

    expect(loginButton).toBeEnabled();
});

test("should show required error message for respective form fields when form is submitted without any values", async () => {
    render(<LoginComponentWithWrapper />);
    const loginButton = screen.getByRole("button", { name: /login/i });
    userEvent.click(loginButton);

    const loginErrorMessage = await screen.findByText("Email is required.");
    const passwordErrorMessage = await screen.findByText(
        "Password is required."
    );

    expect(loginErrorMessage).toBeInTheDocument();
    expect(passwordErrorMessage).toBeInTheDocument();
});

test("should show spinner when form is submitted with valid field values", async () => {
    // because implementation runs user initialisation process on load
    // therefore overwrite msw's /auth route for initialisation process to fail
    // so login page can render
    server.use(
        rest.get(`${process.env.REACT_APP_API}/auth`, (req, res, ctx) => {
            return res(
                ctx.status(400),
                ctx.json({
                    message: "Session has expired."
                })
            );
        })
    );
    render(<LoginComponentWithWrapper />);
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    userEvent.type(emailInput, "tony.start@avengers.com");
    userEvent.type(passwordInput, "password1");
    userEvent.click(loginButton);

    const spinner = await screen.findByRole("progressbar");
    expect(spinner).toBeInTheDocument();
});

test("should route user to home page when login is successful", async () => {
    render(<LoginComponentWithWrapper />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    userEvent.type(emailInput, "jennie.nichols@example.com");
    userEvent.type(passwordInput, "jennie.nichols@example.com");
    userEvent.click(loginButton);

    const navbar = await screen.findByRole("navigation");
    expect(navbar).toBeInTheDocument();
});

test("should show error message when login is not successful", async () => {
    server.use(
        rest.get(`${process.env.REACT_APP_API}/auth`, (req, res, ctx) => {
            return res(
                ctx.status(400),
                ctx.json({
                    message: "Session has expired."
                })
            );
        }),
        rest.post(`${process.env.REACT_APP_API}/login`, (req, res, ctx) => {
            return res(
                ctx.status(400),
                ctx.text("Invalid email or password.")
            );
        })
    );
    render(<LoginComponentWithWrapper />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /login/i });

    userEvent.type(emailInput, "jennie.nichols@example.com");
    userEvent.type(passwordInput, "asdfasdfasdfasdf");
    userEvent.click(loginButton);

    const error = await screen.findByText(/Invalid email or password/i);
    expect(error).toBeInTheDocument();
});
