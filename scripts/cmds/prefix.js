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

// রিয়ার জন্য ২০০টি বিশেষ ইংরেজি ও বাংলা প্রশংসামূলক রেসপন্স
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
  "Riya Apu, you are the most precious gift from above! 🎁🕊️",
  "Your innocence is the sweetest thing on earth! 🥺❤️",
  "Riya Apu, you bring magical colors to everyone's life! 🎨✨",
  "Riya Apu, you carry an aura of pure royalty! 👑✨",
  "You are the softest touch of happiness and peace! ☁️💖",
  "Riya Apu, your inner soul is just as stunning as your outer beauty! 🧚‍♀️✨",
  "Your charm sweeps everyone off their feet every single day! 🧹💕",
  "Riya Apu, you shine brighter than gold and diamonds combined! 💎✨",
  "You carry grace and beauty like a true queen, Riya Apu! 👸✨",
  "Riya Apu, your sweet laugh is purely therapeutic! 🧘‍♂️✨",
  "You are the sweetest miracle in this universe! 🪄❤️",
  "Riya Apu, your sweetness leaves everyone utterly speechless! 😶✨",
  "You are the brightest light in the dark, Riya Apu! 🕯️❤️",
  "Riya Apu, your elegance leaves everyone in complete awe! 🤩💕",
  "Riya Apu, you are the prettiest girl in the universe! 🌌👸",
  "Riya Apu, tu ekdm angel er moto shundor! 🕊️✨",
  "Apnar moto shundor ar cute manush ar ekta-o nei Riya Apu! 🥰💖",
  "Riya Apu, apnar hashita jeno shorgo theke asha kono aalo! 😊🌸",
  "Tumi shotyi khub shundor ar khub mishi Riya Apu! 💕👑",
  "Riya Apu apnar shob kichui khub perfect ar stylish! ✨💎",
  "Shobai toh shundor hoy, kintu Riya Apu hocche shobcheye shundor! 🌹👸",
  "Riya Apu, apnar mon ta apnar chehara-r motoi shundor! 🌸💖",
  "Apni jei khane jaan, sheikhani aalo choriyen Riya Apu! 🌟✨",
  "Riya Apu er moto cute ar innocent keu hotei pare na! 🥺❤️",
  "Apnar rূপ dekhe toh shobai obak hoye jay Riya Apu! 😲🌺",
  "Riya Apu, apni hocchen pure elegance er udahoron! 👸💎",
  "Apnar chokher ghom ghom shundorjo shobakei mugdho kore! 👁️💖",
  "Riya Apu, apni ekebare rajkonna-r moto! 👑💖",
  "Apnar kotha shunle mon bhalo hoye jay Riya Apu! 🎶🥰",
  "Riya Apu, apni eito chatbox er shobcheye boro star! ⭐✨",
  "Apni shobshomoy erom fota golap er moto shundor thaken Riya Apu! 🌹💫",
  "Riya Apu, apnar moto purno shundorjo ar kothao nei! ✨💖",
  "Apnar purno mukh-er mishi hashi shobaro pochondo Riya Apu! 😁❤️",
  "Riya Apu, you are a walking sunshine and joy! ☀️🌸",
  "Apni jeno ekta shundor kabita Riya Apu! 📖❤️",
  "Riya Apu er shundorjo r shob kichu ekebare top class! 👑💥",
  "Apnar charming personality dekhe shobai impressed Riya Apu! 🔥✨",
  "Riya Apu, apni hocchen prithibir shobcheye mishti meye! 🍯💕",
  "Apni ashle pura atmosphere colorful hoye jay Riya Apu! 🎨🌈",
  "Riya Apu, you possess a heart of pure gold! 🪙✨",
  "Apnar protita style-i khub mishi ar elegant Riya Apu! 👗💖",
  "Riya Apu, you make this world a much better place! 🌸🥰",
  "Apni ashlei chatbox shining bright hoye uthe Riya Apu! 💡❤️",
  "Riya Apu, apnar moto cute ar sweet ar keu nei! 🥺💞",
  "You radiate pure positive energy everywhere you go, Riya Apu! ⚡✨",
  "Riya Apu, apnar shundor hashitai hocche shobcheye boro aakorshon! 😄💖",
  "Apnar mon-er shubhrota ebong shundorjo sobakei chuye jay Riya Apu! 🕊️❤️",
  "Riya Apu, you are literally the definition of perfection! 🎯💎",
  "Apni thakle shobkichu khub shundor ar shanto lage Riya Apu! 🍃💕",
  "Riya Apu, apnar shob style e apnake ekebare queen er moto lage! 👸🏰",
  "You are the sweetest melody in a silent room, Riya Apu! 🎶❤️",
  "Apnar moto mishi kotha keu bolte pare na Riya Apu! 🍯🥰",
  "Riya Apu, you are a precious diamond that shines bright! 💎✨",
  "Apnar shundor mukh-er ekta smile shob dukkho bhashiye dey! 😊💖",
  "Riya Apu, you are universally loved for your sweet vibe! ✨🌷",
  "Apnar shob kichu-i magical ar bhalobashar joggo Riya Apu! 🪄❤️",
  "Riya Apu, you are a blossom that never fades! 🌹✨",
  "Apnar obak kora shundorjo r mishi shahojogita shobakei mohito kore! 🌺💖",
  "Riya Apu, apnar juri nei prithibite! 🌍💫",
  "You bring tranquility and grace everywhere, dear Riya Apu! 🌊✨",
  "Apnar presence-i hocche amader shobcheye boro khushi Riya Apu! 🥳💖",
  "Riya Apu, you are a rare gem with an incredible heart! 💎🪙",
  "Apnar moto shundor manush dekhle chokh juriye jay Riya Apu! 👁️💕",
  "Riya Apu, you are simply unforgettable and brilliant! 🌌❤️",
  "Apnar shahoj shundorjo-i apnar shobcheye boro shokti Riya Apu! 🌸🛡️",
  "Riya Apu, you are a absolute beauty queen! 👸✨",
  "Apni jokhon kotha bolen, jeno shur baje Riya Apu! 🎧💖",
  "Riya Apu, your kindness adds a thousand stars to your beauty! 🌟🌺",
  "Apnar protiti kotha ebong hashite ache shuddho bhalobasha Riya Apu! 💌❤️",
  "Riya Apu, you are an absolute queen who rules with grace! 👑✨",
  "Apnar moto mishi hashir jonno prithibi ar-o shundor Riya Apu! ☀️💕",
  "Riya Apu, you are a piece of art straight from heaven! 🖼️🕊️",
  "Apnar moto innocent ar pyari ar keu nei Riya Apu! 🥺❤️",
  "Riya Apu, you are the most stunning star in the universe! ⭐💫",
  "Apnar charipash-er aalo sobakei khushi kore dey Riya Apu! 💡💖",
  "Riya Apu, you are forever full of grace and elegance! 👗👑",
  "Apnar moto mishi swabhab er keu hoy na Riya Apu! 🌸🥰",
  "Riya Apu, you bring endless joy and warmth! ☀️❤️",
  "Apnar protiti gesture khub shundor ar royal Riya Apu! 👸✨",
  "Riya Apu, your charm is completely unforgettable! 🧠💞",
  "Apnar shundorjey sobai abag hoye cheye thake Riya Apu! 🤩❤️",
  "Riya Apu, you are the sweetest soul in this universe! 🌌💖",
  "Apnar mon ta prithibir shobcheye boro r shundor Riya Apu! 🌍💖",
  "Riya Apu, you have a beautiful glow that never fades! 🌟✨",
  "Apni jokhon shamne ashen, shob kichu bright hoye jay Riya Apu! 💫💕",
  "Riya Apu, you are a combination of cuteness and royalty! 👸🥺",
  "Apnar protita kothay ache mishi ekta shur Riya Apu! 🎶❤️",
  "Riya Apu, your presence brings total peace and harmony! 🕊️💖",
  "Apnar moto mishi r stylish meye ar dekhi ni Riya Apu! 💅✨",
  "Riya Apu, you shine like a superstar everywhere! 🌠🌟",
  "Apnar shundor hashir tulona kebol apni nijei Riya Apu! 😄❤️",
  "Riya Apu, you are the true icon of beauty! 💎✨",
  "Apnar shob kichue ekebare natural ar flawless Riya Apu! 🌸💖",
  "Riya Apu, you deserve all the happiness in the world! 🎁❤️",
  "Apnar chokher chahoni-te ache ekta magical aakoroshan Riya Apu! 👁️🪄",
  "Riya Apu, you bring sunshine into everyone's day! ☀️💖",
  "Apnar shob kotha-i mishi mishi shur er moto shunay Riya Apu! 🎵💕",
  "Riya Apu, you are the epitome of pure style and elegance! 👠✨",
  "Apni ekebare shorgo theke nama pori-r moto Riya Apu! 🧚‍♀️❤️",
  "Riya Apu, your sweet smile can cure any bad mood! 🩺✨",
  "Apnar presence-i amader shobcheye boro anondo Riya Apu! 🎈💖",
  "Riya Apu, you are as delicate and beautiful as a lotus! 🪷✨",
  "Apnar shahoj-shorol obhab shobakei mogdho kore Riya Apu! 🕊️❤️",
  "Riya Apu, you are always shining like a diamond! 💎🌟",
  "Apnar mishi misti hashir tulona hoy na Riya Apu! 😁💕",
  "Riya Apu, you carry royalty in your soul! 👑❤️",
  "Apni hocchen shobcheye precious ar special Riya Apu! 🪙✨",
  "Riya Apu, your presence is like a fresh spring breeze! 🍃🌸",
  "Apnar obak kora shundorjo shobakei chena dey Riya Apu! 🤩💖",
  "Riya Apu, you are the queen of beauty and sweetness! 👸🍯",
  "Apnar prothom dekhai shobai apnar fan hoye jay Riya Apu! 🙌❤️",
  "Riya Apu, you bring magical happiness wherever you go! 🪄💖",
  "Apnar mon ta khub soft ar pabi Riya Apu! ☁️✨",
  "Riya Apu, you are the most charming princess ever! 👸💕",
  "Apnar shob kichui jeno khub classical ar shundor Riya Apu! 🎻❤️",
  "Riya Apu, your innocence shines through your eyes! 🥺💎",
  "Apnar style ar fashion taste ekebare high level Riya Apu! 💄👑",
  "Riya Apu, you bring colorful vibes everywhere! 🎨✨",
  "Apni hocchen prithibir ekta durlab jewel Riya Apu! 💎❤️",
  "Riya Apu, your sweet voice is like music to ears! 🎶💞",
  "Apnar chokh ar hashite ache jadu Riya Apu! ✨👁️",
  "Riya Apu, you are an absolute perfectionist in beauty! 🏹🌺",
  "Apnar purno shundorjo shohojei mon joy kore ney Riya Apu! ❤️🌸",
  "Riya Apu, you carry grace wherever you step! 👣💖",
  "Apnar mishi hashir samne baki shob fika Riya Apu! 😊⚡",
  "Riya Apu, you are a pure source of positivity and joy! 🔋💫",
  "Apnar moto cute meye charipashe thakle khushi baare Riya Apu! 🥰❤️",
  "Riya Apu, you are the true star of this kingdom! 🏰⭐",
  "Apnar pabi mon ar pyara look khub-i special Riya Apu! 🕊️💕",
  "Riya Apu, you radiate pure love and warmth! 🔥❤️",
  "Apnar shahoj kothabarta shobakei aakrishto kore Riya Apu! 🗣️✨",
  "Riya Apu, your smile turns gray skies into blue! ☁️☀️",
  "Apnar moto shundor mukh ar shundor mon ar keu paabe na Riya Apu! 🌸💎",
  "Riya Apu, you are truly a magical person! 🪄🥰",
  "Apnar shob kichutei ekta shundor touch thake Riya Apu! 🎨❤️",
  "Riya Apu, your inner glow shines through your face! 💡✨",
  "Apni hocchen prithibir shobcheye adorable person Riya Apu! 🥺💕",
  "Riya Apu, you possess an unforgettable charm! 💫❤️",
  "Apnar shundor hashir tulona hoy na Riya Apu! 😁💖",
  "Riya Apu, you are a walking miracle! 🚶‍♀️✨",
  "Apnar moto mishi swabhab shobaro pochondo Riya Apu! 🍯🥰",
  "Riya Apu, you are the brightest diamond in the crown! 👑💎",
  "Apnar chokhe ache ekta shundor dream-like vibe Riya Apu! 💭❤️",
  "Riya Apu, you are an epitome of sweetness and love! 🍯💞",
  "Apni jokhon hashin, mone hoy ful phutlo Riya Apu! 🌺😁",
  "Riya Apu, you are universally adored by everyone! 🤗✨",
  "Apnar mishi behavior apnake shobcheye boro kore Riya Apu! 👑💖",
  "Riya Apu, your elegance outshines everything else! 🌟❤️",
  "Apnar prothita style amader sobakei amazed kore Riya Apu! 🤩💅",
  "Riya Apu, you bring magical joy to life! 🪄💫",
  "Apni hocchen ekebare sweet cute princess Riya Apu! 👸🥺",
  "Riya Apu, your kindness makes you a thousand times more gorgeous! 🌸💖",
  "Apnar pabi mon-er jonno apni shobcheye alada Riya Apu! 🕊️❤️",
  "Riya Apu, you are the true queen of everyone's respect! 🏰👑",
  "Apnar jotoi proshongsha kori na keno kom hoye jabe Riya Apu! 📜✨",
  "Riya Apu, your presence turns plain days into festivals! 🥳💖",
  "Apnar smile dekhle shob dukkho bhule jawa jay Riya Apu! 😊❤️",
  "Riya Apu, you are a masterpiece created with perfection! 🖼️✨",
  "Apnar mishi hashitei ache shobcheye boro jadu Riya Apu! 🪄💕",
  "Riya Apu, you are the ultimate icon of elegance and beauty! 👑👸❤️"
];

