import express from 'express';
import { db } from '../db/mydb.js';
import { and, desc, eq, sql } from 'drizzle-orm';
import { journalsTable, usersTable } from '../db/schema.js';
import { authorizeAccess } from '../jwt.js';

export const router = express.Router();

router.post("/insertJournal", authorizeAccess, async (req, res) => {
    const { title, content, userId } = req.body;
  
    if (!title || !content || !userId) {
      return res.status(400).send("Missing values");
    }
    try {
      await db.insert(journalsTable).values({
        title: title,
        content: content,
        authorId: userId,
      });
      return res.send("success");
    } catch (error) {
      console.log("Error at journals-route [/insertJournal]: \n", error);
      return res.status(500).send("Internal server error");
    }
  });


  router.get("/getJournals/:userId/:month/:year", authorizeAccess, async (req, res) => {
    const { userId, month, year } = req.params;
    
    if (!userId) {
      return res.status(400).send("user id missing");
    }
    try {
      let datesArray = [];
      const result = await db 
        .select()
        .from(journalsTable)
        .where(and( 
               eq(journalsTable.authorId, userId),
               sql`date_part('month', ${journalsTable.createdAt}) = ${month}`, 
               sql`date_part('year', ${journalsTable.createdAt}) = ${year}`) 
               ).orderBy(desc(journalsTable.createdAt)).limit(31);

        result.map((item)=>{
          datesArray.push(item.createdAt.getDate())
        });
      res.json({journals: result, dates: datesArray});
    } catch (error) {
      console.log("Error at journals-route [/getJournals]: \n", error);
      res.status(500).send("Internal server error");
    }
  });

  router.delete('/deleteJournal/:journalId', authorizeAccess, async(req,res)=> {
     
    const { journalId } = req.params;
    if(!journalId) return res.status(400).send('No journalId provided');
    try {
      await db.delete(journalsTable).where(eq(journalsTable.journalId, journalId));
      res.send('success');
    } catch (error) {
      console.log("Error at journals-route [/deleteJournal]: \n", error);
      res.status(500).send('Internal server error');
    }
  })

  