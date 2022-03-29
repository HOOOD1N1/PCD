import "dotenv/config";
import express from "express";
import cors from "cors";

import { getNotes, addNote } from "./resolvers.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/notes", (req, res) => {
  getNotes(req, res);
})

app.post("/notes", (req, res) => {
  addNote(req, res);
})

app.listen(process.env.PORT, () => {
  console.log(`Application listening on port ${process.env.PORT}`);
});