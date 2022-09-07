import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { server } from "../../../msw/browser";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LoggedInUserProvider } from "../../../contexts/auth/useLoggedInUser";
import { Login } from "../Login";
import { PageLayout } from "../../../components/layouts/PageLayout";
import { Home } from "../../home/Home";
import { Initialisation } from "../../../components/layouts/Initialisation";

const LoginComponentWithWrapper = () => (
    <LoggedInUserProvider>
        <Initialisation>
            <BrowserRouter>
                <Routes>
                    <Route path="login" element={<Login />} />
                    <Route element={<PageLayout />}>
                        <Route index element={<Home />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Initialisation>
    </LoggedInUserProvider>
);

beforeEach(() => {
    // because there is a user initialisation process,
    // we overwrite /auth endpoint so that user gets router to /login
    server.use(
        rest.get(`${process.env.REACT_APP_API}/auth`, (req, res, ctx) => {
            return res(ctx.status(400), ctx.text("Session has expired."));
        })
    );
});

test("should display email and password input fields", async () => {
    render(<LoginComponentWithWrapper />);
    const emailInput = await screen.findByRole("textbox", { name: /email/i });
    const passwordInput = await screen.findByLabelText(/password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
});

test("login button should be enabled on load", async () => {
    render(<LoginComponentWithWrapper />);
    const loginButton = await screen.findByRole("button", { name: /login/i });

    expect(loginButton).toBeEnabled();
});

test("should show required error message for respective form fields when form is submitted without any values", async () => {
    render(<LoginComponentWithWrapper />);
    const loginButton = await screen.findByRole("button", { name: /login/i });
    userEvent.click(loginButton);

    const emailErrorMessage = await screen.findByText(/Email is required/i);
    const passwordErrorMessage = await screen.findByText(
        /Password is required/i
    );

    // screen.debug()
    expect(emailErrorMessage).toBeInTheDocument();
    expect(passwordErrorMessage).toBeInTheDocument();
});

test("should show spinner when form is submitted with valid field values", async () => {
    render(<LoginComponentWithWrapper />);
    const emailInput = await screen.findByRole("textbox", { name: /email/i });
    const passwordInput = await screen.findByLabelText(/password/i);
    const loginButton = await screen.findByRole("button", { name: /login/i });

    userEvent.type(emailInput, "tony.start@avengers.com");
    userEvent.type(passwordInput, "password1");
    userEvent.click(loginButton);

    const spinner = await screen.findByRole("progressbar");
    expect(spinner).toBeInTheDocument();
});

test("should route user to home page when login is successful", async () => {
    render(<LoginComponentWithWrapper />);

    const emailInput = await screen.findByRole("textbox", { name: /email/i });
    const passwordInput = await screen.findByLabelText(/password/i);
    const loginButton = await screen.findByRole("button", { name: /login/i });

    userEvent.type(emailInput, "jennie.nichols@example.com");
    userEvent.type(passwordInput, "jennie.nichols@example.com");
    userEvent.click(loginButton);

    // since UI design is such that navbar exist only when user is logged in,
    // assertion is based on a reliable landmark to avoid brittle tests
    const navbar = await screen.findByRole("navigation");
    expect(navbar).toBeInTheDocument();
});

test("should show error message when login is not successful", async () => {
    server.use(
        rest.post(`${process.env.REACT_APP_API}/login`, (req, res, ctx) => {
            return res(ctx.status(400), ctx.text("Invalid email or password."));
        })
    );
    render(<LoginComponentWithWrapper />);

    const emailInput = await screen.findByRole("textbox", { name: /email/i });
    const passwordInput = await screen.findByLabelText(/password/i);
    const loginButton = await screen.findByRole("button", { name: /login/i });

    userEvent.type(emailInput, "jennie.nichols@example.com");
    userEvent.type(passwordInput, "asdfasdfasdfasdf");
    userEvent.click(loginButton);

    const error = await screen.findByText(/Invalid email or password/i);
    expect(error).toBeInTheDocument();
});
