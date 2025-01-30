const express = require("express");
const cors = require("cors");
const errorHandling = require("./middleware/errorHandling");
const userController = require("./controllers/userController");
const journalControllers = require("./controllers/journalControllers");
const authentication = require("./middleware/authentication");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post("/register", userController.register);
app.post("/login", userController.login);

app.use(authentication);
app.get("/journals", journalControllers.getJournals);
app.post("/journals", journalControllers.createJournal);
app.post("/generate-response", journalControllers.generateResponse);
app.delete("/journals/:id", journalControllers.deleteJournals);
app.put("/journals/:id", journalControllers.updateJournal);

app.use(errorHandling);
module.exports = { app };
