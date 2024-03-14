import express, { Router, Request, Response } from "express";

import CreateUser from "../services/createUser";
import LoginController from "../controllers/loginController";

const router: Router = express.Router();
const userRegistration = new CreateUser();

router.post("/new-user", async (req: Request, res: Response) => {
  const { password, email } = req.body;

  if (!password || !email) {
    res.status(400).json({
      error:
        "Veuillez fournir tous les champs nécessaires (username, password, email).",
    });
    return;
  }
  try {
    //New mail(?)
    const register = await userRegistration.createRegister(password, email);
    res.json(register);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await LoginController.login(email, password);
    if (user) {
      res.cookie("jwt", user.jwt, {
        httpOnly: true,
        // secure: true, // Décommenter en https
        //sameSite: "strict", // Décommenter en https
      });
      res.json({
        connected: true,
        jwt: user.jwt,
        email: user.email,
        id: user.user.id,
      });
      console.log(user.jwt, user.email, user.user.id);
    } else {
      res.status(404).json({ connected: false });
    }
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.json({ disconnected: true });
  console.log("logout");
});

export default router;
