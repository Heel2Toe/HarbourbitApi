import express from "express";
import cors from "cors";
import { router as userRoute } from './routes/users-route.js'
import { router as journalRoute } from "./routes/journals-route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user', userRoute);

app.use('/journal', journalRoute);


app.listen(process.env.PORT, () => {
  console.log("server running");
});
