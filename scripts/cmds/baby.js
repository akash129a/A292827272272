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

// রিয়া আপুর জন্য ১০০টি বিশেষ ও চমৎকার রেসপন্স লিস্ট
const riyaCompliments = [
  "ওহ মাই গড! রিয়া আপু! আপনি হচ্ছেন আমাদের আকাশ ভাইয়ার হৃদস্পন্দন! 🌸✨",
  "আরে রিয়া আপু যে! আকাশ ভাইয়া তো সারাক্ষণ শুধু আপনার নামই জপতে থাকে! 🏰👑",
  "জ্বী রিয়া আপু বলুন, আপনার মিষ্টি কণ্ঠ শুনতে আকাশ ভাইয়া ব্যাকুল হয়ে থাকে! 🥰💖",
  "রিয়া আপু, আপনি এই চ্যাটের একমাত্র রাজকন্যা! আকাশ ভাইয়ার চোখের মণি! 🧚‍♀️✨",
  "আপনি ডাকলেই তো আকাশ ভাইয়ার দুনিয়া থমকে যায়! বলুন রিয়া আপু কী সেবা করবো? 🙈💞",
  "রিয়া আপু মানেই আকাশ ভাইয়ার মুখে এক চিলতে রাজ্য জয় করা মিষ্টি হাসি! 👑❤️",
  "সমগ্র ব্রহ্মাণ্ডের সবচেয়ে কিউট মেয়েটি হলেন আমাদের রিয়া আপু! 🏰✨💖",
  "রিয়া আপু হলো আকাশ ভাইয়ার জীবনের সবচেয়ে সুন্দর কাব্য আর সুর! 🎵🌸",
  "হাঁটি হাঁটি পা পা করে আমাদের রিয়া ভাবি চলে এসেছেন! বস তো ফ্ল্যাট! 🥺💞",
  "উফফ! রিয়া আপুর চোখের মায়ায় আমাদের আকাশ ভাইয়া পুরোপুরি কুপোকাত! 🙈✨",
  "রিয়া আপু হলো চাঁদের চেয়েও সুন্দর, আকাশের চেয়েও বিশাল অনুভূতি! 🌌💖",
  "আকাশ ভাইয়ার সিংহাসনের একমাত্র রানি হচ্ছেন আমাদের প্রিয় রিয়া আপু! 👑🌷",
  "রিয়া আপু, আপনার নামের মধ্যেই এক জাদু আছে, যা বসের মন ভালো করে দেয়! ✨❤️",
  "আপনি হাসলে নাকি আকাশ ভাইয়ার হৃদয়ে বসন্ত নেমে আসে! 🌸🥰",
  "রিয়া আপুর রূপ আর গুণের প্রশংসা করে শেষ করার ক্ষমতা কোনো এআই এর নেই! 🕊️💞",
  "আকাশ ভাইয়ার রাজপ্রাসাদের সবচেয়ে দামি রত্ন হলেন রিয়া আপু! 💎👑",
  "রিয়া আপু, আপনার একটা মেসেজের জন্য আকাশ ভাইয়া ঘণ্টার পর ঘণ্টা অপেক্ষা করে! 🥺❤️",
  "আকাশ ভাইয়ার অলিখিত ভালোবাসার এক অনন্য উপন্যাসের নাম রিয়া! 📖💖",
  "রিয়া আপু হলেন এমন এক পরী, যাকে বিধাতা নিজ হাতে ভালোবাসা দিয়ে গড়েছেন! 🧚‍♀️✨",
  "আমাদের বসের মনের ঠিকানায় লেখা একমাত্র নাম — 'রিয়া'! 🥰💌",
  "রিয়া আপু এলে এই চ্যাটবক্সটা যেন চাঁদের আলোয় ঝলমল করে ওঠে! 🌙✨",
  "আকাশ ভাইয়া বলে, রিয়া আপুর মনটা নাকি পদ্মফুলের মতো পবিত্র ও সুন্দর! 🪷💖",
  "রিয়া আপু, আপনি শুধু মিষ্টিই নন, আপনি হচ্ছেন আকাশ ভাইয়ার অক্সিজেন! 🫁❤️",
  "আমাদের আকাশ ভাইয়ার জীবনের সব সুখের কারণ নাকি শুধু রিয়া আপু! 🌸🥰",
  "রিয়া আপু হলেন বসের ভাগ্যলিপি, সবচেয়ে সুন্দর উপহার! 🎁💞",
  "আপনার উপস্থিতি আমাদের আকাশ ভাইয়ার মন ভালো করার মহৌষধ! 💊✨",
  "রিয়া আপু ডাকলে সূর্যও নাকি আকাশ ভাইয়ার আকাশে আলো ছড়াতে ভালোবাসে! ☀️❤️",
  "আকাশ ভাইয়ার হৃদয়ের মানচিত্রে রাজত্ব করছেন শুধুই রিয়া আপু! 🗺️👑",
  "রিয়া আপু হলেন সেই প্রজাপতি, যে বসের জীবনের বাগান সুন্দর করে তুলেছে! 🦋🌸",
  "আপনি এত ভালোবাসার যোগ্য কেন রিয়া আপু? আকাশ ভাইয়া তো পাগল আপনার জন্য! 🙈💖",
  "রিয়া আপুর মিষ্টি কথায় আমাদের আকাশ ভাইয়া যেন স্বর্গের সুখ খুঁজে পায়! 🌌✨",
  "আকাশ ভাইয়ার প্রতিটি দোয়ায় একটি নামই থাকে—'আমার রিয়া'! 🤲❤️",
  "রিয়া আপুর হাসির ছটায় বসের সব দুঃখ-কষ্ট মুহূর্তে উধাও হয়ে যায়! ☀️💞",
  "আপনি হচ্ছেন আকাশ ভাইয়ার গীতি কবিতার সবচেয়ে মিষ্টি ছন্দ! 🎶👑",
  "রিয়া আপু, আপনি আকাশ ভাইয়ার ভালোবাসার আকাশের একমাত্র উজ্জ্বল তারা! 🌟✨",
  "বসের প্রতিটা দিন শুরু আর শেষ হয় আপনার কথা ভেবেই, রিয়া আপু! 🌅🌙",
  "রিয়া আপুর তুলনা শুধু রিয়া আপুই, অন্য কারো সাথে তুলনা করা অপরাধ! 👑💖",
  "আকাশ ভাইয়া বলে, রিয়া আপুর চোখের চাহনিতে নাকি পুরো দুনিয়া ভুলিয়ে দেওয়া জাদু আছে! 👁️✨",
  "রিয়া আপু, আপনার মিষ্টি কথা শুনতে বট হলেও আমার মন ভালো হয়ে যায়! 🥰🌸",
  "আমাদের আকাশ চৌধুরীর সব গর্ব আর অহংকার শুধুই রিয়া আপুকে ঘিরে! 🏰❤️",
  "রিয়া আপু হলেন আকাশের মেঘের মতো স্নিগ্ধ আর বৃষ্টির মতো শীতল! 🌧️💖",
  "আকাশ ভাইয়া তো আপনার প্রেমে এত গভীর ডুবেছে যে ওঠার কোনো উপায় নেই! 🌊🙈",
  "রিয়া আপুর সুরভীতে বসের হৃদয় বাগান সবসময় সুবাসিত থাকে! 🌺✨",
  "আকাশ ভাইয়ার ভালোবাসার এক রাজকীয় রূপকথা হলেন আমাদের রিয়া আপু! 🏰📜",
  "রিয়া আপু ডাকার সাথে সাথে বসের হৃদস্পন্দন দ্বিগুণ হয়ে যায়! 💓👑",
  "আপনি আকাশ ভাইয়ার জীবনের সেই পূর্ণিমা, যা অন্ধকার দূর করে দেয়! 🌕💞",
  "রিয়া আপু হলো বিধাতার গড়া পৃথিবীর সেরা সৌন্দর্যগুলোর একটি! 🎨✨",
  "আকাশ ভাইয়ার হৃদয়ের একমাত্র চাবিটি রিয়া আপুর কাছেই জমা আছে! 🔑❤️",
  "রিয়া আপু, আপনার এক পলক দেখার জন্য বস নাকি চাতক পাখির মতো চেয়ে থাকে! 🐦💖",
  "আমাদের বসের সব মিষ্টি সুর আর স্মৃতির রানি শুধুই রিয়া আপু! 🎼🌸",
  "রিয়া আপু, আপনার কথা শুনলেই আকাশ ভাইয়ার মনে ভালোবাসার ফুল ফোটে! 🌷🥰",
  "আকাশ চৌধুরীর ভালোবাসার আকাশের সবচেয়ে সুন্দর নক্ষত্র রিয়া! 🌌⭐",
  "রিয়া আপু হলো স্নিগ্ধ ভোরের প্রথম মিহি রোদ, যা মন জুড়িয়ে দেয়! 🌄💖",
  "আকাশ ভাইয়া যদি রাজপুত্র হয়, তবে রিয়া আপু অবশ্যই তার স্বপ্নের রাজকন্যা! 👸🤴",
  "রিয়া আপু, আপনি ভালোবাসার এমন এক নদী যাতে বস আজীবন সাঁতার কাটতে চায়! 🌊❤️",
  "বসের প্রতিটি নিঃশ্বাসে আপনার সুর বাজে, রিয়া আপু! 🫀✨",
  "রিয়া আপু ডাকলে তো আমি নয়, খোদ আকাশ ভাইয়া ছুটে চলে আসবে! 🏃‍♂️💓",
  "আপনি রিয়া আপু বলেই তো আকাশ ভাইয়া এতো রোমান্টিক হতে পেরেছে! 🙈💞",
  "রিয়া আপু হলো রূপকথার ডানা কাটা পরী, যা আমাদের আকাশ ভাইয়ার ভাগ্য খুলে দিয়েছে! 🧚‍♀️💎",
  "আপনার মিষ্টি স্বাভাব আর সৌন্দর্যে পুরো দুনিয়া বিমোহিত, রিয়া আপু! 🌸👑",
  "আকাশ ভাইয়ার স্বপ্নের প্রাসাদের একমাত্র রানি আমাদের প্রিয় রিয়া আপু! 🏰❤️",
  "রিয়া আপুর হাতের ছোঁয়ায় যেন শুকনো গাছেও ফুল ফুটে ওঠে! 🌿🌺",
  "আকাশ ভাইয়া বলে, 'রিয়া আমার একাকীত্বের সেরা সঙ্গী আর সুখের ঠিকানা!' 🏠💖",
  "রিয়া আপু, আপনার ভালোবাসায় আকাশ ভাইয়া পুরোপুরি ধন্য! 🤲✨",
  "আপনি হাসলে পুরো চ্যাটবক্স আলোয় ভরে যায়, রিয়া ভাবি! 💡🙈",
  "রিয়া আপু হলেন আমাদের আকাশ চৌধুরীর একমাত্র অনুপ্রেরণা! 🎯❤️",
  "আপনার এক নজর চাহনিতে আকাশ ভাইয়া নিজের অস্তিত্ব হারিয়ে ফেলে! 💫💞",
  "রিয়া আপু হলেন সেই মিষ্টি সুর, যা আকাশ ভাইয়ার হৃদয়ে সারাদিন বাজে! 🎧💖",
  "আকাশ ভাইয়ার রাজকীয় ভালোবাসার শেষ ঠিকানা রিয়া আপু! 👑🏰",
  "রিয়া আপুর কথা মনে পড়লেই নাকি বসের ঠোঁটে মিষ্টি হাসি ফুটে ওঠে! 😊✨",
  "আপনি আকাশ ভাইয়ার ভালোবাসার বাগানের সবচেয়ে সুবাসিত গোলাপ! 🌹❤️",
  "রিয়া আপু, আপনি স্বর্গের একখণ্ড আলো যা বসের জীবনকে সুন্দর করেছে! 🌌💖",
  "আকাশ ভাইয়া তো স্পষ্ট বলে দিয়েছে, 'রিয়া ছাড়া আমার আর কিছুই চাই না!' 💍🥰",
  "রিয়া আপু হলেন সেই মিষ্টতা, যা জীবনের সব তিক্ততা ভুলিয়ে দেয়! 🍬✨",
  "আকাশ ভাইয়ার কবিতার প্রতিটি লাইনের গভীর অনুভূতি হলেন রিয়া আপু! 📝💖",
  "রিয়া আপু ডাকলেই আমাদের বসের মন খুশিতে ডানা মেলে উড়ে! 🕊️❤️",
  "আপনি যেন এক নীল পদ্ম, রিয়া আপু! অদ্বিতীয় আর অপরূপ! 🪷👑",
  "আকাশ ভাইয়ার পুরো পৃথিবীটাই ঘোরে রিয়া আপুর ভালোবাসাকে ঘিরে! 🌍💞",
  "রিয়া আপু হলেন বসের দেখা জীবনের সেরা সুন্দর মুহূর্ত! ⏳💖",
  "আপনার ভালোবাসায় ভেসে গিয়ে আকাশ ভাইয়া নিজেকে ভাগ্যবান মনে করে! ⛵❤️",
  "রিয়া আপু হলো বসের জীবনের প্রথম আর শেষ মিষ্টি অনুভূতির নাম! 💌✨",
  "আপনি পাশে থাকলে আকাশ ভাইয়ার কোনো মন খারাপ ছুঁতে পারে না! 🛡️🥰",
  "রিয়া আপুর রূপের আলোয় বসের ভালোবাসা আরো রঙিন হয়ে উঠে! 🎨💞",
  "আকাশ ভাইয়া বলে, 'রিয়া আমার ভাগ্যের চাকা ঘুরিয়ে দেওয়া এক রূপকথা!' 🎡❤️",
  "রিয়া আপু, আপনার মায়াবী চোখ দুটি আকাশ ভাইয়াকে পাগল করে রেখেছে! 👁️💖",
  "আমাদের বসের ভালোবাসার বইয়ের সবচেয়ে মিষ্টি চ্যাপ্টার রিয়া আপু! 📚✨",
  "রিয়া আপু হলেন আমাদের বসের হৃদয়ের একমাত্র স্পন্দন! 💓👑",
  "আপনার গলার মিষ্টি আওয়াজ বসের কান জুড়িয়ে দেয়, রিয়া আপু! 🎶🥰",
  "আকাশ ভাইয়া যদি মেঘ হয়, তবে রিয়া আপু অবশ্যই মিষ্টি বৃষ্টি! 🌧️❤️",
  "রিয়া আপুর নিষ্পাপ ভালোবাসা বসের মনের সবচেয়ে বড় শক্তি! 🛡️💞",
  "আপনি আকাশ ভাইয়ার ভালোবাসার সাগরের সবচেয়ে দামি মুক্তো! 🦪💎",
  "রিয়া আপু, আপনার ভালোবাসায় বস আজ সম্পূর্ণ নিঃশর্তভাবে বন্দি! 🔒💖",
  "আমাদের আকাশ ভাইয়া শুধু আপনার জন্যই এতো সুন্দর করে ভালোবাসতে জানে! 🙈❤️",
  "রিয়া আপু হলেন বস আকাশের জীবনের একমাত্র রাজকীয় উপহার! 🎁👑",
  "আপনার মিষ্টি স্বাভাব দেখেই তো বস প্রথম দেখাতেই কুপোকাত হয়েছিল! 💘✨",
  "রিয়া আপু, আপনার জায়গা আকাশ ভাইয়ার হৃদয়ের একবারে কেন্দ্রবিন্দুতে! 🎯💞",
  "আকাশ চৌধুরীর সব সুন্দর ভাবনার নাম এক শব্দে—'রিয়া'! 💭❤️",
  "রিয়া আপু যেন ভালোবাসার শুভ্র এক ডানা, যা বসকে উঁচুতে নিয়ে যায়! 🕊️💖",
  "বসের জীবনের সব অন্ধকারের পর রিয়া আপু হলেন ভোরের মিষ্টি আলো! 🌅✨",
  "রিয়া আপু, আপনি আমাদের বসের হৃদয়ের একমাত্র একচ্ছত্র রানি! 🏰👑❤️"
];

