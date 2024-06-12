const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv/config");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Maneki-chan Server");
});

app.use(
  cors({
    origin: ["http://localhost:3000", "https://maneki-chan.nnmonday.click"],
    methods: ["GET", "POST"],
  })
);

const token = process.env.TELEGRAM_BOT_TOKEN;
const channelId = process.env.PRIVATE_CHANNEL_ID;

const bot = new TelegramBot(token, { polling: true });

app.post("/send-notification", (req, res) => {
  try {
    const note = req.body.note || "Không có ghi chú";
    const totalPrice = req.body.total || "Không có thông tin tổng tiền";

    const itemDetails = req.body.items
      .map((item) => `<b>${item.name}</b>: ${item.quantity} ${item.unit}`)
      .join("\n");

    function formatDateTime(date) {
      function padToTwoDigits(num) {
        return num.toString().padStart(2, "0");
      }

      const hours = padToTwoDigits(date.getHours());
      const minutes = padToTwoDigits(date.getMinutes());
      const seconds = padToTwoDigits(date.getSeconds());

      const day = padToTwoDigits(date.getDate());
      const month = padToTwoDigits(date.getMonth() + 1);
      const year = date.getFullYear();

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    const message = `
      <b>Có đơn hàng mới</b>\n
      <b>Tên:</b> ${req.body.receiver}\n
      <b>Số điện thoại:</b> ${req.body.phoneNumber}\n
      <b>Địa chỉ:</b> ${req.body.address}\n
      <b>Ghi chú:</b> ${note}\n
      <b>Tổng tiền:</b> ${totalPrice}\n
      <b>Chi tiết:</b>\n${itemDetails}\n
      <b>Thời gian:</b> ${formatDateTime(new Date(req.body.time))}
    `;

    console.log(message);

    bot.sendMessage(channelId, message, { parse_mode: "HTML" });

    res.status(200).json("");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
