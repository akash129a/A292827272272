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
    aliases: ["mari", "maria", "hippi", "xan", "bby", "bbz", "akash", "riya"],
    version: "4.6",
    author: "rX (customized by Akash & Riya)",
    countDown: 0,
    role: 0,
    shortDescription: "Full Mirai-style Baby AI with Akash & Riya Customization",
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

      // বটের মালিক কে জিজ্ঞেস করলে
      if (query.includes("owner") || query.includes("মালিক") || query.includes("malik") || query.includes("বটের মালিক কে")) {
        return message.reply("👑 এই বটের কিউট ও লাভেবল মালিক হলেন 'আকাশ চৌধুরী' এবং ওনার কলিজার 'রিয়া'! ওনারাই আমার সব। 🥰❤️");
      }

      // কাস্টম টেক্সট সার্চ (আকাশ কেমন জিজ্ঞেস করলে)
      if (query.includes("akash kmn") || query.includes("akash kemon") || query.includes("আকাশ কেমন")) {
        const akashReplies = [
          "আকাশ তো আমার কলিজার বস! ওনার মনটা আকাশের মতোই বড়। 🌌❤️",
          "আকাশ ভাইয়া অনেক ট্যালেন্টেড আর সবার বিপদে পাশে থাকা একজন মানুষ! ✨🌸",
          "আমার বস আকাশ যেমন হ্যান্ডসাম, তেমনই কিউট! 🙈👑",
          "আকাশ ভাইয়ার মতো ভালো মানুষ এই যুগে পাওয়াই কঠিন। উনি সবার প্রিয়! 🌷✨"
        ];
        return message.reply(akashReplies[Math.floor(Math.random() * akashReplies.length)]);
      }

      // কাস্টম টেক্সট সার্চ (রিয়া কেমন জিজ্ঞেস করলে)
      if (query.includes("riya kmn") || query.includes("riya kemon") || query.includes("রিয়া কেমন")) {
        const riyaReplies = [
          "রিয়া তো আমার কলিজার রানি! ওনার মনটা একদম ফুলের মতো পবিত্র। 🌸❤️",
          "রিয়া আপু দেখতে যেমন কিউট, ওনার কথাগুলোও তেমনই মিষ্টি! 🥰✨",
          "আমাদের রিয়া হলো এই বটের প্রাণ! ওনার মিষ্টি হাসিতেই তো বট চলে। 🙈👑",
          "রিয়া আপুর মতো চমৎকার আর কেয়ারিং মানুষ সত্যিই খুব কম আছে! 🌷✨"
        ];
        return message.reply(riyaReplies[Math.floor(Math.random() * riyaReplies.length)]);
      }

      // AUTOTEACH TOGGLE
      if (args[0] === "autoteach") {
        const mode = args[1]?.toLowerCase();
        if (!["on","off"].includes(mode)) return message.reply("Use: baby autoteach on/off");

        const status = mode === "on";
        await axios.post(`${simsim}/setting`, { autoTeach: status }, { timeout: 10000 });
        return message.reply(`✅ Auto teach now ${status ? "ON 🟢" : "OFF 🔴"}`);
      }

      // LIST
      if (args[0] === "list") {
        const res = await axios.get(`${simsim}/list`, { timeout: 10000 });
        return message.reply(
`╭─╼🌟 𝐁𝐚𝐛𝐲 𝐀𝐈 𝐒𝐭𝐚𝐭𝐮𝐬
├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${res.data.totalQuestions || 0}
├ 📦 𝐒𝐭𝐨𝐫𝐞𝐝 𝐑𝐞𝐩𝐥𝐢𝐞𝐬: ${res.data.totalReplies || 0}
╰─╼👤 𝐃eᴠ: Akash & Riya`
        );
      }

      // MSG
      if (args[0] === "msg") {
        const trigger = args.slice(1).join(" ").trim();
        if (!trigger) return message.reply("Use: baby msg [trigger]");

        const res = await axios.get(`${simsim}/simsimi-list?ask=${encodeURIComponent(trigger)}`, { timeout: 10000 });
        if (!res.data.replies?.length) return message.reply("❌ No replies found for this trigger.");

        const formatted = res.data.replies.map((rep, i) => `➤ ${i+1}. ${rep}`).join("\n");
        return message.reply(
`📌 𝗧𝗿𝗶𝗴𝗴𝗲𝗿: ${trigger.toUpperCase()}
📋 𝗧𝗼𝘁𝗮𝗹 延𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.total || res.data.replies.length}
━━━━━━━━━━━━━━
${formatted}`
        );
      }

      // TEACH
      if (args[0] === "teach") {
        const parts = query.replace(/^teach\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby teach question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Taught successfully!");
      }

      // EDIT
      if (args[0] === "edit") {
        const parts = query.replace(/^edit\s+/i, "").split(" - ");
        if (parts.length < 3) return message.reply("Use: baby edit question - old reply - new reply");

        const [ask, oldR, newR] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Edited successfully!");
      }

      // REMOVE / RM
      if (["remove","rm"].includes(args[0])) {
        const parts = query.replace(/^(remove|rm)\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby remove question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Removed successfully!");
      }

      // Normal chat
      await typing(api, threadID, 500);
      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(query)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

      let responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response || "Hmm baby 😚"];
      for (const r of responses) {
        await new Promise(resolve => {
          message.reply(r, (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
            resolve();
          });
        });
      }

    } catch (err) {
      console.error("Baby command error:", err.message);
      message.reply("❌ Error: " + (err.message.includes("404") ? "Feature not available (backend issue)" : err.message));
    }
  },

  onReply: async function ({ api, event, message, usersData }) {
    const text = event.body?.trim();
    if (!text) return;
    const senderName = await usersData.getName(event.senderID);

    try {
      await typing(api, event.threadID, 500);
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes("owner") || lowerText.includes("মালিক") || lowerText.includes("malik") || lowerText.includes("বটের মালিক কে")) {
        return message.reply("👑 আমার কিউট মালিক হলেন 'আকাশ চৌধুরী' আর ওনার কলিজার 'রিয়া'! 🥰❤️");
      }
      if (lowerText.includes("akash kmn") || lowerText.includes("akash kemon") || lowerText.includes("আকাশ কেমন")) {
        return message.reply("আমার ওনার আকাশ ভাইয়া তো এই দুনিয়ার অন্যতম সেরা মানুষ! 👑❤️");
      }
      if (lowerText.includes("riya kmn") || lowerText.includes("riya kemon") || lowerText.includes("রিয়া কেমন")) {
        return message.reply("আমার মিষ্টি রিয়া আপু তো একদম রাজকন্যার মতো কিউট আর ভালো মন বিশিষ্ট! 👑✨");
      }

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

      const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      for (const r of replies) {
        await message.reply(r, (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }
    } catch (err) {
      console.error("onReply error:", err.message);
    }
  },

  onChat: async function ({ api, event, message, usersData }) {
    const raw = event.body ? event.body.toLowerCase().trim() : "";
    if (!raw) return;

    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;

    try {
      // বটের মালিক কে জিজ্ঞেস করলে
      if (raw.includes("owner") || raw.includes("মালিক") || raw.includes("malik") || raw.includes("বটের মালিক কে")) {
        await typing(api, threadID, 500);
        return message.reply("👑 এই বটের কিউট ও লাভেবল মালিক হলেন 'আকাশ চৌধুরী' এবং ওনার কলিজার 'রিয়া'! ওনারাই আমার সব। 🥰❤️", (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // আকাশ কেমন
      if (raw.includes("akash kmn") || raw.includes("akash kemon") || raw.includes("আকাশ কেমন")) {
        await typing(api, threadID, 500);
        const akashReplies = [
          "আকাশ তো আমার কলিজার বস! ওনার মনটা আকাশের মতোই বড়। 🌌❤️",
          "আকাশ ভাইয়া অনেক ট্যালেন্টেড আর সবার বিপদে পাশে থাকা একজন মানুষ! ✨🌸",
          "আমার বস আকাশ যেমন হ্যান্ডসাম, তেমনই কিউট! 🙈👑",
          "আকাশ ভাইয়ার মতো ভালো মানুষ এই যুগে পাওয়াই কঠিন। উনি সবার প্রিয়! 🌷✨"
        ];
        return message.reply(akashReplies[Math.floor(Math.random() * akashReplies.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // রিয়া কেমন
      if (raw.includes("riya kmn") || raw.includes("riya kemon") || raw.includes("রিয়া কেমন")) {
        await typing(api, threadID, 500);
        const riyaReplies = [
          "রিয়া তো আমার কলিজার রানি! ওনার মনটা একদম ফুলের মতো পবিত্র। 🌸❤️",
          "রিয়া আপু দেখতে যেমন কিউট, ওনার কথাগুলোও তেমনই মিষ্টি! 🥰✨",
          "আমাদের রিয়া হলো এই বটের প্রাণ! ওনার মিষ্টি হাসিতেই তো বট চলে। 🙈👑",
          "রিয়া আপুর মতো চমৎকার আর কেয়ারিং মানুষ সত্যিই খুব কম আছে! 🌷✨"
        ];
        return message.reply(riyaReplies[Math.floor(Math.random() * riyaReplies.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // শুধু ট্র্রিগার বা নাম ধরে ডাকলে
      const triggers = ["baby","bby","xan","bbz","mari","মারিয়া","bot","akash","আকাশ","riya","রিয়া"];
      if (triggers.includes(raw)) {
        await typing(api, threadID, 500);
        
        // আকাশ নাম ধরে ডাকলে
        if (raw === "akash" || raw === "আকাশ") {
          return message.reply("জ্বী বলুন! আকাশ ভাইয়া তো আমার ক্রিয়েটর আর আমার একমাত্র রেস্পেক্টেড বস! 🥰👑", (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
          });
        }

        // রিয়া নাম ধরে ডাকলে
        if (raw === "riya" || raw === "রিয়া") {
          return message.reply("জ্বী রিয়া আপু/জানু বলুন! আপনি তো আমার কিউট ওনার, আপনার সব হুকুম মাথা পেতে নিলাম! 🥰👑✨", (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
          });
        }

        const funny = [
          "কি হয়েছে জান বলো? শুনছি তো! 😿",
          "এতো মিষ্টি করে ডাকলে তো আমি প্রেমে পড়ে যাবো! 🙆‍♀️❤️",
          "হুম বলো পাখি, শুনছি তো! 🫶🐤",
          "ডাকছো কেন বাবু? সারাক্ষণ তো তোমার কথাই ভাবি! 😘",
          "জ্বী জানু বলো, তোমার জন্য সব কাজ ফেলে চলে আসলাম! 🥰"
        ];
        return message.reply(funny[Math.floor(Math.random() * funny.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // prefixes
      const prefixes = ["baby ","bby ","xan ","bbz ","mari ","মারিয়া ","bot ","akash ","আকাশ ","riya ","রিয়া "];
      const prefix = prefixes.find(p => raw.startsWith(p));
      if (prefix) {
        const q = raw.replace(prefix,"").trim();
        if (!q) return;

        await typing(api, threadID, 500);
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(q)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

        const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
        for (const r of replies) {
          await message.reply(r, (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
          });
        }
        return;
      }

      // AUTO-TEACH from reply
      if (event.messageReply) {
        try {
          const setting = await axios.get(`${simsim}/setting`, { timeout: 8000 });
          if (setting.data?.autoTeach) {
            const ask = event.messageReply.body?.toLowerCase().trim();
            const ans = raw.trim();
            if (ask && ans && ask !== ans) {
              setTimeout(async () => {
                try {
                  await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 10000 });
                } catch {}
              }, 500);
            }
          }
        } catch {}
      }

    } catch (err) {
      console.error("onChat error:", err.message);
    }
  }
};
