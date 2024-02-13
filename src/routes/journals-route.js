import express from 'express';
import { db } from '../db/mydb.js';
import { and, desc, eq, sql } from 'drizzle-orm';
import { journalsTable } from '../db/schema.js';
import { authorizeAccess } from '../jwt.js';

export const router = express.Router();

router.get('/getStats/:userId', authorizeAccess, async (req,res) => {
  const {userId} = req.params;
  const date = new Date();
  if(!userId) return res.status(400).send('No userId recieved');
  try {
    const result = await db.select({createdAt: journalsTable.createdAt}).from(journalsTable).where(eq(journalsTable.authorId, userId));
    let lifeTotal = result.length;
    let monthTotal = 0
    result.map((item)=>{
      if(item.createdAt.getMonth() == date.getMonth() && item.createdAt.getFullYear() == date.getFullYear()){
        monthTotal+=1;
      }
    });
    return res.json({lifeTotal, monthTotal}); 
  } catch (error) {
    console.log("Error at journals-route [/getStats]: \n", error);
    return res.status(500).send('Internal server error');
  }
})

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

  router.delete('/deleteJournals/:userId', authorizeAccess, async(req,res)=>{
    const {userId} = req.params;
    if(!userId) return res.status(400).send('No userId recieved');
    try{
     await db.delete(journalsTable).where(eq(userId, journalsTable.authorId))
     return res.send('success');
    }
    catch(error){
     console.log("Error at journals-route [/deleteJournals]: \n", error);
     return res.status(500).send('Internal server error');
    }
  })  
  