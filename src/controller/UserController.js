import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from "../DB/db.config.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!name || !email || !password) {
        return res.status(400).json({
          status: 400,
          message: "Some parameter is missing. Required Name, Email and Password",
        });
      }

    if (findUser) {
      return res.json({
        status: 400,
        message: "Email already taken, use another one !",
      });
    }

    const salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password,salt)

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        age: age,
      },
    });
    return res.json({
      status: 200,
      user: {"name":newUser.name, "email":newUser.email},
      message: "User created successfully !",
    });
  } catch (error) {
    console.error(error);
    return res.json({ status: 500, message: error });
  } finally {
    await prisma.$disconnect();
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    let response = {};
    
    if (user) {
      response = {
        status: 200,
        user: user,
      };
    } else {
      response = {
        status: 404,
        message: "User not found.",
      };
    }

    return res.json(response);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const findUser = await prisma.user.findMany({
      include: {
        post: {
          select: {
            title: true,
            comment_count: true,
          },
        },
      },
    });
    return res.json({
      status: 200,
      data: findUser,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;
    await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        name,
        email,
        password,
      },
    });
    return res.json({
      status: 200,
      message: "User updated Successfully!",
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      await prisma.user.delete({
        where: {
          id: Number(userId),
        },
      });
      return res.json({
        status: 200,
        message: "User Deleted Successfully!",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.code === 'P2025') { 
        const userId = req.params.id;
        return res.status(404).json({
          status: 404,
          error: `User not found with id ${userId}.`,
        });
      } else {
        return res.status(500).json({
          status: 500,
          error: "Internal Server Error",
        });
      }
    } finally {
      await prisma.$disconnect();
    }
  };
  
  