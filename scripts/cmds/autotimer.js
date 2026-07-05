const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// গ্লোবাল স্টেট ব্যাকআপ (সার্ভিস চালু/বন্ধ রাখার জন্য)
if (global.autoTimerStatus === undefined) global.autoTimerStatus = true; 

module.exports.config = {
  name: "autotimer",
  version: "5.2",
  role: 0,
  author: "Akash Chowdhury",
  description: "⏰ প্রতি ঘণ্টায় ভিডিওসহ অটো মেসেজ পাঠাবে এবং অন/অফ করা যাবে",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {

  const timerData = {
    "12:00 AM": { text: "⌚┆এখন রাত ১২টা বাজে❥︎খাউয়া দাউয়া করে নেউ,🍽️🍛",         video: "https://files.catbox.moe/8btwbx.mp4" },
    "01:00 AM": { text: "⌚┆এখন রাত ১টা বাজে❥︎সবাই শুয়ে পড়ো,🌌💤",               video: "https://files.catbox.moe/9iq1ki.mp4" },
    "02:00 AM": { text: "⌚┆এখন রাত ২টা বাজে❥︎প্রেম না কইরা যাইয়া ঘুমা বেক্কল,😾🌠",    video: "https://files.catbox.moe/g9zf5c.mp4" },
    "03:00 AM": { text: "⌚┆এখন রাত ৩টা বাজে❥︎যারা ছ্যাকা খাইছে তারা জেগে আছে,🫠🌃", video: "https://files.catbox.moe/siojtf.mp4" },
    "04:00 AM": { text: "⌚┆এখন রাত ৪টা বাজে❥︎ফজরের প্রস্তুতি নাও,🌄",               video: "https://files.catbox.moe/siojtf.mp4" },
    "05:00 AM": { text: "⌚┆এখন সকাল ৫টা বাজে❥︎নামাজ পড়ছো তো?🌅☀️",             video: "https://files.catbox.moe/5v4nxi.mp4" },
    "06:00 AM": { text: "⌚┆এখন সকাল ৬টা বাজে❥︎ঘুম থেকে উঠো সবাই,🌞☕",           video: "https://files.catbox.moe/q9rf0f.mp4" },
    "07:00 AM": { text: "⌚┆এখন সকাল ৭টা বাজে❥︎ব্রেকফাস্ট করে নাও,🍞",               video: "https://files.catbox.moe/ztnm6a.mp4" },
    "08:00 AM": { text: "⌚┆এখন সকাল ৮টা বাজে❥︎কাজ শুরু করো মন দিয়ে,🌤️✨",         video: "https://files.catbox.moe/tb5xef.mp4" },
    "09:00 AM": { text: "⌚┆এখন সকাল ৯টা বাজে❥︎চল কাজে মন দিই!🕘",                 video: "https://files.catbox.moe/2mi5oo.mp4" },
    "10:00 AM": { text: "⌚┆এখন সকাল ১০টা বাজে❥︎তোমাদের মিস করছি,🌞☀️",             video: "https://files.catbox.moe/q2vg9i.mp4" },
    "11:00 AM": { text: "⌚┆এখন সকাল ১১টা বাজে❥︎কাজ চালিয়ে যাও!😌",                 video: "https://files.catbox.moe/zzm2xo.mp4" },
    "12:00 PM": { text: "⌚┆এখন দুপুর ১২টা বাজে❥︎ভালোবাসা জানাও সবাইকে,❤️",            video: "https://files.catbox.moe/g8d1av.mp4" },
    "01:00 PM": { text: "⌚┆এখন দুপুর ১টা বাজে❥︎জোহরের নামাজ পড়ে নাও,🙇🤲",           video: "https://files.catbox.moe/ypt7au.mp4" },
    "02:00 PM": { text: "⌚┆এখন দুপুর ২টা বাজে❥︎দুপুরের খাবার খেয়েছো তো?🍛🌤️",           video: "https://files.catbox.moe/nstu8b.mp4" },
    "03:00 PM": { text: "⌚┆এখন বিকাল ৩টা বাজে❥︎কাজে ফোকাস করো,🧑🔧☀️",               video: "https://files.catbox.moe/xmrujv.mp4" },
    "04:00 PM": { text: "⌚┆এখন বিকাল ৪টা বাজe❥︎আসরের নামাজ পড়ে নাও,🙇🥀",           video: "https://files.catbox.moe/jndni6.mp4" },
    "05:00 PM": { text: "⌚┆এখন বিকাল ৫টা বাজে❥︎একটু বিশ্রাম নাও,🙂↕️🌆",                  video: "https://files.catbox.moe/dv3qv4.mp4" },
    "06:00 PM": { text: "⌚┆এখন সন্ধ্যা ৬টা বাজে❥︎পরিবারকে সময় দাও,😍🌇",                video: "https://files.catbox.moe/au2yk5.mp4" },
    "07:00 PM": { text: "⌚┆এখন সন্ধ্যা ৭টা বাজে❥︎এশার নামাজ পড়ো,❤️🌃",                  video: "https://files.catbox.moe/4v4uyv.mp4" },
    "08:00 PM": { text: "⌚┆এখন রাত ৮টা বাজে❥︎আজকের কাজ শেষ করো,🧖🙂↕️",              video: "https://files.catbox.moe/ltspa4.mp4" },
    "09:00 PM": { text: "⌚┆এখন রাত ৯টা বাজে❥︎ঘুমের প্রস্তুতি নাও,😴🌙",                    video: "https://files.catbox.moe/sxs5io.mp4" },
    "10:00 PM": { text: "⌚┆এখন রাত ১০টা বাজে❥︎ঘুমাতে যাও, স্বপ্নে দেখা হবে,😴🙂↕️",           video: "https://files.catbox.moe/0e4s7h.mp4" },
    "11:00 PM": { text: "⌚┆এখন রাত ১১টা বাজে❥︎ভালোবাসা রইলো,🥰🌌",                    video: "https://files.catbox.moe/ndbhtu.mp4" }
  };

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  // 🔥 per group + per time tracking
  if (!global.__sentMap) global.__sentMap = {};

  let isChecking = false;

  const checkTimeAndSend = async () => {
    // অন/অফ চেক এবং লক স্টেট চেক
    if (!global.autoTimerStatus || isChecking) return;
    isChecking = true;

    try {
      const now = moment().tz("Asia/Dhaka").format("hh:mm A");

      // সঠিক সময় না হলে স্কিপ করবে
      if (!timerData[now]) {
        isChecking = false;
        return;
      }

      const todayDate = moment().tz("Asia/Dhaka").format("DD-MM-YYYY");
      const { text, video } = timerData[now];

      // পুরনো ডেটা ক্লিনিং
      for (const key of Object.keys(global.__sentMap)) {
        if (key !== todayDate) delete global.__sentMap[key];
      }

      if (!global.__sentMap[todayDate]) global.__sentMap[todayDate] = {};
      if (!global.__sentMap[todayDate][now]) global.__sentMap[todayDate][now] = [];

      // থ্রেড লিস্ট বা গ্রুপ লিস্ট নিয়ে আসা (সর্বোচ্চ ১০০টি সচল চ্যাট)
      const threads = await api.getThreadList(100, null, ["INBOX"]);
      
      // ভিডিও ডাউনলোডের পাথ সেটআপ
      const videoPath = path.join(cacheDir, `timer_${now.replace(/:| /g, "_")}.mp4`);

      // যদি এই নির্দিষ্ট ঘণ্টায় মেসেজ অলরেডি পাঠানো না হয়ে থাকে, তবেই ডাউনলোড করবে
      let downloaded = false;

      for (const thread of threads) {
        if (!thread.isGroup || !thread.isSubscribed) continue; // শুধু একটিভ গ্রুপ চ্যাটে যাবে
        
        // অলরেডি এই গ্রুপে পাঠানো হয়ে গেলে স্কিপ করবে
        if (global.__sentMap[todayDate][now].includes(thread.threadID)) continue;

        // প্রথমবার ভিডিও ডাউনলোড লজিক
        if (!downloaded) {
          const response = await axios({
            method: "get",
            url: video,
            responseType: "stream"
          });
          const writer = fs.createWriteStream(videoPath);
          response.data.pipe(writer);
          
          await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
          });
          downloaded = true;
        }

        // মেসেজ পাঠানো
        api.sendMessage(
          {
            body: text,
            attachment: fs.createReadStream(videoPath)
          },
          thread.threadID,
          (err) => {
            if (!err) {
              global.__sentMap[todayDate][now].push(thread.threadID);
            }
          }
        );
      }

      // কাজ শেষে ক্যাশ ফাইল ডিলিট করার ট্রাই (একটু পর যাতে ফাইল লক রিলিজ হয়)
      setTimeout(() => {
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      }, 15000);

    } catch (error) {
      console.error("AutoTimer Error: ", error);
    } finally {
      isChecking = false;
    }
  };

  // প্রতি ৩০ সেকেন্ড পর পর টাইম চেক করবে
  setInterval(checkTimeAndSend, 30000); 
};

