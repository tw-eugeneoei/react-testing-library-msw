import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import { App } from "./App";
import { rest } from "msw";
import { server } from "./msw/browser";

test("renders spinner on load", () => {
    render(<App />);
    const spinner = screen.getByRole("progressbar");

    expect(spinner).toBeInTheDocument();
});

test("should remove spinner when initialisation completes", async () => {
    render(<App />);
    const spinner = screen.getByRole("progressbar");

    await waitForElementToBeRemoved(spinner);
    expect(spinner).not.toBeInTheDocument();
});

test("should display server error when initialisation fails", async () => {
    server.use(
        rest.get(`${process.env.REACT_APP_API}/auth`, (req, res, ctx) => {
            return res(
                ctx.status(500),
                ctx.text("An error occurred while starting app.")
            );
        })
    );
    render(<App />);
    const alert = await screen.findByRole("alert");

    expect(alert).toBeInTheDocument();
});
