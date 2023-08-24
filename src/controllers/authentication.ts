import express from "express";
import { createUser, getUserByEmail } from "../db/users";
import { authentication, random } from "../helpers/index";

// LOGIN
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    console.log("Email: " + email + "\nPassword: " + password);
    if (!email || !password) {
      return res.sendStatus(400);
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.sendStatus(400);
    }
    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();
    res.cookie("CUBI-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// REGISTER
export const register = async (req: express.Request, res: express.Response) => {
  try {
    // Registration process | they are stay at src\db\users.ts
    const { email, password, username } = req.body;
    console.log(
      "Email: " + email + "\nPassword: " + password + "\nUsername: " + username
    );
    // 1. If not have pass || email || password
    if (!email || !password || !username) {
      return res.status(400);
    }
    // 2. If user is already existing
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.sendStatus(400);
    }
    // 3. If user not existing [create]
    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