// রিয়া সম্পর্কিত যেকোনো কিওয়ার্ড চেক করার হেলপার ফাংশন
const isRiyaMentioned = (text) => {
  const lower = text.toLowerCase();
  return (
    lower === "riya" ||
    lower === "রিয়া" ||
    lower.includes("riya kmn") ||
    lower.includes("riya kemon") ||
    lower.includes("রিয়া কেমন") ||
    lower.includes("কেমন আছো") ||
    lower.includes("kemon acho") ||
    lower.includes("kmn acho") ||
    lower.includes("kemon achen")
  );
};

module.exports = {
  config: {
    name: "baby",
    aliases: ["riya", "রিয়া"],
    version: "8.1",
    author: "rX (customized for Riya Apu)",
    countDown: 0,
    role: 0,
    shortDescription: "Full Mirai-style Baby AI with Exclusive Riya Customization",
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
        return message.reply("👑 The queen and absolute star of this bot is 'Riya Apu'! She is everything to us. 🥰❤️", (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      if (isRiyaMentioned(query)) {
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
╰─╼👑 𝐐𝐮𝐞𝐞𝐧: Riya Apu`
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

      // ১. ওনার চেক
      if (lowerText.includes("owner") || lowerText.includes("malik")) {
        return message.reply("👑 The queen and absolute star of this bot is 'Riya Apu'! She is everything to us. 🥰❤️", (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // ২. রিয়া বা কেমন আছো চেক (রিপ্লাই থ্রেডে বারবার কাজ করার জন্য)
      if (isRiyaMentioned(lowerText)) {
        const randomReply = riyaCompliments[Math.floor(Math.random() * riyaCompliments.length)];
        return message.reply(randomReply, (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // ৩. সাধারণ মেসেজের জন্য এপিআই কল
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
      // ওনার ডিটেকশন
      if (raw.includes("owner") || raw.includes("malik")) {
        await typing(api, threadID, 500);
        return message.reply("👑 The queen and absolute star of this bot is 'Riya Apu'! She is everything to us. 🥰❤️", (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // রিয়া অথবা কেমন আছো ডিটেকশন
      if (isRiyaMentioned(raw)) {
        await typing(api, threadID, 500);
        const randomReply = riyaCompliments[Math.floor(Math.random() * riyaCompliments.length)];
        return message.reply(randomReply, (err, info) => {
          if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
        });
      }

      // "riya <অন্য বার্তা>" বা "রিয়া <অন্য বার্তা>" লিখলে
      const isRiyaTrigger = raw.startsWith("riya ") || raw.startsWith("রিয়া ");
      if (isRiyaTrigger) {
        const cleanQuery = raw.replace(/^(riya|রিয়া)\s+/i, "").trim();
        if (!cleanQuery) return;

        await typing(api, threadID, 500);
        const res = await axios.get(`${simsim}/simsimi?text=${encodeURIComponent(cleanQuery)}&senderName=${encodeURIComponent(senderName)}`, { timeout: 15000 });

        const replies = Array.isArray(res.data.response) ? res.data.response : [res.data.response || "Hmm baby 😚"];
        for (const r of replies) {
          await message.reply(r, (err, info) => {
            if (!err && global.GoatBot && global.GoatBot.reply) global.GoatBot.reply.set(info.messageID, { commandName: "baby" });
          });
        }
        return;
      }

      // অটো টিচ ফিচার
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
