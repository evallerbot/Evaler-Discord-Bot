import express from "express";
import morgan from "morgan";
import cors from "cors";
import db from "./lib/db";

const app = express();

app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  req;
	res.send("sup");
});

app.get("/:userId/:code", async (req, res) => {
  try {
    const userId = req.params.userId;
    const code = req.params.code;
  
    const docRef = db.collection('users').doc(userId).collection('saved-code').doc(code);
    const doc = await docRef.get();
    
    if(doc.exists){
      res.json(doc.data());
    } else {
      res.status(404).send("No such record.");
    }
  } catch(error){
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default app;
