import { compare, genSalt, hash } from 'bcrypt';
import express from 'express';
import { generateAccessToken, generateRefreshToken } from '../jwt.js';
import { db } from '../db/mydb.js';
import { usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import  jwt  from 'jsonwebtoken';

export const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    if (!username) {
      return res.status(400).send("username missing");
    }
    if (!password) {
      return res.status(400).send("password missing");
    }
    try {
      const salt = await genSalt(10);
      const cryptPass = await hash(password, salt);
      const accessToken = await generateAccessToken(username);
      const refreshToken = await generateRefreshToken(username);
  
      const [result] = await db
        .insert(usersTable)
        .values({
          username: username,
          password: cryptPass,
          refreshToken: refreshToken,
        })
        .returning({ userId: usersTable.userId });
  
      return res.send({
        accessToken,
        refreshToken,
        userId: result.userId,
        username: username,
      });
    } catch (error) {
      console.log("Error at users-route [/signup] : \n", error);
  
      if (
        error.message == 'duplicate key value violates unique constraint "users_username_unique"'
      ) {
        return res.status(409).send("username already exists");
      } else {
        return res.status(500).send("Internal server error");
      }
    }
  });



  router.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    try {
      const [result] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username));
      if (!result) {
        return res.status(401).send("User does not exist");
      }
      const passwordCheck = await compare(password, result.password);
      if (!passwordCheck) {
        return res.status(401).send("Incorrect password");
      } else {
        const accessToken = await generateAccessToken(username);
        const refreshToken = await generateRefreshToken(username);
        await db
          .update(usersTable)
          .set({ refreshToken: refreshToken })
          .where(eq(usersTable.username, username));
        return res.send({
          accessToken,
          refreshToken,
          userId: result.userId,
          username: username,
        });
      
      }
    } catch (error) {
      console.log("Error at users-route [/signin]: \n", error);
      return res.status(500).send("Internal server error");
    }
  });



  router.get("/logout/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      await db
        .update(usersTable)
        .set({ refreshToken: "" })
        .where(eq(usersTable.userId, userId));
      return res.status(200).send("success");
    } catch (error) {
      console.log("Error at users-route [/logout] : \n", error);
    }
  });


  router.get('/refresh', async (req,res)=>{
    const refreshToken = req.headers['x-refresh-token'];
    if(!refreshToken) return res.status(400).send('No refresh token');

    try {
      await jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      const [result] = await db.select().from(usersTable).where(eq(usersTable.refreshToken, refreshToken));
      if(!result) return res.status(403).send('Token does not exist');
      const accessToken = await generateAccessToken(result.username);
      res.json({accessToken: accessToken});
    } catch (error) {
      console.log('Error at users-route [/getRefresh] : \n', error);
      res.status(401).send('Invalid token');
    }
  })