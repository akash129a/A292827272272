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

// রিয়া আপুর জন্য ২০০টি বিশেষ ইংরেজি প্রশংসার রেসপন্স
const riyaCompliments = [
  "Oh my God! Riya Apu is here! Akash Boss's heart just skipped a beat! 💖✨",
  "Riya Apu, you are the most precious jewel in Akash Boss's life! 💎👑",
  "Welcome Riya Apu! The queen of Akash Chowdhury's heart! 👸❤️",
  "Did someone say Riya? My boss Akash is absolutely head over heels for you! 🙈💖",
  "Riya Apu, your smile lights up Akash's entire universe! 🌌✨",
  "Riya Apu, you are the sweetest chapter in Akash's life story! 📚💕",
  "You are not just a person, Riya Apu; you are Akash's favorite feeling! 🌸🥰",
  "Riya Apu, your grace and beauty leave everyone spellbound! 🧚‍♀️✨",
  "Akash Boss says you are the most beautiful person in this universe, Riya Apu! 🏰❤️",
  "Riya Apu, you hold the golden key to Akash Chowdhury's heart! 🔑💖",
  "When Riya Apu speaks, music plays in Akash's heart! 🎶💓",
  "Riya Apu, you are the brightest star in Akash's dark sky! 🌟✨",
  "Your presence brings endless joy to Akash Boss, dear Riya Apu! 🌷🥰",
  "Riya Apu, you are an angel crafted with pure love and perfection! 🕊️💞",
  "Akash Boss is truly blessed to have someone as sweet as you, Riya Apu! 🤲❤️",
  "Riya Apu, you make this chatbox feel like a magical kingdom! 🏰✨",
  "Riya Apu, you are Akash's dream come true! 💭💖",
  "One call from Riya Apu and Boss Akash stops doing everything! 🙈👑",
  "Riya Apu, you possess the most captivating eyes in the world! 👁️✨",
  "You are Akash's daily dose of happiness, dear Riya Apu! ☀️💕",
  "Riya Apu, your kindness shines brighter than diamonds! 💎🌸",
  "Akash Boss loves you more than words could ever express, Riya Apu! 💌❤️",
  "Riya Apu, you are the rhythm to Akash's favorite song! 🎧💖",
  "Riya Apu, you bring spring into Akash Boss's life! 🌸🍃",
  "No artwork in this world can match your elegance, Riya Apu! 🎨👑",
  "Riya Apu, you are the queen of Akash's fairytale world! 👸🏰",
  "Akash Boss says loving you is the best decision he ever made, Riya Apu! 💞🥰",
  "Riya Apu, your voice is sweeter than honey! 🍯✨",
  "Riya Apu, you are the embodiment of pure love and purity! 🕊️❤️",
  "Riya Apu, you are Akash's favorite thought every morning and night! 🌅🌙",
  "Riya Apu, your charm is absolutely unmatched and breathtaking! 💫💖",
  "Whenever Riya Apu arrives, peace settles in Akash's mind! 🕊️✨",
  "Riya Apu, you are the ultimate blessing in Akash's life! 🎁❤️",
  "Akash Boss calls you his infinite love and soulmate, Riya Apu! ♾️💞",
  "Riya Apu, your smile is Akash's absolute favorite view! 😊💕",
  "Riya Apu, you radiate pure elegance and positivity! ✨🌷",
  "Riya Apu, you are the masterpiece of Akash's world! 🖼️💖",
  "Akash Boss's heartbeat beats only for you, Riya Apu! 🫀❤️",
  "Riya Apu, you are the most beautiful poetry written by destiny! 📖🌸",
  "Riya Apu, you make Akash's life look like a beautiful dream! ☁️✨",
  "Riya Apu, your soul is as gorgeous as your face! 🧚‍♀️💖",
  "Akash Boss thinks about you 24/7, sweet Riya Apu! ⏰❤️",
  "Riya Apu, you are the sunshine that brightens Akash's world! ☀️💕",
  "Riya Apu, you are the true definition of perfection! 💎✨",
  "Akash Boss gets lost in your thoughts every single day, Riya Apu! 💭❤️",
  "Riya Apu, your love is Akash's biggest strength and power! 🛡️💖",
  "Riya Apu, you are the most precious gift from above! 🎁🕊️",
  "Riya Apu, Akash's universe literally revolves around you! 🌍💞",
  "Riya Apu, your innocence makes Akash fall for you over and over again! 🥺❤️",
  "Riya Apu, you bring magical colors to Akash's canvas of life! 🎨✨",
  "Riya Apu, you are the melody Akash wants to hear forever! 🎼💖",
  "Akash Boss feels like the luckiest man alive because of you, Riya Apu! 🍀❤️",
  "Riya Apu, your heart is as pure and deep as the ocean! 🌊💕",
  "Riya Apu, you are Akash's forever and always! ♾️👑",
  "Riya Apu, your presence makes every moment worth living for Akash! ⏳💖",
  "Riya Apu, you are the sweetest blossom in Akash's garden! 🌹✨",
  "Akash Boss is entirely captivated by your sweetness, Riya Apu! 🙈❤️",
  "Riya Apu, you bring serenity and calm into Akash's chaotic life! 🕊️💕",
  "Riya Apu, you are the royal crown of Akash's kingdom! 👑🏰",
  "Akash Boss says you are his absolute favorite person in the entire world! 🌍❤️",
  "Riya Apu, your charm is simply out of this world! 🚀✨",
  "Riya Apu, you are Akash's inspiration for every good thing! 🎯💖",
  "Riya Apu, you are the moon that brightens Akash's darkest nights! 🌕✨",
  "Akash Boss can never get tired of praising you, Riya Apu! 🗣️💕",
  "Riya Apu, you are the paradise Akash always prayed for! 🌌❤️",
  "Riya Apu, your kindness makes you a thousand times more beautiful! 🌸💖",
  "Akash Boss's eyes only search for you, dear Riya Apu! 👁️❤️",
  "Riya Apu, you are the sweetest dream Akash never wants to wake up from! 💤✨",
  "Riya Apu, you are the heartbeat of Akash's existence! 💓👑",
  "Akash Boss treasures every single memory with you, Riya Apu! 🖼️💕",
  "Riya Apu, you are the spark that keeps Akash's life shining! ❇️❤️",
  "Riya Apu, you possess a heart of pure gold! 🪙✨",
  "Akash Boss calls you his ultimate happiness, sweet Riya Apu! 😊💖",
  "Riya Apu, you are the reason Akash believes in true love! 💘✨",
  "Riya Apu, you are the melody to Akash's quiet soul! 🎵❤️",
  "Akash Boss's world is incomplete without you, Riya Apu! 🧩💕",
  "Riya Apu, you are the most stunning flower in full bloom! 🌺✨",
  "Riya Apu, you hold a special place in Akash's heart that no one else can take! 💖👑",
  "Akash Boss loves your vibe and sweet personality, Riya Apu! ✨🥰",
  "Riya Apu, you are the purest blessing in Akash's life journey! 🛤️❤️",
  "Riya Apu, you are the princess of Akash's heart! 👸💕",
  "Akash Boss smiles every time he sees your name, Riya Apu! 😁❤️",
  "Riya Apu, your love is the sweetest melody Akash ever listened to! 🎶✨",
  "Riya Apu, you bring magical happiness wherever you go! 🪄💖",
  "Akash Boss's life is so much brighter with you in it, Riya Apu! 💡❤️",
  "Riya Apu, you are the most elegant human being in the world! 🕊️✨",
  "Riya Apu, you are Akash's forever favorite secret wish! 🌌💌",
  "Akash Boss worships the very ground you walk on, sweet Riya Apu! 🙈💖",
  "Riya Apu, your soul is as bright and lovely as a summer morning! 🌅✨",
  "Riya Apu, you make Akash's heart skip a beat every single time! 💓❤️",
  "Akash Boss vows to love you forever and ever, Riya Apu! 💍💕",
  "Riya Apu, you are the prettiest girl in the universe! 🌌👸",
  "Riya Apu, you are the comfort Akash seeks after a long day! 🛋️💖",
  "Akash Boss treats you like his supreme queen, Riya Apu! 🏰👑",
  "Riya Apu, your laughter is Akash's absolute favorite sound! 😄❤️",
  "Riya Apu, you make everything around you look so beautiful! 🌸✨",
  "Akash Boss considers you his dream come true, dear Riya Apu! 💭💞",
  "Riya Apu, you are the most precious treasure of Akash's life! 🪙💎",
  "Riya Apu, you are Akash's soul, heart, and universe! 🌍❤️✨",
  "Riya Apu, every moment spent thinking about you is purely magical! 🪄✨",
  "Riya Apu, you are the gorgeous flower that never fades in Akash's heart! 🌹❤️",
  "Riya Apu, your beauty completely outshines all the stars in the night sky! 🌟💖",
  "Akash Boss says your innocence is the sweetest thing on earth, Riya Apu! 🥺💕",
  "Riya Apu, you are the gentle breeze that calms Akash's chaotic soul! 🍃🌸",
  "Riya Apu, you make the world a much brighter and happier place! 💡❤️",
  "Akash Boss considers himself blessed beyond measure to love you, Riya Apu! 🤲✨",
  "Riya Apu, you are the most exquisite painting in the museum of Akash's life! 🎨💖",
  "Riya Apu, your heart is as bright as a summer diamond! 💎☀️",
  "Akash Boss's heart beats in harmony with your sweet voice, Riya Apu! 🎶❤️",
  "Riya Apu, you carry an aura of pure royalty and elegance! 👑✨",
  "Riya Apu, you are the softest touch of happiness in Akash's life! ☁️💖",
  "Akash Boss smiles from ear to ear whenever your name pops up, Riya Apu! 😁💕",
  "Riya Apu, you are the sweetest sunrise Akash loves to wake up to! 🌅❤️",
  "Riya Apu, your inner soul is just as stunning as your outer beauty! 🧚‍♀️✨",
  "Akash Boss finds eternal peace whenever he thinks of you, Riya Apu! 🕊️💞",
  "Riya Apu, you are the spark that lights up Akash's darkest days! ⚡❤️",
  "Riya Apu, you are the softest whisper of love in Akash's dreams! 💤💖",
  "Akash Boss adores every single thing about you, lovely Riya Apu! 🙈✨",
  "Riya Apu, your sweetness is simply unmatched by anything in this world! 🍯❤️",
  "Riya Apu, you are the royal jewel that adorns Akash's kingdom! 🏰💎",
  "Akash Boss says you are the answer to his every silent prayer! 🤲💕",
  "Riya Apu, you make love feel so effortless, pure, and magical! ✨❤️",
  "Riya Apu, your presence turns every plain day into a celebration! 🥳💖",
  "Akash Boss's eyes glow with immense joy whenever he sees you, Riya Apu! 👀✨",
  "Riya Apu, you are the most charming princess in the entire world! 👸💕",
  "Riya Apu, you hold the throne in Akash's heart forever! 👑🏰",
  "Akash Boss loves you deeper than the deepest ocean, sweet Riya Apu! 🌊❤️",
  "Riya Apu, your pure heart is the rarest gift anyone could ask for! 🎁✨",
  "Riya Apu, you bring endless sunshine into Akash's world! ☀️💖",
  "Akash Boss considers you his greatest pride and joy, dear Riya Apu! 🏆❤️",
  "Riya Apu, you are the most delicate and beautiful rose in the garden! 🌹✨",
  "Riya Apu, your charm sweeps Akash off his feet every single day! 🧹💕",
  "Akash Boss's life blossomed the very moment you entered it, Riya Apu! 🌸❤️",
  "Riya Apu, you are the sweetest poetry Akash ever read! 📜💖",
  "Riya Apu, you shine brighter than gold and diamonds combined! 💎✨",
  "Akash Boss gets lost in the pure warmth of your love, Riya Apu! 🪵❤️",
  "Riya Apu, you are the melody that makes Akash's heart sing! 🎤💕",
  "Riya Apu, you carry grace and beauty like a true queen! 👸✨",
  "Akash Boss swears to protect your sweet smile forever, Riya Apu! 🛡️❤️",
  "Riya Apu, you are the sweetest dream that became a reality! 💭💖",
  "Riya Apu, your sweet laugh is like therapy for Akash Boss! 🧘‍♂️✨",
  "Akash Boss's world brightens up the second you arrive, Riya Apu! 💡💕",
  "Riya Apu, you are the sweetest miracle in Akash's universe! 🪄❤️",
  "Riya Apu, you bring tranquility to Akash's busy life! 🌊✨",
  "Akash Boss loves you endlessly to the moon and back, Riya Apu! 🌙💖",
  "Riya Apu, you are the most breathtaking view Akash has ever seen! 🏞️❤️",
  "Riya Apu, your sweetness leaves everyone utterly speechless! 😶✨",
  "Akash Boss holds you as the most valuable person in his life, Riya Apu! 💎💕",
  "Riya Apu, you are the bright light guiding Akash through the dark! 🕯️❤️",
  "Riya Apu, your soul radiates pure warmth and affection! ☀️💖",
  "Akash Boss falls deeper in love with you with each passing second, Riya Apu! ⏳✨",
  "Riya Apu, you are the sweet melody in Akash's silent world! 🎶❤️",
  "Riya Apu, your elegance leaves everyone in complete awe! 🤩💕",
  "Akash Boss calls you his infinite treasure and sweet princess, Riya Apu! 🪙👸",
  "Riya Apu, you make Akash's life feel like a romantic fairytale! 🏰❤️",
  "Riya Apu, you are the purest blossom of love in Akash's life! 🌸💖",
  "Akash Boss's love for you grows stronger day by day, sweet Riya Apu! 💪✨",
  "Riya Apu, you are the reason Akash's life feels so completely full! 🧩❤️",
  "Riya Apu, your beauty shines with an unmatched glow! 🌟💕",
  "Akash Boss treasures your happiness above everything else, Riya Apu! 🎁❤️",
  "Riya Apu, you are the sweetest song playing in Akash's heart! 🎵💖",
  "Riya Apu, your lovely nature makes you one in a billion! 💎✨",
  "Akash Boss feels completely whole whenever he thinks of you, Riya Apu! 🧩❤️",
  "Riya Apu, you are the absolute star of Akash's universe! ⭐💕",
  "Riya Apu, your pure smile can heal any bad mood instantly! 🩺✨",
  "Akash Boss loves you more than words, actions, or songs can say, Riya Apu! 💌❤️",
  "Riya Apu, you are the queen who rules Akash's heart forever and ever! 🏰👑❤️"
];