// 🎮 ম্যানুয়ালি অন/অফ করার জন্য অনস্টার্ট মেথড
module.exports.onStart = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  
  if (!args[0]) {
    return api.sendMessage(`🔧 বর্তমানে অটো-টাইমারটি ${global.autoTimerStatus ? "চালু (ON)" : "বন্ধ (OFF)"} আছে।\n\nচালু করতে লিখুন: /autotimer on\nবন্ধ করতে লিখুন: /autotimer off`, threadID, messageID);
  }

  if (args[0].toLowerCase() === "on") {
    global.autoTimerStatus = true;
    return api.sendMessage("✅ অটো-টাইমার সাকসেসফুলি চালু করা হয়েছে। এখন থেকে প্রতি ঘণ্টায় ভিডিও মেসেজ যাবে।", threadID, messageID);
  } else if (args[0].toLowerCase() === "off") {
    global.autoTimerStatus = false;
    return api.sendMessage("❌ অটো-টাইমার বন্ধ করা হয়েছে। পরবর্তী নির্দেশ না দেওয়া পর্যন্ত কোনো মেসেজ যাবে না।", threadID, messageID);
  } else {
    return api.sendMessage("⚠️ ভুল কমান্ড! দয়া করে '/autotimer on' অথবা '/autotimer off' ব্যবহার করুন।", threadID, messageID);
  }
};
