const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

async function typing(api, threadID, ms = 500) {
  try {
    if (api && typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  } catch (e) {}
}

module.exports = {
  config: {
    name: "baby",
    aliases: ["mari", "maria", "hippi", "xan", "bby", "bbz", "akash"],
    version: "5.5",
    author: "rX (customized by Akash Chowdhury)",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Baby AI chatbot"
    },
    longDescription: {
      en: "Teachable AI + autoteach + list/msg/edit/remove"
    },
    category: "box chat",
    guide: {
      en: "{p}baby [message]\n{p}baby teach [q] - [a]\n{p}baby autoteach on/off\n{p}baby list\n{p}baby msg [trigger]\n{p}baby edit [q] - [old] - [new]\n{p}baby remove/rm [q] - [a]"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const { threadID, senderID } = event;
    const query = args.join(" ").trim().toLowerCase();

    let senderName = "User";
    try {
      if (usersData && typeof usersData.getName === "function") {
        senderName = await usersData.getName(senderID) || "User";
      }
    } catch (e) {}

    try {
      // ১. যদি খালি মেসেজ দেয়
      if (!query) {
        await typing(api, threadID, 500);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰", "হুম বলো আমার জান 🙈"];
        const replyMsg = ran[Math.floor(Math.random() * ran.length)];
        return message.reply(replyMsg);
      }

      // ২. AUTOTEACH SUB-COMMAND
      if (args[0] === "autoteach") {
        const mode = args[1]?.toLowerCase();
        if (!["on", "off"].includes(mode)) return message.reply("Use: baby autoteach on/off");
        const status = mode === "on";
        await axios.post(`${simsim}/setting`, { autoTeach: status }, { timeout: 10000 });
        return message.reply(`✅ Auto teach now ${status ? "ON 🟢" : "OFF 🔴"}`);
      }

      // ৩. LIST SUB-COMMAND
      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`, { timeout: 10000 });
        return message.reply(`╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬\n├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧ս: ${res.data.totalQuestions || 0}\n├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies || 0}\n╰─╼👤 𝐃eᴠ: Akash Chowdhury`);
      }

      // ৪. MSG SUB-COMMAND
      if (args[0] === "msg") {
        const trigger = args.slice(1).join(" ").trim();
        if (!trigger) return message.reply("Use: baby msg [trigger]");
        const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`, { timeout: 10000 });
        if (!res.data.replies || res.data.replies.length === 0) return message.reply("❌ No replies found for this trigger.");
        const formatted = res.data.replies.map((rep, i) => `➤ ${i + 1}. ${rep}`).join("\n");
        return message.reply(`📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}\n📋 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.total || res.data.replies.length}\n━━━━━━━━━━━━━━\n${formatted}`);
      }

      // ৫. TEACH SUB-COMMAND
      if (args[0] === "teach") {
        const parts = args.slice(1).join(" ").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby teach question - answer");
        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Taught successfully!");
      }

      // 👑 মালিক কন্ডিশন
      if (["akash kmn", "akash kemon", "boter malik", "owner", "আকাশ কেমন"].some(k => query.includes(k))) {
        await typing(api, threadID, 500);
        return message.reply("Akash boss তো সবসময় আগুন 🔥 ওনার মনটা আকাশের মতোই বড়! 🥰");
      }

      // 🌸 রিয়া কন্ডিশন
      if (query.includes("riya") || query.includes("রিয়া")) {
        await typing(api, threadID, 500);
        const riyaReplies = [
          "আরেহ্ রিয়া! চমৎকার একটি মিষ্টি নাম। শুনলেই মন ভালো হয়ে যায়! ✨🌸",
          "রিয়া তো একদম লক্ষ্মী একটা মেয়ে, যেমন সুন্দর নাম তেমন সুন্দর তার মন! 💖"
        ];
        return message.reply(riyaReplies[Math.floor(Math.random() * riyaReplies.length)]);
      }

      // 🤖 মেইন API চ্যাট রেসপন্স
      await typing(api, threadID, 500);
      try {
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 10000 });
        const replyText = res.data?.response || res.data?.reply || "Baby একটু বিজি আছে জানু, একটু পর বলো 🥺";
        return message.reply(replyText);
      } catch (e) {
        console.error("[BABY API ERROR]", e.message);
        return message.reply("API ডাউন আছে বা রেসপন্স করছে না 🥲");
      }

    } catch (err) {
      console.error("[BABY MAIN ERROR]", err.message);
      return message.reply("❌ বটের কিছু একটা সমস্যা হচ্ছে!");
    }
  }
};
