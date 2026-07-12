const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

const typing = async (api, threadID, ms = 500) => {
  try {
    if (typeof api.sendTypingIndicator === "function") {
      await api.sendTypingIndicator(threadID, true);
      await new Promise(resolve => setTimeout(resolve, ms));
      await api.sendTypingIndicator(threadID, false);
    }
  } catch {}
};

module.exports = {
  config: {
    name: "baby",
    aliases: ["mari", "maria", "hippi", "xan", "bby", "bbz", "akash"],
    version: "5.1",
    author: "rX (customized by Akash Chowdhury)",
    countDown: 0,
    role: 0,
    shortDescription: "Full Mirai-style Baby AI with New Akash Customization",
    longDescription: "Teachable AI + autoteach + list/msg/edit/remove + ultra fast typing",
    category: "box chat",
    guide: {
      en: "{p}baby [message]\n{p}baby teach [q] - [a]\n{p}baby autoteach on/off\n{p}baby list\n{p}baby msg [trigger]\n{p}baby edit [q] - [old] - [new]\n{p}baby remove/rm [q] - [a]"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const threadID = event.threadID;
    const query = args.join(" ").trim().toLowerCase();

    // Safe Name Fetching
    let senderName = "User";
    try {
      if (usersData && typeof usersData.getName === "function") {
        senderName = await usersData.getName(senderID) || "User";
      }
    } catch (e) {
      console.log("[BABY] Could not fetch username, using default.");
    }

    try {
      if (!query) {
        await typing(api, threadID, 500);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰", "হুম বলো আমার জান 🙈"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => {
          if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // 1. AUTOTEACH
      if (args[0] === "autoteach") {
        const mode = args[1]?.toLowerCase();
        if (!["on","off"].includes(mode)) return message.reply("Use: baby autoteach on/off");
        const status = mode === "on";
        await axios.post(`${simsim}/setting`, { autoTeach: status }, { timeout: 15000 });
        return message.reply(`✅ Auto teach now ${status ? "ON 🟢" : "OFF 🔴"}`);
      }

      // 2. LIST
      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`, { timeout: 15000 });
        return message.reply(`╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬\n├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${res.data.totalQuestions || 0}\n├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies || 0}\n╰─╼👤 𝐃eᴠ: Akash Chowdhury`);
      }

      // 3. MSG
      if (args[0] === "msg") {
        const trigger = args.slice(1).join(" ").trim();
        if (!trigger) return message.reply("Use: baby msg [trigger]");
        const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`, { timeout: 15000 });
        if (!res.data.replies?.length) return message.reply("❌ No replies found for this trigger.");
        const formatted = res.data.replies.map((rep, i) => `➤ ${i+1}. ${rep}`).join("\n");
        return message.reply(`📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}\n📋 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.total || res.data.replies.length}\n━━━━━━━━━━━━━━\n${formatted}`);
      }

      // 4. TEACH
      if (args[0] === "teach") {
        const parts = args.slice(1).join(" ").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby teach question - answer");
        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 15000 });
        return message.reply(res.data.message || "✅ Taught successfully!");
      }

      // 5. EDIT (নতুন যুক্ত করা হয়েছে)
      if (args[0] === "edit") {
        const parts = args.slice(1).join(" ").split(" - ");
        if (parts.length < 3) return message.reply("Use: baby edit question - old_answer - new_answer");
        const [ask, oldAns, newAns] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&oldAns=${encodeURIComponent(oldAns)}&newAns=${encodeURIComponent(newAns)}`, { timeout: 15000 });
        return message.reply(res.data.message || "✅ Edited successfully!");
      }

      // 6. REMOVE (নতুন যুক্ত করা হয়েছে)
      if (args[0] === "remove" || args[0] === "rm") {
        const parts = args.slice(1).join(" ").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby remove question - answer");
        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/remove?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`, { timeout: 15000 });
        return message.reply(res.data.message || "✅ Removed successfully!");
      }

      // মালিক কন্ডিশন
      if (
        query.includes("akash kmn") || 
        query.includes("akash kemon") || 
        query.includes("akash kemon acho") || 
        query.includes("আকাশ কেমন") ||
        query.includes("boter malik") || 
        query.includes("বটের মালিক") || 
        query.includes("owner")
      ) {
        await typing(api, threadID, 500);
        return message.reply("Akash boss তো সবসময় আগুন 🔥 ওনার মনটা আকাশের মতোই বড়! 🥰");
      }

      // রিয়া কন্ডিশন
      if (query.includes("riya") || query.includes("রিয়া")) {
        await typing(api, threadID, 500);
        const riyaReplies = [
          "আরেহ্ রিয়া! চমৎকার একটি মিষ্টি নাম। শুনলেই মন ভালো হয়ে যায়! ✨🌸",
          "রিয়া তো একদম লক্ষ্মী একটা মেয়ে, যেমন সুন্দর নাম তেমন সুন্দর তার মন! 💖"
        ];
        return message.reply(riyaReplies[Math.floor(Math.random() * riyaReplies.length)], (err, info) => {
          if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // API Call
      await typing(api, threadID, 500);
      try {
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 15000 });
        
        let replyText = res.data?.response || res.data?.reply || "Baby একটু বিজি আছে জানু, একটু পর বলো 🥺";
        return message.reply(replyText, (err, info) => {
          if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      } catch (e) {
        console.error("[BABY] API Error:", e.message);
        return message.reply("API ডাউন আছে বা রেসপন্স করছে না 🥲");
      }

    } catch (err) {
      console.error("[BABY] Main Error:", err.message);
      return message.reply("❌ বটের কিছু একটা সমস্যা হচ্ছে!");
    }
  },

  onReply: async function ({ api, event, reply, message, usersData }) {
    const senderID = event.senderID;
    const threadID = event.threadID;
    const query = event.body.trim().toLowerCase();

    let senderName = "User";
    try {
      if (usersData && typeof usersData.getName === "function") {
        senderName = await usersData.getName(senderID) || "User";
      }
    } catch (e) {}

    try {
      if (
        query.includes("akash kmn") || 
        query.includes("akash kemon") || 
        query.includes("boter malik") || 
        query.includes("owner")
      ) {
        return message.reply("Akash boss তো সবসময় আগুন 🔥");
      }

      if (query.includes("riya") || query.includes("রিয়া")) {
        return message.reply("রিয়া চমৎকার একটা নাম! 🥰");
      }

      await typing(api, threadID, 500);
      try {
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 15000 });
        let replyText = res.data?.response || res.data?.reply || "...";
        return message.reply(replyText, (err, info) => {
          if (!err && global.GoatBot?.onReply) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      } catch (e) {
        return message.reply("API ডাউন আছে 🥲");
      }
    } catch (err) {
      console.error("[BABY] Reply Error:", err.message);
    }
  }
};
