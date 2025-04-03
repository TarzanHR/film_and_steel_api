import { Request, Response } from "express";
import prisma from "../client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const fetchUser = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const user = await prisma.mp_users.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Ne pas renvoyer le mot de passe
    const { password, ...userWithoutPassword } = user;
    res.status(200).send(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "Failed to fetch user",
    });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.mp_users.findMany({
      select: {
        rowid: true,
        username: true,
        firstname: true,
        lastname: true,
        date_created: true,
        date_updated: true,
        admin: true,
      },
    });
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { username, password, firstname, lastname, admin = 0 } = req.body;

  if (!username || !password || !firstname || !lastname) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  try {
    const existingUser = await prisma.mp_users.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(401).json({
        error: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.mp_users.create({
      data: {
        username,
        password: hashedPassword,
        firstname,
        lastname,
        admin,
      },
    });

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).send(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({
      error: "Failed to create user",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required",
    });
  }

  try {
    const user = await prisma.mp_users.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Username not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.rowid,
        username: user.username,
        admin: user.admin,
      },
      process.env.JWT_SECRET as jwt.Secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      token,
      user: {
        id: user.rowid,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        admin: user.admin,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      error: "Failed to login",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const { password, firstname, lastname, admin } = req.body;

    const user = await prisma.mp_users.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const data: any = {
      date_updated: new Date(),
    };

    if (firstname) data.firstname = firstname;
    if (lastname) data.lastname = lastname;
    if (admin !== undefined) data.admin = admin;

    // Si un nouveau mot de passe est fourni, le hacher
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.mp_users.update({
      where: {
        username,
      },
      data,
    });

    // Ne pas renvoyer le mot de passe
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).send(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: "Failed to update user",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.mp_users.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await prisma.mp_users.delete({
      where: {
        username,
      },
    });

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Failed to delete user",
    });
  }
};
