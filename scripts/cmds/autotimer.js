const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

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
    if (!fs.existsSync(path.join(__dirname, "cache"))) {
      fs.mkdirSync(path.join(__dirname, "cache"));
    }
    fs.outputJsonSync(configPath, map, { spaces: 2 });
  } catch (err) {
    console.error("[AUTOTIMER] Config save error:", err);
  }
}

module.exports.config = {
  name: "autotimer",
  version: "9.0",
  role: 0, 
  author: "Akash Chowdhury",
  description: "⏰ সময় অনুযায়ী ফানি ও ইসলামিক মেসেজ অটো পাঠাবে (On/Off সিস্টেমসহ)।",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {
  // Author Lock
  if (module.exports.config.author !== "Akash Chowdhury") {
    console.error("❌ Author name has been changed. The file will not run.");
    return process.exit(1);
  }

  const timerData = {
    "12:00 AM": { text: "🌙 রাত ১২টা বাজে! দিন শেষ, রাত শুরু। এখনও চ্যাট করছিস, তোর কি ঘুম নাই? 😂", video: "https://files.catbox.moe/8btwbx.mp4" },
    "01:00 AM": { text: "💤 রাত ১টা! এই সময়ে যারা জেগে থাকে তারা নির্ঘাত প্রেমে পড়েছে! তুই কি বলিস? 🤣", video: "https://files.catbox.moe/9iq1ki.mp4" },
    "02:00 AM": { text: "🌌 রাত ২টা! চারপাশ নিঝুম। ভূত দেখার আগে চোখ বন্ধ করে ঘুমিয়ে যা ভাই! 👻", video: "https://files.catbox.moe/g9zf5c.mp4" },
    "03:00 AM": { text: "🤲 রাত ৩টা! এটি মহান আল্লাহর কাছে চাওয়ার শ্রেষ্ঠ সময়। তাহাজ্জুদের নামাজ পড়ার চেষ্টা করুন। ✨", video: "https://files.catbox.moe/siojtf.mp4" },
    "04:00 AM": { text: "🕌 রাত ৪টা! সাহরি বা ফজরের প্রস্তুতির সময়। অযু করে পবিত্র হয়ে নিন। 🌸", video: "https://files.catbox.moe/siojtf.mp4" },
    "05:00 AM": { text: "📢 ফজরের আযান! নামাজের দিকে আসুন, নামাজের মধ্যেই রয়েছে পরম শান্তি। 🕌", video: "https://files.catbox.moe/5v4nxi.mp4" },
    "06:00 AM": { text: "☀️ শুভ সকাল! সকাল ৬টা বাজে। সুন্দর একটি দিন আপনার অপেক্ষায়। অলসতা ছাড়ুন! 💪", video: "https://files.catbox.moe/q9rf0f.mp4" },
    "07:00 AM": { text: "🍳 সকাল ৭টা! নাস্তার টেবিল কি রেডি? জলদি খেয়ে কাজে নামুন। ☕", video: "https://files.catbox.moe/ztnm6a.mp4" },
    "08:00 AM": { text: "💼 সকাল ৮টা! অফিসের ব্যাগ বা পড়ার টেবিল আপনাকে ডাকছে। শুভ কামনায় দিনটি শুরু হোক! ✨", video: "https://files.catbox.moe/tb5xef.mp4" },
    "09:00 AM": { text: "☕ সকাল ৯টা! কাজের চাপে মাথা গরম হওয়ার আগেই এক কাপ চা খেয়ে নিন। 🍵", video: "https://files.catbox.moe/2mi5oo.mp4" },
    "10:00 AM": { text: "🕙 সকাল ১০টা! রোদ বাড়তে শুরু করেছে। কাজের ফাঁকে প্রচুর পানি পান করুন। 💧", video: "https://files.catbox.moe/q2vg9i.mp4" },
    "11:00 AM": { text: "🕚 বেলা ১১টা! যোহরের সময় ঘনিয়ে আসছে। কাজের চাপ কমিয়ে একটু রিল্যাক্স হোন। 😊", video: "https://files.catbox.moe/zzm2xo.mp4" },
    "12:00 PM": { text: "🕌 দুপুর ১২টা! যোহরের আযান হতে চললো। নামাজের জন্য নিজেকে প্রস্তুত করুন। ❤️", video: "https://files.catbox.moe/g8d1av.mp4" },
    "01:00 PM": { text: "🍲 দুপুর ১টা! পেট বাবাজি ডাকছে! দুপুরের খাবার খেয়ে একটু জিরিয়ে নিন। 🍚", video: "https://files.catbox.moe/ypt7au.mp4" },
    "02:00 PM": { text: "☀️ দুপুর ২টা! এই সময়টা ঝিমুনির সময়, এক কাপ কফি খেলে মন্দ হয় না! 🤣", video: "https://files.catbox.moe/nstu8b.mp4" },
    "03:00 PM": { text: "🕒 বিকাল ৩টা! দুপুরের ক্লান্তি ঝেড়ে আবার কাজে ফিরুন। সফলতা আপনার আসবেই। 🔥", video: "https://files.catbox.moe/xmrujv.mp4" },
    "04:00 PM": { text: "🕌 বিকাল ৪টা! আসরের আযানের সময়। পবিত্র হয়ে আল্লাহর দরবারে হাজিরা দিন। 🌻", video: "https://files.catbox.moe/jndni6.mp4" },
    "05:00 PM": { text: "🌆 বিকাল ৫টা! পড়ন্ত বিকেল। খোলা বাতাসে একটু হেঁটে আসুন, মন ভালো থাকবে। 🚲", video: "https://files.catbox.moe/dv3qv4.mp4" },
    "06:00 PM": { text: "🌇 সন্ধ্যা ৬টা! মাগরিবের সময়। দিন শেষে ঘরে ফেরার সময়। শান্তিতে সময় কাটুক। 🕌", video: "https://files.catbox.moe/au2yk5.mp4" },
    "07:00 PM": { text: "🕌 সন্ধ্যা ৭টা! এশার আযান হয়ে গেছে। সারাদিনের সব গুনাহের জন্য মাফ চেয়ে নামাজ পড়ুন। ❤️🤲", video: "https://files.catbox.moe/4v4uyv.mp4" },
    "08:00 PM": { text: "🕗 রাত ৮টা! রাতের ডিনারের সময়। পরিবারের সাথে হাসি-খুশিতে খাবার উপভোগ করুন। 🥘", video: "https://files.catbox.moe/ltspa4.mp4" },
    "09:00 PM": { text: "🕘 রাত ৯টা! সারাদিনের ব্যস্ততা শেষ। এবার নিজের জন্য একটু সময় দিন। 📺", video: "https://files.catbox.moe/sxs5io.mp4" },
    "10:00 PM": { text: "😴 রাত ১০টা! মোবাইল রেখে ঘুমানোর প্রস্তুতি নিন। শরীরকে বিশ্রাম দেওয়া খুব জরুরি। 💤", video: "https://files.catbox.moe/0e4s7h.mp4" },
    "11:00 PM": { text: "📱 রাত ১১টা! রিলস দেখা বন্ধ কর ভাই! কাল সকালে তাড়াতাড়ি উঠতে হবে। শুভ রাত্রি! 🌙", video: "https://files.catbox.moe/ndbhtu.mp4" }
  };

  if (!global.__sentMap) global.__sentMap = {};

  setInterval(async () => {
    const timeZone = "Asia/Dhaka";
    const now = moment().tz(timeZone).format("hh:mm A");
    const currentMinute = moment().tz(timeZone).format("HH:mm");

    if (timerData[now] && !global.__sentMap[currentMinute]) {
      global.__sentMap[currentMinute] = true;
      const statusMap = getStatusMap();
      const allThreads = (await api.getThreadList(100, null, ["INBOX"])).filter(t => t.isGroup);

      for (const thread of allThreads) {
        const threadID = thread.threadID;
        if (statusMap[threadID] !== false) {
          try {
            const videoPath = path.join(__dirname, "cache", `auto_${threadID}.mp4`);
            const response = await axios.get(timerData[now].video, { responseType: "arraybuffer" });
            fs.writeFileSync(videoPath, Buffer.from(response.data, "utf-8"));

            api.sendMessage({
              body: timerData[now].text,
              attachment: fs.createReadStream(videoPath)
            }, threadID, () => {
              if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
            });
          } catch (err) {
            console.error("AutoTimer Send Error:", err);
          }
        }
      }
    }
  }, 1000 * 30); // প্রতি ৩০ সেকেন্ডে চেক করবে
};

module.exports.onStart = async function ({ api, event, args }) {
  const statusMap = getStatusMap();
  const threadID = event.threadID;

  if (args[0] === "on") {
    statusMap[threadID] = true;
    saveStatusMap(statusMap);
    return api.sendMessage("✅ এই গ্রুপে অটোটাইমার চালু করা হয়েছে।", threadID);
  } else if (args[0] === "off") {
    statusMap[threadID] = false;
    saveStatusMap(statusMap);
    return api.sendMessage("❌ এই গ্রুপে অটোটাইমার বন্ধ করা হয়েছে।", threadID);
  } else {
    return api.sendMessage("ব্যবহার করতে লিখুন: `autotimer on` অথবা `autotimer off`", threadID);
  }
};
