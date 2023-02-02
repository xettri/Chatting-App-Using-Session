const TelegramBot = require("node-telegram-bot-api");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Hi! I'm ChatGPT. How can I help you today?");
});

bot.on("message", async (msg) => {
  const { chat, text } = msg;
  console.log("msg:", text);
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: "Hello world",
    });
    bot.sendMessage(chat.id, completion.data.choices[0].text);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    bot.sendPhoto(chat.id, "https://picsum.photos/200/300", {
      caption: "",
    });
  }
});
