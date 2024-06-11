const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv/config");

const app = express();
app.use(express.json());

const token = process.env.TELEGRAM_BOT_TOKEN;
const authorizedUsers = process.env.AUTHORIZED_USERS.split(",");

const bot = new TelegramBot(token, { polling: true });

app.post("/send-notification", (req, res) => {
  authorizedUsers.forEach((userId) => {
    bot.sendMessage(userId, "Hello from the backend!");
  });
  res.status(200).json("");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
