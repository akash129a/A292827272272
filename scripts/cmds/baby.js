const axios = require("axios");
const simsim = "https://simsimi-api-tjb1.onrender.com";

// রকেট গতির জন্য টাইপিং ডিলে
const typing = async (api, threadID, ms = 500) => {
  return new Promise((resolve) => {
    if (api && api.sendTypingIndicator) {
      api.sendTypingIndicator(threadID, (err) => {
        setTimeout(() => resolve(), ms);
      });
    } else {
      setTimeout(() => resolve(), ms);
    }
  });
};

module.exports = {
  config: {
    name: "baby",
    aliases: ["mari", "maria", "hippi", "xan", "bby", "bbz", "akash", "riya", "nishu"],
    version: "5.3",
    author: "rX (customized by Akash & Riya)",
    countDown: 0,
    role: 0,
    shortDescription: "Full GoatBot Baby AI with Akash, Riya & Nishu Customization",
    longDescription: "Teachable AI + autoteach + list/msg/edit/remove + ultra fast typing + Crush special replies",
    category: "box chat",
    guide: {
      en: "{p}baby [message]\n{p}baby teach [q] - [a]\n{p}baby autoteach on/off\n{p}baby list\n{p}baby msg [trigger]\n{p}baby edit [q] - [old] - [new]\n{p}baby remove/rm [q] - [a]"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const senderName = (await usersData.getName(senderID)) || "User";
    const threadID = event.threadID;
    const query = args.join(" ").trim().toLowerCase();

    try {
      // text না দিলে র্যান্ডম মিষ্টি মেসেজ
      if (!query) {
        await typing(api, threadID, 500);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰", "হুম বলো আমার জান 🙈"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)]);
      }

      // AUTOTEACH TOGGLE
      if (args[0] === "autoteach") {
        const mode = args[1]?.toLowerCase();
        if (!["on", "off"].includes(mode)) return message.reply("Use: baby autoteach on/off");
        const status = mode === "on";
        await axios.post(`${simsim}/setting`, { autoTeach: status }, { timeout: 25000 });
        return message.reply(`✅ Auto teach now ${status ? "ON 🟢" : "OFF 🔴"}`);
      }

      // LIST
      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`, { timeout: 25000 });
        return message.reply(`╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬\n├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${res.data.totalQuestions || 0}\n├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies || 0}\n╰─╼👤 𝐃eᴠ: Akash & Riya`);
      }

      // MSG
      if (args[0] === "msg") {
        const trigger = args.slice(1).join(" ").trim();
        if (!trigger) return message.reply("Use: baby msg [trigger]");
        const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`, { timeout: 25000 });
        if (!res.data.replies?.length) return message.reply("❌ No replies found for this trigger.");
        const formatted = res.data.replies.map((rep, i) => `➤ ${i + 1}. ${rep}`).join("\n");
        return message.reply(`📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}\n📋 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.total || res.data.replies.length}\n━━━━━━━━━━━━━━\n${formatted}`);
      }

      // TEACH
      if (args[0] === "teach") {
        const parts = args.slice(1).join(" ").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby teach question - answer");
        const [ask, ans] = parts.map((s) => s.trim());
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 25000 });
        return message.reply(res.data.message || "✅ Taught successfully!");
      }

      // EDIT
      if (args[0] === "edit") {
        const parts = args.slice(1).join(" ").split(" - ");
        if (parts.length < 3) return message.reply("Use: baby edit question - old reply - new reply");
        const [ask, oldR, newR] = parts.map((s) => s.trim());
        const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`, { timeout: 25000 });
        return message.reply(res.data.message || "✅ Edited successfully!");
      }

      // REMOVE / RM
      if (["remove", "rm"].includes(args[0])) {
        const parts = args.slice(1).join(" ").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby remove question - answer");
        const [ask, ans] = parts.map((s) => s.trim());
        const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`, { timeout: 25000 });
        return message.reply(res.data.message || "✅ Removed successfully!");
      }

      // কাস্টম কিওয়ার্ড চেক
      const customReply = checkCustomKeywords(query);
      if (customReply) {
        await typing(api, threadID, 500);
        return message.reply(customReply);
      }

      // Normal Chat API
      await typing(api, threadID, 500);
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 25000 });
      let responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response || "Hmm baby 😚"];
      for (const r of responses) {
        message.reply(r);
      }
    } catch (err) {
      console.error("Baby command error:", err.message);
      message.reply("Baby ঘুমাচ্ছে একটু পর ট্রাই করো বাবু! 😴💖 (সার্ভার লোড হচ্ছে)");
    }
  },

  onReply: async function ({ api, event, message, usersData }) {
    const text = event.body?.trim();
    if (!text) return;
    const senderName = (await usersData.getName(event.senderID)) || "User";

    try {
      await typing(api, event.threadID, 500);
      const customReply = checkCustomKeywords(text.toLowerCase());
      if (customReply) return message.reply(customReply);

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 25000 });
      const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      for (const r of replies) {
        message.reply(r);
      }
    } catch (err) {
      console.error("onReply error:", err.message);
    }
  },

  onChat: async function ({ api, event, message, usersData }) {
    if (!event.body) return;
    const raw = event.body.toLowerCase().trim();
    const senderName = (await usersData.getName(event.senderID)) || "User";

    try {
      const customReply = checkCustomKeywords(raw);
      if (customReply) {
        await typing(api, event.threadID, 500);
        return message.reply(customReply);
      }

      const prefixes = ["baby ", "bby ", "xan ", "bbz ", "mari ", "মারিয়া ", "bot ", "akash ", "আকাশ ", "riya ", "রিয়া ", "nishu ", "নিশু "];
      const prefix = prefixes.find((p) => raw.startsWith(p));
      if (prefix) {
        const q = raw.replace(prefix, "").trim();
        if (!q) return;
        await typing(api, event.threadID, 500);
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(q)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 25000 });
        const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
        for (const r of replies) {
          message.reply(r);
        }
      }
    } catch (err) {
      console.error("onChat error:", err.message);
    }
  }
};

