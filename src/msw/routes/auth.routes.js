import { rest } from "msw";

export const authRoutes = [
    rest.get(`${process.env.REACT_APP_API}/auth`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.delay(100),
            ctx.json({
                firstName: "Jennie",
                lastName: "Nichols",
                email: "jennie.nichols@example.com",
                avatar: "https://randomuser.me/api/portraits/thumb/men/75.jpg"
            })
        );
    }),

    rest.post(`${process.env.REACT_APP_API}/login`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.delay(100),
            ctx.json({
                "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Implbm5pZS5uaWNob2xzQGV4YW1wbGUuY29tIiwiaWF0IjoxNjYyMDMzOTg0LCJleHAiOjE2NjIwMzc1ODQsInN1YiI6IjEifQ.ReuKemlapVBY88FMRLDkQmyHE7pwKwOKk8OGr6pYw4Y",
                "user": {
                    "email": "jennie.nichols@example.com",
                    "firstName": "Jennie",
                    "lastName": "Nichols",
                    "id": 1
                }
            })
        );
    }),
]