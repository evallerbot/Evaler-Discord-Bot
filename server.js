const express = require("express");
const db = require("./db/db");
const morgan = require("morgan");
const cors = require("cors");

const server = express();

server.use(morgan("dev"));
server.use(cors());

server.get("/", (req, res) => {
	res.send("I am alive.");
});

server.get("/:id/:name", (req, res) => {
   const id = req.param("id");
   const name = req.param("name");
   
   let docRef = db.collection('users').doc(id).collection('saved-code').doc(name);
   
   docRef.get().then(doc => {
      if(doc.exists){
        const data = doc.data();
        res.json(data);
      } else {
        res.status(404);
        res.send("No such record.");
      }
   });
});

module.exports = server.listen.bind(server, 0, () => {
	console.log("Express server listening successfully.");
});