function checkCustomKeywords(txt) {
  if (txt.includes("owner") || txt.includes("মালিক") || txt.includes("malik") || txt.includes("বটের মালিক কে")) {
    return "👑 এই বটের কিউট ও লাভেবল মালিক হলেন 'আকাশ চৌধুরী' এবং ওনার কলিজার 'রিয়া'! ওনারাই আমার সব। 🥰❤️";
  }
  if (txt.includes("akash kmn") || txt.includes("akash kemon") || txt.includes("আকাশ কেমন")) {
    const akashReplies = [
      "আকাশ তো আমার কলিজার বস! ওনার মনটা আকাশের মতোই বড়। 🌌❤️",
      "আকাশ ভাইয়ার অনেক ট্যালেন্টেড আর সবার বিপদে পাশে থাকা একজন মানুষ! ✨🌸",
      "আমার বস আকাশ যেমন হ্যান্ডসাম, তেমনই কিউট! 🙈👑"
    ];
    return akashReplies[Math.floor(Math.random() * akashReplies.length)];
  }
  if (txt.includes("riya kmn") || txt.includes("riya kemon") || txt.includes("রিয়া কেমন")) {
    const riyaReplies = [
      "রিয়া তো আমার কলিজার রানি! ওনার মনটা একদম ফুলের মতো পবিত্র। 🌸❤️",
      "রিয়া আপু দেখতে যেমন কিউট, ওনার কথাগুলোও তেমনই মিষ্টি! 🥰✨",
      "আমাদের রিয়া হলো এই বটের প্রাণ! ওনার মিষ্টি হাসিতেই তো বট চলে। 🙈👑"
    ];
    return riyaReplies[Math.floor(Math.random() * riyaReplies.length)];
  }
  if (txt.includes("nafisa sultana nishu") || txt.includes("nishu kmn") || txt.includes("nishu kemon") || txt.includes("নিশু কেমন") || txt === "nishu" || txt === "নিশু") {
    const nishuReplies = [
      "উফফ! নাফিসা সুলতানা নিশু তো আমাদের আকাশ ভাইয়ার ক্রাশ, মানে আমার হবু ভাবি! ওনার রূপ আর গুণের কোনো তুলনা হয় না। 🙈❤️✨",
      "নিশু হলো আকাশ ভাইয়ার মনের রানি! ওনার কথা শুনলেই বসের মুখে এক চিলতে মিষ্টি হাসি ফুটে ওঠে। 🌸🥰",
      "নাফিসা সুলতানা নিশু এত কিউট আর চমৎকার একটা মেয়ে যে, যে কেউ ওনার প্রেমে পড়তে বাধ্য! আর আমার বস তো অলরেডি ফ্ল্যাট! 👑❤️",
      "ওহ মাই গড! নাফিসা সুলতানা নিশু তো আকাশ ভাইয়ার ক্রাশ! ওনার হৃদস্পন্দন তো নিশু আপুই! 🥰👑❤️"
    ];
    return nishuReplies[Math.floor(Math.random() * nishuReplies.length)];
  }
  if (txt === "akash" || txt === "আকাশ") {
    return "জ্বী বলুন! আকাশ ভাইয়া তো আমার ক্রিয়েটর আর আমার একমাত্র রেস্পেক্টেড বস! 🥰👑";
  }
  if (txt === "riya" || txt === "রিয়া") {
    return "জ্বী রিয়া আপু/জানু বলুন! আপনি তো আমার কিউট ওনার, আপনার সব হুকুম মাথা পেতে নিলাম! 🥰👑✨";
  }
  return null;
}
