import * as express from "express";

export const AuthRoutes = express.Router();

AuthRoutes.post(
  "/register",
  async (req: express.Request, res: express.Response) => {
    res.send({ Login: "Register route" });
  },
);

AuthRoutes.post(
  "/login",
  async (req: express.Request, res: express.Response) => {
    res.send({ message: "Login route" });
  },
);

AuthRoutes.post(
  "/refresh-token",
  async (req: express.Request, res: express.Response) => {
    res.json({ message: "Refresh token route" });
  },
);

AuthRoutes.delete(
  "/logout",
  async (req: express.Request, res: express.Response) => {
    res.json({ message: "Logout route" });
  },
);
