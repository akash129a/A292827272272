const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// কনফিগারেশন ফাইল পাথ (On/Off ডাটা সেভ রাখার জন্য)
const configPath = path.join(__dirname, "cache", "autotimer_config.json");

function getStatusMap() {
  try {
    if (fs.existsSync(configPath)) {
      return fs.readJsonSync(configPath);
    }
  } catch (err) {
    console.error("[AUTOTIMER] Config read error:", err);
  }
  return {};
}

function saveStatusMap(map) {
  try {
    fs.outputJsonSync(configPath, map, { spaces: 2 });
  } catch (err) {
    console.error("[AUTOTIMER] Config save error:", err);
  }
}

module.exports.config = {
  name: "autotimer",
  version: "6.0",
  role: 0, // ১ বা ২ করতে পারো যদি শুধু এডমিনদের অন/অফ করতে দিতে চাও
  author: "Akash Chowdhury",
  description: "⏰ প্রতি ঘণ্টায় ভিডিওসহ অটো মেসেজ পাঠাবে (On/Off সিস্টেমসহ)",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {
  // 🔒 Author lock check
  if (module.exports.config.author !== "Akash Chowdhury") {
    console.error("❌ Author name has been changed. The file will not run.");
    return process.exit(1);
  }

  const timerData = {
    "12:00 AM": { text: "⌚┆এখন রাত ১২টা বাজে❥︎খাউয়া দাউয়া করে নেউ,🍽️🍛", video: "https://files.catbox.moe/8btwbx.mp4" },
    "01:00 AM": { text: "⌚┆এখন রাত ১টা বাজে❥︎সবাই শুয়ে পড়ো,🌌💤", video: "https://files.catbox.moe/9iq1ki.mp4" },
    "02:00 AM": { text: "⌚┆এখন রাত ২টা বাজে❥︎প্রেম না কইরা যাইয়া ঘুমা বেক্কল,😾🌠", video: "https://files.catbox.moe/g9zf5c.mp4" },
    "03:00 AM": { text: "⌚┆এখন রাত ৩টা বাজে❥︎যারা ছ্যাকা খাইছে তারা জেগে আছে,🫠🌃", video: "https://files.catbox.moe/siojtf.mp4" },
    "04:00 AM": { text: "⌚┆এখন রাত ৪টা বাজে❥︎ফজরের প্রস্তুতি নাও,🌄", video: "https://files.catbox.moe/siojtf.mp4" },
    "05:00 AM": { text: "⌚┆এখন সকাল ৫টা বাজে❥︎নামাজ পড়ছো তো?🌅☀️", video: "https://files.catbox.moe/5v4nxi.mp4" },
    "06:00 AM": { text: "⌚┆এখন সকাল ৬টা বাজে❥︎ঘুম থেকে উঠো সবাই,🌞☕", video: "https://files.catbox.moe/q9rf0f.mp4" },
    "07:00 AM": { text: "⌚┆এখন সকাল ৭টা বাজে❥︎ব্রেকফাস্ট করে নাও,🍞", video: "https://files.catbox.moe/ztnm6a.mp4" },
    "08:00 AM": { text: "⌚┆এখন সকাল ৮টা বাজে❥︎কাজ শুরু করো মন দিয়ে,🌤️✨", video: "https://files.catbox.moe/tb5xef.mp4" },
    "09:00 AM": { text: "⌚┆এখন সকাল ৯টা বাজে❥︎চল কাজে মন দিই!🕘", video: "https://files.catbox.moe/2mi5oo.mp4" },
    "10:00 AM": { text: "⌚┆এখন সকাল ১০টা বাজে❥︎তোমাদের মিস করছি,🌞☀️", video: "https://files.catbox.moe/q2vg9i.mp4" },
    "11:00 AM": { text: "⌚┆এখন সকাল ১১টা বাজে❥︎কাজ চালিয়ে যাও!😌", video: "https://files.catbox.moe/zzm2xo.mp4" },
    "12:00 PM": { text: "⌚┆এখন দুপুর ১২টা বাজে❥︎ভালোবাসা জানাও সবাইকে,❤️", video: "https://files.catbox.moe/g8d1av.mp4" },
    "01:00 PM": { text: "⌚┆এখন দুপুর ১টা বাজে❥︎জোহরের নামাজ পড়ে নাও,🙇🤲", video: "https://files.catbox.moe/ypt7au.mp4" },
    "02:00 PM": { text: "⌚┆এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো?🍛🌤️", video: "https://files.catbox.moe/nstu8b.mp4" },
    "03:00 PM": { text: "⌚┆এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো,🧑🔧☀️", video: "https://files.catbox.moe/xmrujv.mp4" },
    "04:00 PM": { text: "⌚┆এখন বিকাল ৪টা বাজe❥︎আসরের নামাজ পড়ে নাও,🙇🥀", video: "https://files.catbox.moe/jndni6.mp4" },
    "05:00 PM": { text: "⌚┆এখন বিকাল ৫টা বাজে❥︎একটু বিশ্রাম নাও,🙂↕️🌆", video: "https://files.catbox.moe/dv3qv4.mp4" },
    "06:00 PM": { text: "⌚┆এখন সন্ধ্যা ৬টা বাজে❥︎পরিবারকে সময় দাও,😍🌇", video: "https://files.catbox.moe/au2yk5.mp4" },
    "07:00 PM": { text: "⌚┆এখন সন্ধ্যা ৭টা বাজে❥︎এশার নামাজ পড়ো,❤️🌃", video: "https://files.catbox.moe/4v4uyv.mp4" },
    "08:00 PM": { text: "⌚┆এখন রাত ৮টা বাজে❥︎আজকের কাজ শেষ করো,🧖🙂↔️", video: "https://files.catbox.moe/ltspa4.mp4" },
    "09:00 PM": { text: "⌚┆এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও,😴🌙", video: "https://files.catbox.moe/sxs5io.mp4" },
    "10:00 PM": { text: "⌚┆এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে,😴🙂↕️", video: "https://files.catbox.moe/0e4s7h.mp4" },
    "11:00 PM": { text: "⌚┆এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো,🥰🌌", video: "https://files.catbox.moe/ndbhtu.mp4" }
  };

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) {
    fs.ensureDirSync(cacheDir);
  }

  if (!global.__sentMap) global.__sentMap = {};

  const checkTimeAndSend = async () => {
    try {
      const now = moment().tz("Asia/Dhaka").format("hh:mm A");
      if (!timerData[now]) return;

      // এক মিনিটে যেন বারবার মেসেজ না যায়
      const currentMinute = moment().tz("Asia/Dhaka").format("HH:mm");
      if (global.__sentMap[currentMinute]) return;

      const statusMap = getStatusMap();
      
      // আপনার বটের সব থ্রেড লিস্ট নেওয়ার প্রসেস
      const allThreads = await api.getThreadList(100, null, ["INBOX"]);
      if (!allThreads || allThreads.length === 0) return;

      const todayDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
      const { text, video } = timerData[now];
      const videoName = now.replace(/[: ]/g, "_") + ".mp4";
      const videoPath = path.join(cacheDir, videoName);

      // ভিডিও ডাউনলোড লজিক
      if (!fs.existsSync(videoPath)) {
        try {
          console.log(`[AUTOTIMER] Downloading video for ${now}...`);
          const res = await axios.get(video, { responseType: "arraybuffer" });
          fs.writeFileSync(videoPath, Buffer.from(res.data));
        } catch (err) {
          console.error(`[AUTOTIMER] Video download failed:`, err.message);
          return;
        }
      }

      const msg = `◢◤━━━━━━━━━━━━━━━━◥◣
🕒>ᴛɪᴍᴇ: ${now}
${text}
◥◣━━━━━━━━━━━━━━━━◢◤
📅>ᴅᴀᴛᴇ: ${todayDate}
━━━━━━━━━━━━━━━━━━━━
𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁:- ${module.exports.config.author}
━━━━━━━━━━━━━━━━━━━━`;

      let sentToAny = false;

      for (const thread of allThreads) {
        const threadID = thread.threadID;
        
        // শুধু অন থাকা গ্রুপগুলোতেই মেসেজ যাবে
        if (statusMap[threadID] === true) {
          try {
            await api.sendMessage({
              body: msg,
              attachment: fs.createReadStream(videoPath)
            }, threadID);
            sentToAny = true;
          } catch (e) {
            console.error(`[AUTOTIMER] Failed sending to ${threadID}:`, e.message);
          }
        }
      }

      if (sentToAny) {
        global.__sentMap[currentMinute] = true;
      }
    } catch (err) {
      console.error("[AUTOTIMER] Interval loop error:", err.message);
    }
  };

  // প্রতি ৩০ সেকেন্ডে সময় চেক করবে
  setInterval(checkTimeAndSend, 30000);
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const statusMap = getStatusMap();

  if (!args[0]) {
    return api.sendMessage("⚠️ দয়া করে 'on' অথবা 'off' লিখুন।\nযেমন: /autotimer on", threadID, messageID);
  }

  const action = args[0].toLowerCase();

  if (action === "on") {
    statusMap[threadID] = true;
    saveStatusMap(statusMap);
    return api.sendMessage("✅ এই গ্রুপে প্রতি ঘণ্টার অটো-টাইমার মেসেজ চালু করা হয়েছে।", threadID, messageID);
  } 
  else if (action === "off") {
    statusMap[threadID] = false;
    saveStatusMap(statusMap);
    return api.sendMessage("❌ এই গ্রুপে প্রতি ঘণ্টার অটো-টাইমার মেসেজ বন্ধ করা হয়েছে।", threadID, messageID);
  } 
  else {
    return api.sendMessage("⚠️ ভুল কমান্ড! শুধু 'on' অথবা 'off' ব্যবহার করুন।", threadID, messageID);
  }
};
