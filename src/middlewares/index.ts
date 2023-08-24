import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

// AUTHENTICATION FOR OWNERS USER
export const isOwner = async (
  req: express.Request,
  res: express.Response, 
  next: express.NextFunction
) => {
  try {
    const {id} = req.params; 
    // We already have merge the current user id at function isAuthenticated() so we can get it here with there id 
    const currentUserId = get(req, 'identity._id') as string;
    if (!currentUserId) {
      return res.status(403); 
    }
    if (currentUserId.toString() != id) {
      return res.status(403); 
    }
    next(); 
  } catch (error) {
    console.log(error);
    return res.sendStatus(400); 
  }
};

// AUTHENTICATION - COOKIES
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["CUBI-AUTH"];
    if (!sessionToken) {
      return res.sendStatus(403);
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.sendStatus(403);
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
