const geminiInsight = require("../helpers/gemini");
const { Journal } = require("../models");
module.exports = class journalControllers {
  static async generateResponse(req, res, next) {
    try {
      const { userPrompt } = req.body;
      const geminiResponse = await geminiInsight(userPrompt);

      res.status(200).json(geminiResponse);
    } catch (error) {
      console.log(error, "<-- dari generate response");
      next(error);
    }
  }
  static async createJournal(req, res, next) {
    console.log(req.user.dataValues.id, "<-- ini req usernya ");

    try {
      const { content, ai_insight, date } = req.body;
      const UserId = req.user.dataValues.id;

      const newJournal = await Journal.create({
        content,
        ai_insight,
        date,
        UserId,
      });
      console.log(newJournal, "<--- journal yang mau dibuat");

      res.status(201).json(newJournal);
    } catch (error) {
      console.log(error, "<-- dari create journal");
      next(error);
    }
  }
  static async getJournals(req, res, next) {
    try {
      const UserId = req.user.id;

      const journals = await Journal.findAll({ where: { UserId } });
      res.status(200).json(journals);
    } catch (error) {
      console.log(error, "<-- dari get journals");
      next(error);
    }
  }

  static async deleteJournals(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const journal = await Journal.findOne({ where: { id, UserId: userId } });
      if (!journal) throw { name: "NotFound", message: "Journal not Found" };

      await journal.destroy();
      res.status(200).json({
        message: `Journal with id: ${journal.id} deleted successfully`,
      });
    } catch (error) {
      console.log(error, "<-- dari delete journal");
      next(error);
    }
  }
  static async updateJournal(req, res, next) {
    try {
      const { content, ai_insight } = req.body;
      const { id } = req.params;
      const userId = req.user.id;

      const journal = await Journal.findOne({
        where: { id, UserId: userId },
      });

      if (!journal) {
        throw { name: "NotFound", message: "Journal not Found" };
      }

      // Update jurnal
      await journal.update({
        content: content || journal.content,
        ai_insight: ai_insight || journal.ai_insight,
      });

      res.status(200).json(journal);
    } catch (error) {
      console.log(error, "<-- dari updateJournal");
      next(error);
    }
  }

  static async journalById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const journal = await Journal.findOne({
        where: { id, UserId: userId },
      });

      if (!journal) {
        throw { name: "NotFound", message: "Journal not Found" };
      }

      res.status(200).json(journal);
    } catch (error) {
      console.log(error, "<-- dari journal by Id");
      next(error);
    }
  }
};
