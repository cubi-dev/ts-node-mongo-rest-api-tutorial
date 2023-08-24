import express from "express";
import { deleteUserById, getUserById, getUsers } from "../db/users";

// GET ALL USER
export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// DELETE USER
export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    console.log(
      "================================================" +
        "\nExecuting Delete User with information: " +
        " \nUsername: " +
        user.username +
        "\nEmail: " +
        user.email +
        "\n=============================================="
    );
    const deletedUser = await deleteUserById(id);
    console.log("Deleted User Successfully");
    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// UPDATE USER
export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      return res.sendStatus(403);
    }
    const user = await getUserById(id);
    console.log(
      "================================================" +
        "\nExecuting update username: " +
        user.username
    );
    user.username = username;
    await user.save();
    console.log(
      "\nUpdate User Successfully: " +
        user.username +
        "\n================================================"
    );
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
