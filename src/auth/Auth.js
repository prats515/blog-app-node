import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma from '../DB/db.config.js';

// Local strategy from passport for username/password login
passport.use(new LocalStrategy(
  async function(username, password, done) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: username,
        },
      });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Parameter missing. Required Email and Password",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid || !user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({
      status: 200,
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      status: 500,
      error: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};