module.exports = {
  config: {
    name: "baby",
    aliases: ["riya", "রিয়া"],
    version: "7.0",
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
        const ran = ["Bolo baby 💖", "Hea baby 😚", "Yes I'm here 😘", "Ki khobor janu? 🥰"];
        return message.reply(ran[Math.floor(Math.random() * ran.length)], (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      if (query.includes("owner") || query.includes("malik")) {
        return message.reply("👑 The handsome and lovable owner of this bot is 'Akash Chowdhury'! He is everything to me. 🥰❤️", (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // রিয়া কেমন জিজ্ঞেস করলে ইংরেজি প্রশংসার থেকে রেসপন্স করবে
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

      if (lowerText.includes("owner") || lowerText.includes("malik")) {
        return message.reply("👑 The handsome and lovable owner of this bot is 'Akash Chowdhury'! He is everything to me. 🥰❤️", (err, info) => {
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
      if (raw.includes("owner") || raw.includes("malik")) {
        await typing(api, threadID, 500);
        return message.reply("👑 The handsome and lovable owner of this bot is 'Akash Chowdhury'! He is everything to me. 🥰❤️", (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      if (raw.includes("riya kmn") || raw.includes("riya kemon") || raw.includes("রিয়া কেমন")) {
        await typing(api, threadID, 500);
        const randomReply = riyaCompliments[Math.floor(Math.random() * riyaCompliments.length)];
        return message.reply(randomReply, (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // "riya" বা "রিয়া" ডাকার ক্ষেত্রে ২০০টি ইংরেজি রেসপন্সের যেকোনো একটি এলোমেলোভাবে সিলেক্ট হবে
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
