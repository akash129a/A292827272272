const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "autotimer",
  version: "5.1",
  role: 0,
  author: "Akash Chowdhury",
  description: "⏰ প্রতি ঘণ্টায় ভিডিওসহ অটো মেসেজ পাঠাবে (Ultra Optimized)",
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

  // Prevent double sending within the same minute
  if (!global.__sentMap) global.__sentMap = {};
  
  // Track thread configurations
  if (!global.autoTimerConfig) global.autoTimerConfig = {};

  const checkTimeAndSend = async () => {
    try {
      const now = moment().tz("Asia/Dhaka").format("hh:mm A");

      if (!timerData[now]) return;

      const todayDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
      const { text, video } = timerData[now];

      const videoName = now.replace(/[: ]/g, "_") + ".mp4";
      const videoPath = path.join(cacheDir, videoName);

      if (!fs.existsSync(videoPath)) {
        try {
          console.log(`[AUTOTIMER] Downloading video for ${now}...`);
          const res = await axios.get(video, { responseType: "arraybuffer" });
          fs.writeFileSync(videoPath, Buffer.from(res.data));
          console.log(`[AUTOTIMER] Cached video for ${now} successfully.`);
        } catch (err) {
          console.error(`[AUTOTIMER] Video download failed for ${now}:`, err.message);
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

      const allThreads = await api.getThreadList(1000, null, ["INBOX"]);
 
