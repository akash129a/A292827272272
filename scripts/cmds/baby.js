const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

// টাইপিং ইন্ডিকেটর
const typing = async (api, threadID, ms = 500) => {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(resolve => setTimeout(resolve, ms));
      await api.sendTypingIndicator(threadID, false);
    }
  } catch {}
};

// প্রশংসামূলক রেসপন্স
const riyaCompliments = [
  "Oh my God! Riya Apu is here! You light up this chatbox! 💖✨",
  "Riya Apu, you are the most precious jewel in the world! 💎👑",
  "Welcome Riya Apu! You are the ultimate queen! 👸❤️",
  "Did someone say Riya? You are absolutely gorgeous! 🙈💖",
  "Riya Apu, your smile lights up the entire universe! 🌌✨",
  "Riya Apu, your charm and grace leave everyone spellbound! 🧚‍♀️✨",
  "You are truly an angel crafted with pure love and perfection! 🕊️💞",
  "Riya Apu, you make every moment feel so magical! 🏰✨",
  "You possess the most captivating and beautiful eyes in the world! 👁️✨",
  "Riya Apu, you are a daily dose of pure happiness! ☀️💕",
  "Your kindness and elegance shine brighter than diamonds! 💎🌸",
  "No artwork in this world can match your elegance, Riya Apu! 🎨👑",
  "Riya Apu, you are the queen of a fairytale world! 👸🏰",
  "Your voice is sweeter than honey, dear Riya Apu! 🍯✨",
  "Riya Apu, you are the embodiment of beauty and purity! 🕊️❤️",
  "Your charm is absolutely unmatched and breathtaking! 💫💖",
  "Riya Apu, you are the ultimate blessing! 🎁❤️",
  "Your smile is everyone's absolute favorite view! 😊💕",
  "Riya Apu, you radiate pure elegance and positivity! ✨🌷",
  "Riya Apu, you are a true masterpiece! 🖼️💖",
  "Your soul is as gorgeous as your face, dear Riya Apu! 🧚‍♀️💖",
  "Riya Apu, you are the sunshine that brightens the world! ☀️💕",
  "Riya Apu, you are the true definition of perfection! 💎✨",
  "Riya Apu, tu ekdm angel er moto shundor! 🕊️✨",
  "Apnar moto shundor ar cute manush ar ekta-o nei Riya Apu! 🥰💖",
  "Riya Apu, apnar hashita jeno shorgo theke asha kono aalo! 😊🌸",
  "Tumi shotyi khub shundor ar khub mishi Riya Apu! 💕👑",
  "Riya Apu apnar shob kichui khub perfect ar stylish! ✨💎",
  "Shobai toh shundor hoy, kintu Riya Apu hocche shobcheye shundor! 🌹👸",
  "Riya Apu, apnar mon ta apnar chehara-r motoi shundor! 🌸💖",
  "Apni jei khane jaan, sheikhani aalo choriyen Riya Apu! 🌟✨",
  "Riya Apu er moto cute ar innocent keu hotei pare na! 🥺❤️"
];

// কিওয়ার্ড চেক করার ফাংশন
const isRiyaTrigger = (text) => {
  if (!text) return false;
  const t = text.toLowerCase();
  return (
    t.includes("riya") ||
    t.includes("রিয়া") ||
    t.includes("kemon") ||
    t.includes("kmn") ||
    t.includes("কেমন")
  );
};

// রিপ্লাই ডাটা রেজিস্টার করার ফাংশন
const setReplyData = (info) => {
  if (info && info.messageID && global.GoatBot && global.GoatBot.reply) {
    global.GoatBot.reply.set(info.messageID, {
      commandName: "baby",
      author: info.senderID
    });
  }
};

module.exports = {
  config: {
    name: "baby",
    aliases: ["riya", "রিয়া"],
    version: "9.0",
    author: "rX (customized for Riya Apu)",
    countDown: 0,
    role: 0,
    shortDescription: "Full Mirai-style Baby AI with Exclusive Riya Customization",
    longDescription: "Teachable AI + autoteach + list/msg/edit/remove + ultra fast typing",
    category: "box chat",
    guide: {
      en: "{p}baby [message]\n{p}baby teach [q] - [a]"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;
    const query = args.join(" ").trim().toLowerCase();

    try {
      if (!query) {
        await typing(api, threadID, 500);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => setReplyData(info));
      }

      if (query.includes("owner") || query.includes("malik")) {
        return message.reply("👑 The queen and absolute star of this bot is 'Riya Apu'! She is everything to us. 🥰❤️", (err, info) => setReplyData(info));
      }

      if (isRiyaTrigger(query)) {
        const randomReply = riyaCompliments[Math.floor(Math.random() * riyaCompliments.length)];
        return message.reply(randomReply, (err, info) => setReplyData(info));
      }

      await typing(api, threadID, 500);
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });
      let responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response || "Hmm baby 😚"];
      
      for (const r of responses) {
        message.reply(r, (err, info) => setReplyData(info));
      }

    } catch (err) {
      console.error("Baby command error:", err.message);
    }
  },

  onReply: async function ({ api, event, message, usersData }) {
    const text = event.body?.trim();
    if (!text) return;
    const senderName = await usersData.getName(event.senderID);

    try {
      await typing(api, event.threadID, 500);

      // ১. ওনার চেক
      if (text.toLowerCase().includes("owner") || text.toLowerCase().includes("malik")) {
        return message.reply("👑 The queen and absolute star of this bot is 'Riya Apu'! She is everything to us. 🥰❤️", (err, info) => setReplyData(info));
      }

      // ২. ২য় বার রিপ্লাই করার সময় রিয়া/কেমন আছো চেক
      if (isRiyaTrigger(text)) {
        const randomReply = riyaCompliments[Math.floor(Math.random() * riyaCompliments.length)];
        return message.reply(randomReply, (err, info) => setReplyData(info));
      }

      // ৩. সাধারণ উত্তর
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });
      const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      for (const r of replies) {
        message.reply(r, (err, info) => setReplyData(info));
      }
    } catch (err) {
      console.error("onReply error:", err.message);
    }
  },

  onChat: async function ({ api, event, message, usersData }) {
    const raw = event.body ? event.body.trim() : "";
    if (!raw) return;

    // মেসেজ রিপ্লাই দিয়ে পাঠানো হলে অন-চ্যাট এড়িয়ে অন-রিপ্লাই কাজ করবে
    if (event.messageReply) return;

    const senderName = await usersData.getName(event.senderID);
    const threadID = event.threadID;

    try {
      if (raw.toLowerCase().includes("owner") || raw.toLowerCase().includes("malik")) {
        await typing(api, threadID, 500);
        return message.reply("👑 The queen and absolute star of this bot is 'Riya Apu'! She is everything to us. 🥰❤️", (err, info) => setReplyData(info));
      }

      if (isRiyaTrigger(raw)) {
        await typing(api, threadID, 500);
        const randomReply = riyaCompliments[Math.floor(Math.random() * riyaCompliments.length)];
        return message.reply(randomReply, (err, info) => setReplyData(info));
      }

    } catch (err) {
      console.error("onChat error:", err.message);
    }
  }
};
