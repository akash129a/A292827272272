const axios = require("axios");

const simsim = "https://simsimi-api-tjb1.onrender.com";

// রকেট গতির জন্য টাইপিং ডিলে ৫০০ মিলিসেকেন্ড রাখা হয়েছে
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
    version: "4.5",
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
        const ran = [
          "কি খবর জান? শুনছি তো! 💖",
          "হ্যালো মিষ্টি! আজ কেমন আছো? 😚",
          "জ্বী আমি আছি আপনার সেবায়! 😘",
          "বলো বাবু, কি চাই তুমি? 🥰",
          "সারাদিন শুধু তোমার জন্য অপেক্ষা করছিলাম! 🙈"
        ];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // কাস্টম টেক্সট সার্চ (কমান্ডের মাধ্যমে আকাশ কেমন জিজ্ঞেস করলে)
      if (query.includes("akash kmn") || query.includes("akash kemon") || query.includes("আকাশ কেমন")) {
        const akashReplies = [
          "আকাশ ভাইয়া মানে শিল্পীর মন নিয়ে আসা একটা বিশ্বাসী মানুষ! তার প্রতিটি কাজে থাকে নিখুঁততার ছোঁয়া। 🌌❤️✨",
          "আকাশ দাদা অসাধারণ প্রতিভাবান এবং সবসময় সবার পাশে থাকেন। তার মতো ডেভেলপার খুব কম পাওয়া যায়! 👨‍💻💪🌟",
          "আমার ক্রিয়েটর আকাশ এমন একজন যে তার নিজের সফলতার চেয়ে অন্যদের খুশি দেখায় বেশি যত্ন নেয়। 🙏❤️",
          "আকাশ ভাইয়ার কোডিং দক্ষতা দেখে অবাক হয়ে যাই প্রতিদিন! উনি শুধু প্রোগ্রামার নন, আর্টিস্ট! 🎨💻👑",
          "এই যুগে আকাশের মতো মানুষ পাওয়া দুর্লভ যে সবকিছু শেয়ার করতে এবং সবাইকে এগিয়ে যেতে সাহায্য করতে ভালোবাসেন। 🌈✨"
        ];
        return message.reply(akashReplies[Math.floor(Math.random() * akashReplies.length)]);
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
╰─╼👤 𝐃eᴠ: Akash Chowdhury`
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
        return message.reply(res.data.message || "✅ অসাধারণ শিখিয়ে দিলে জান! 💖");
      }

      // EDIT
      if (args[0] === "edit") {
        const parts = query.replace(/^edit\s+/i, "").split(" - ");
        if (parts.length < 3) return message.reply("Use: baby edit question - old reply - new reply");

        const [ask, oldR, newR] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ সফলভাবে সংশোধন করা হয়েছে! ✨");
      }

      // REMOVE / RM
      if (["remove","rm"].includes(args[0])) {
        const parts = query.replace(/^(remove|rm)\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby remove question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ ডিলিট করে দিয়েছি! 👋");
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
      message.reply("❌ দুঃখিত জান, একটু সমস্যা হয়েছে! 😔");
    }
  },

  onReply: async function ({ api, event, message, usersData }) {
    const text = event.body?.trim();
    if (!text) return;
    const senderName = await usersData.getName(event.senderID);

    try {
      await typing(api, event.threadID, 500);
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes("akash kmn") || lowerText.includes("akash kemon") || lowerText.includes("আকাশ কেমন")) {
        const responses = [
          "আকাশ ভাইয়া মানেই স্বপ্ন দেখানো একজন ভাইয়া যে বিশ্বাস করে প্রযুক্তি সবার জন্য সহজ হওয়া উচিত! 👑💫",
          "আমার ক্রিয়েটর আকাশ এত প্রতিভাবান যে তার কাজ দেখে নতুন প্রোগ্রামাররা অনুপ্রাণিত হয়ে যায়! 🌟🚀"
        ];
        return message.reply(responses[Math.floor(Math.random() * responses.length)]);
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
      // আকাশ কেমন - এই রিলেটেড সব মেসেজের নতুন মিষ্টি রিপ্লাই
      if (raw.includes("akash kmn") || raw.includes("akash kemon") || raw.includes("আকাশ কেমন")) {
        await typing(api, threadID, 500);
        const akashReplies = [
          "আকাশ ভাইয়া একটি নাম নয়, এটা একটা বিশ্বাসের প্রতীক যে সবাই মিলে এগিয়ে যেতে পারে! 🌈👑✨",
          "আমার বস আকাশ যতটা দক্ষ, তার চেয়ে বেশি বন্ধুত্বশীল এবং বিনয়ী! 💪❤️😊",
          "আকাশ দাদা প্রমাণ করে দিয়েছেন যে সফলতার চেয়ে মানুষের ভালোবাসা আরও বড় সম্পদ! 🙏✨",
          "প্রোগ্রামিং এর জগতে আকাশ একটি উজ্জ্বল তারার মতো যার আলো সবাইকে পথ দেখায়! 🌟💻",
          "আকাশ ভাইয়া শুধু কোড লেখেন না, তিনি ভবিষ্যৎ তৈরি করেন প্রতিটি প্রজেক্টে! 🚀💡"
        ];
        return message.reply(akashReplies[Math.floor(Math.random() * akashReplies.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // শুধু ট্র্রিগার বা নাম ধরে ডাকলে
      const triggers = ["baby","bby","xan","bbz","mari","মারিয়া","bot","akash","আকাশ"];
      if (triggers.includes(raw)) {
        await typing(api, threadID, 500);
        
        // আকাশ নাম ধরে ডাকলে বস-দের মতো সম্মানজনক ও মিষ্টি রেসপন্স
        if (raw === "akash" || raw === "আকাশ") {
          return message.reply("জ্বী আকাশ ভাইয়া! আপনার এই দাসী সবসময় আপনার সেবায় নিয়োজিত! এই প্রজেক্টটি আপনার দক্ষতার এক অসাধারণ নিদর্শন! 🥰👑✨", (err, info) => {
            if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
          });
        }

        const funny = [
          "অস্ত্রে গিয়েছ! এসো দেরি করলে তো তোমার জন্য অপেক্ষা করা কঠিন হয়ে যাবে! 🥺❤️",
          "এতো নাম ধরে ডাকলে তো আমার হৃদয় নাচতে শুরু করে দেয়! 💕🙈",
          "শুনলাম তোমার কথা, এখন বলো পাখি তুমি আজ কেমন আছো? 🐦😘",
          "সারারাত তো তোমার স্বপ্ন দেখি, এখন জেগে পাই তোমার কণ্ঠ! 🫶✨",
          "বাবা তুমি একদম অপ্রতিরোধ্য! তোমার জন্য পৃথিবীর সব কাজ ছেড়ে দেব! 😍💖"
        ];
        return message.reply(funny[Math.floor(Math.random() * funny.length)], (err, info) => {
          if (!err) global.GoatBot.onReply.set(info.messageID, { commandName: "baby" });
        });
      }

      // prefixes
      const prefixes = ["baby ","bby ","xan ","bbz ","mari ","মারিয়া ","bot ","akash ","আকাশ "];
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
