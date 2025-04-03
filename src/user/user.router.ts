import { Router } from "express";
import {
  createUser,
  fetchUser,
  getUsers,
  login,
  updateUser,
} from "./user.controller";

export const userRouter = Router();

userRouter.get("/users", getUsers);
// userRouter.post("/users", createUser);
// userRouter.post("/users/login", login);
// userRouter.patch("/users/:userId", updateUser);
// userRouter.delete("/users/:userId", deleteUser);