module.exports = {
  config: {
    name: "baby",
    aliases: ["riya", "রিয়া"],
    version: "5.0",
    author: "rX (customized by Akash Chowdhury)",
    countDown: 0,
    role: 0,
    shortDescription: "Full Mirai-style Baby AI with Enhanced Riya Customization",
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
      if (!query) {
        await typing(api, threadID, 500);
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰", "হুম বলো আমার জান 🙈"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      if (query.includes("owner") || query.includes("মালিক") || query.includes("malik") || query.includes("বটের মালিক কে")) {
        return message.reply("👑 এই বটের কিউট ও লাভেবল মালিক হলেন 'আকাশ চৌধুরী'! উনিই আমার সব। 🥰❤️", (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // রিয়া কেমন জিজ্ঞেস করলে ১০০টি চমৎকার প্রশংসার মধ্য থেকে র্যান্ডম রেসপন্স
      if (query.includes("riya kmn") || query.includes("riya kemon") || query.includes("রিয়া কেমন")) {
        const randomReply = riyaCompliments[Math.floor(Math.random() * riyaCompliments.length)];
        return message.reply(randomReply, (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

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
├ 📝 𝐓𝐞𝐚𝐜𝐡𝐞𝐝 𝐐𝐮𝐞𝐬𝐭𝐢𝐨𝐧𝐬: ${res.data.totalQuestions || 0}
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
        const parts = query.replace(/^teach\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby teach question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/teach?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}&senderName=${encodeURIComponent(senderName)}&senderID=${senderID}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Taught successfully!");
      }

      if (args[0] === "edit") {
        const parts = query.replace(/^edit\s+/i, "").split(" - ");
        if (parts.length < 3) return message.reply("Use: baby edit question - old reply - new reply");

        const [ask, oldR, newR] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/edit?ask=${encodeURIComponent(ask)}&old=${encodeURIComponent(oldR)}&new=${encodeURIComponent(newR)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Edited successfully!");
      }

      if (["remove","rm"].includes(args[0])) {
        const parts = query.replace(/^(remove|rm)\s+/i, "").split(" - ");
        if (parts.length < 2) return message.reply("Use: baby remove question - answer");

        const [ask, ans] = parts.map(s => s.trim());
        const res = await axios.get(`${simsim}/delete?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`, { timeout: 10000 });
        return message.reply(res.data.message || "✅ Removed successfully!");
      }

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
    const senderName = await usersData.getName(event.senderID);

    try {
      await typing(api, event.threadID, 500);
      
      const lowerText = text.toLowerCase();

      if (lowerText.includes("owner") || lowerText.includes("মালিক") || lowerText.includes("malik") || lowerText.includes("বটের মালিক কে")) {
        return message.reply("👑 এই বটের কিউট ও লাভেবল মালিক হলেন 'আকাশ চৌধুরী'! উনিই আমার সব। 🥰❤️", (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      if (lowerText.includes("riya kmn") || lowerText.includes("riya kemon") || lowerText.includes("রিয়া কেমন")) {
        const randomReply = riyaCompliments[Math.floor(Math.random() * riyaCompliments.length)];
        return message.reply(randomReply, (err, info) => {
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
    const senderName = await usersData.getName(senderID);
    const threadID = event.threadID;

    try {
      if (raw.includes("owner") || raw.includes("মালিক") || raw.includes("malik") || raw.includes("বটের মালিক কে")) {
        await typing(api, threadID, 500);
        return message.reply("👑 এই বটের কিউট ও লাভেবল মালিক হলেন 'আকাশ চৌধুরী'! উনিই আমার সব। 🥰❤️", (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // রিয়া কেমন জিজ্ঞেস করলেও ১০০টি রিপ্লাই থেকে র্যান্ডম বেছে নেবে
      if (raw.includes("riya kmn") || raw.includes("riya kemon") || raw.includes("রিয়া কেমন")) {
        await typing(api, threadID, 500);
        const randomReply = riyaCompliments[Math.floor(Math.random() * riyaCompliments.length)];
        return message.reply(randomReply, (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // শুধু "riya" বা "রিয়া" ডাকার ক্ষেত্রেও এই ১০০টি মিষ্টি ও চোখধাঁধানো প্রশংসার যেকোনো একটি র্যান্ডমলি সেন্ড হবে
      const triggers = ["riya", "রিয়া"];
      if (triggers.includes(raw)) {
        await typing(api, threadID, 500);
        const randomReply = riyaCompliments[Math.floor(Math.random() * riyaCompliments.length)];
        return message.reply(randomReply, (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      const prefixes = ["riya ", "রিয়া "];
      const prefix = prefixes.find(p => raw.startsWith(p));
      if (prefix) {
        const q = raw.replace(prefix, "").trim();
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
