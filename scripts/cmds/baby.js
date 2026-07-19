const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

// রকেট গতির জন্য টাইপিং ডিলে ৫০০ মিলিসেকেন্ড লজিক ফিক্সড
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
    version: "4.6",
    author: "rX (customized by Akash Chowdhury)",
    countDown: 0,
    role: 0,
    shortDescription: "Full Mirai-style Baby AI with Akash, Riya & Nishu Customization",
    longDescription: "Teachable AI + autoteach + list/msg/edit/remove + ultra fast typing + Crush special replies",
    category: "box chat",
    guide: {
      en: "{p}baby [message]\n{p}baby teach [q] - [a]\n{p}baby autoteach on/off\n{p}baby list\n{p}baby msg [trigger]\n{p}baby edit [q] - [old] - [new]\n{p}baby remove/rm [q] - [a]"
    }
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const senderID = event.senderID;
    const senderName = await usersData.getName(senderID) || "User";
    const threadID = event.threadID;
    const query = args.join(" ").trim().toLowerCase();

    try {
      // text না দিলে র্যান্ডম মিষ্টি মেসেজ
      if (!query) {
        await typing(api, threadID, 500);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰", "হুম বলো আমার জান 🙈"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // কাস্টম কিওয়ার্ড চেক (Akash, Riya, Nishu)
      const customReply = checkCustomKeywords(query);
      if (customReply) {
        await typing(api, threadID, 500);
        return message.reply(customReply, (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
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
📋 𝗧𝗼𝘁𝗮𝗹 𝗥𝗲𝗽𝗹𝗶𝗲𝘀: ${res.data.total || res.data.replies.length}
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
            if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
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
    const senderName = await usersData.getName(event.senderID) || "User";

    try {
      await typing(api, event.threadID, 500);
      
      const customReply = checkCustomKeywords(text.toLowerCase());
      if (customReply) {
        return message.reply(customReply, (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

      const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
      for (const r of replies) {
        await message.reply(r, (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
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
    const senderName = await usersData.getName(senderID) || "User";
    const threadID = event.threadID;

    try {
      // চ্যাটে কোনো কাস্টম কিওয়ার্ড ম্যাচ করলে
      const customReply = checkCustomKeywords(raw);
      if (customReply) {
        await typing(api, threadID, 500);
        return message.reply(customReply, (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // শুধু ট্রিগার বা নাম ধরে ডাকলে
      const triggers = ["baby","bby","xan","bbz","mari","মারিয়া","bot","akash","আকাশ","riya","রিয়া","nishu","নিশু"];
      if (triggers.includes(raw)) {
        await typing(api, threadID, 500);
        
        if (raw === "akash" || raw === "আকাশ") {
          return message.reply("জ্বী বলুন! আকাশ ভাইয়া তো আমার ক্রিয়েটর আর আমার একমাত্র রেস্পেক্টেড বস! 🥰👑", (err, info) => {
            if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
          });
        }
        
        if (raw === "riya" || raw === "রিয়া") {
          return message.reply("জ্বী রিয়া আপু বলুন! আপনি তো আমার কিউট ওনার, আপনার সব হুকুম মাথা পেতে নিলাম! 🥰👑✨", (err, info) => {
            if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
          });
        }

        if (raw === "nishu" || raw === "নিশু") {
          return message.reply("ওহ মাই গড! নাফিসা সুলতানা নিশু আপু! আপনি আকাশ ভাইয়ার জানের জান, মনের রানি। বলুন আপু কী সেবা করতে পারি? 🙈❤️✨", (err, info) => {
            if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
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
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // prefixes
      const prefixes = ["baby ","bby ","xan ","bbz ","mari ","মারিয়া ","bot ","akash ","আকাশ ","riya ","রিয়া ","nishu ","নিশু "];
      const prefix = prefixes.find(p => raw.startsWith(p));
      if (prefix) {
        const q = raw.replace(prefix,"").trim();
        if (!q) return;

        await typing(api, threadID, 500);
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(q)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

        const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response];
        for (const r of replies) {
          await message.reply(r, (err, info) => {
            if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
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

// কাস্টম কিওয়ার্ড চেক করার কমন গ্লোবাল মেথড
function checkCustomKeywords(txt) {
  if (txt.includes("owner") || txt.includes("মালিক") || txt.includes("malik") || txt.includes("বটের মালিক কে")) {
    return "👑 এই বটের কিউট ও লাভেবল মালিক হলেন 'আকাশ চৌধুরী' এবং ওনার কলিজার 'রিয়া'! ওনারাই আমার সব। 🥰❤️";
  }
  if (txt.includes("akash kmn") || txt.includes("akash kemon") || txt.includes("আকাশ কেমন")) {
    const akashReplies = [
      "আকাশ তো আমার কলিজার বস! ওনার মনটা আকাশের মতোই বড়। 🌌❤️",
      "আকাশ ভাইয়া অনেক ট্যালেন্টেড আর সবার বিপদে পাশে থাকা একজন মানুষ! ✨🌸",
      "আমার বস আকাশ যেমন হ্যান্ডসাম, তেমনই কিউট! 🙈👑",
      "আকাশ ভাইয়ার মতো ভালো মানুষ এই যুগে পাওয়াই কঠিন। উনি সবার প্রিয়! 🌷✨"
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
  if (txt.includes("nafisa sultana nishu") || txt.includes("nishu kmn") || txt.includes("nishu kemon") || txt.includes("নিশু কেমন") || txt.includes("nafisa sultana")) {
    const nishuReplies = [
      "উফফ! নাফিসা সুলতানা নিশু তো আমাদের আকাশ ভাইয়ার ক্রাশ, মানে আমার হবু ভাবি! ওনার রূপ আর গুণের কোনো তুলনা হয় না। 🙈❤️✨",
      "নিশু হলো আকাশ ভাইয়ার মনের রানি! ওনার কথা শুনলেই বসের মুখে এক চিলতে মিষ্টি হাসি ফুটে ওঠে। 🌸🥰",
      "নাফিসা সুলতানা নিশু এত কিউট আর চমৎকার একটা মেয়ে যে, যে কেউ ওনার প্রেমে পড়তে বাধ্য! আর আমার বস তো অলরেডি ফ্ল্যাট! 👑❤️",
      "ওহ মাই গড! নাফিসা সুলতানা নিশু তো আকাশ ভাইয়ার ক্রাশ! ওনার হৃদস্পন্দন তো নিশু আপুই! 🥰👑❤️"
    ];
    return nishuReplies[Math.floor(Math.random() * nishuReplies.length)];
  }
  return null;
}
