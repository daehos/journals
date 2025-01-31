if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const errorHandling = require("./middleware/errorHandling");
const userController = require("./controllers/userController");
const journalControllers = require("./controllers/journalControllers");
const authentication = require("./middleware/authentication");
const app = express();
const axios = require("axios");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post("/register", userController.register);
app.post("/google-login", userController.googleLogin);
app.post("/login", userController.login);
app.get("/api/quotes", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://animechan.io/api/v1/quotes/random"
    );
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil quote", error: error.message });
  }
});

app.use(authentication);
app.get("/journals", journalControllers.getJournals);
app.post("/journals", journalControllers.createJournal);
app.post("/generate-response", journalControllers.generateResponse);
app.delete("/journals/:id", journalControllers.deleteJournals);
app.get("/journals/:id", journalControllers.journalById);
app.put("/journals/:id", journalControllers.updateJournal);

app.use(errorHandling);
module.exports = { app };
