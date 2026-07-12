const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

// রকেট গতির জন্য টাইপিং ডিলে ৫০০ মিলিসেকেন্ড রাখা হয়েছে
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
    version: "4.7",
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
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;
    const query = args.join(" ").trim().toLowerCase();

    try {
      // text না দিলে র্যান্ডম মিষ্টি মেসেজ
      if (!query) {
        await typing(api, threadID, 500);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰", "হুম বলো আমার জান 🙈"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // ১. আগে চেক করবে কোনো স্পেশাল সাব-কমান্ড (teach, list, edit etc.) আছে কি না
      if (args[0] === "autoteach") {
        const mode = args[1]?.toLowerCase();
        if (!["on","off"].includes(mode)) return message.reply("Use: baby autoteach on/off");

        const status = mode === "on";
        await axios.post(`${simsim}/setting`, { autoTeach: status }, { timeout: 10000 });
        return message.reply(`✅ Auto teach now ${status ? "ON 🟢" : "OFF 🔴"}`);
      }

      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`, { timeout: 10000 });
        return message.reply(
`╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬
├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧ս: ${res.data.totalQuestions || 0}
├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies || 0}
╰─╼👤 𝐃eᴠ: Akash Chowdhury`
        );
      }

      if (args[0] === "msg") {
        const trigger = args.slice(1).join(" ").trim();
        if (!trigger) return message.reply("Use: baby msg [trigger]");

        const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`, { timeout: 10000 });
        if (!res.data.replies?.length) return message.reply("❌ No replies found for this trigger.");

        const formatted = res.data.replies.map((rep, i) => `➤ ${i+1}. ${rep}`).join("\n");
        return message.reply(
`📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}
📋 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.total || res.data.replies.length}
━━━━━━━━━━━━━━
${formatted}`
        );
      }

      if (args[0] === "teach") {
        const parts = args.slice(1).join(" ").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby teach question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Taught successfully!");
      }

      if (args[0] === "edit") {
        const parts = args.slice(1).join(" ").split(" - ");
        if (parts.length < 3) return message.reply("Use: baby edit question - old reply - new reply");

        const [ask, oldR, newR] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Edited successfully!");
      }

      if (["remove", "rm"].includes(args[0])) {
        const parts = args.slice(1).join(" ").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby remove/rm question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/remove?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Removed successfully!");
      }

      // ২. সাব-কমান্ড না হলে সাধারণ চ্যাটের ক্ষেত্রে নাম চেক করবে
      if (
        query.includes("akash kmn") || 
        query.includes("akash kemon") || 
        query.includes("আকাশ কেমন") || 
        query.includes("boter malik") || 
        query.includes("বটের মালিক") || 
        query.includes("owner")
      ) {
        const akashReplies = [
          "আকাশ তো আমার কলিজার বস! ওনার মনটা আকাশের মতোই বড়। 🌌❤️",
          "আকাশ ভাইয়ার মতো ভালো মানুষ এই যুগে পাওয়াই কঠিন। উনি সবার প্রিয়! 🌷✨",
          "আমার বস আকাশ যেমন হ্যান্ডসাম, তেমনই কিউট! 🙈👑",
          "আকাশ ভাইয়া অনেক ট্যালেন্টেড আর সবার বিপদে পাশে থাকা একজন মানুষ! ✨🌸"
        ];
        return message.reply(akashReplies[Math.floor(Math.random() * akashReplies.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      if (query.includes("riya") || query.includes("রিয়া")) {
        const riyaReplies = [
          "আরেহ্ রিয়া! চমৎকার একটি মিষ্টি নাম। শুনলেই মন ভালো হয়ে যায়! ✨🌸",
          "রিয়া তো একদম লক্ষ্মী একটা মেয়ে, যেমন সুন্দর নাম তেমন সুন্দর তার মন! 💖",
          "রিয়া নামটা শুনলেই কেমন যেন একটা চমৎকার আর মায়াবী অনুভূতি হয়! 🥰",
          "হুম বলো রিয়া সোনা, তোমার জন্য চমৎকার সব গল্প নিয়ে হাজির আমি! 🙈"
        ];
        return message.reply(riyaReplies[Math.floor(Math.random() * riyaReplies.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // ৩. কোনো কন্ডিশন না মিললে সিমসিমি এপিআই থেকে রিপ্লাই আনবে
      await typing(api, threadID, 500);
      const res = await axios.get(`${simsim}/simsimi?ask=${encodeURIComponent(query)}`, { timeout: 10000 });
      return message.reply(res.data.reply || "Opps! Baby forms no reply.", (err, info) => {
        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
      });

    } catch (err) {
      return message.reply("❌ Error connected to server!");
    }
  },

  onReply: async function ({ api, event, reply, message, usersData }) {
    const senderID = event.senderID;
    const threadID = event.threadID;
    const query = event.body.trim().toLowerCase();

    try {
      if (
        query.includes("akash kmn") || 
        query.includes("akash kemon") || 
        query.includes("আকাশ কেমন") || 
        query.includes("boter malik") || 
        query.includes("বটের মালিক") || 
        query.includes("owner")
      ) {
        const akashReplies = [
          "আকাশ তো আমার কলিজার বস! ওনার মনটা আকাশের মতোই বড়। 🌌❤️",
          "আকাশ ভাইয়ার মতো ভালো মানুষ এই যুগে পাওয়াই কঠিন। উনি সবার প্রিয়! 🌷✨"
        ];
        return message.reply(akashReplies[Math.floor(Math.random() * akashReplies.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      if (query.includes("riya") || query.includes("রিয়া")) {
        const riyaReplies = [
          "আরেহ্ রিয়া! চমৎকার একটি মিষ্টি নাম। শুনলেই মন ভালো হয়ে যায়! ✨🌸",
          "রিয়া নামটা শুনলেই কেমন যেন একটা চমৎকার আর মায়াবী অনুভূতি হয়! 🥰"
        ];
        return message.reply(riyaReplies[Math.floor(Math.random() * riyaReplies.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      await typing(api, threadID, 500);
      const res = await axios.get(`${simsim}/simsimi?ask=${encodeURIComponent(query)}`, { timeout: 10000 });
      return message.reply(res.data.reply || "...", (err, info) => {
        if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
      });
    } catch {
      return message.reply("❌ Server busy!");
    }
  }
};
