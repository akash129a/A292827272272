const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// কনফিগারেশন ফাইল পাথ
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
  version: "6.5",
  role: 0, 
  author: "Akash Chowdhury",
  description: "⏰ প্রতি ঘণ্টায় নতুন ভিডিওসহ অটো মেসেজ পাঠাবে (On/Off সিস্টেমসহ)",
  category: "AutoTime",
  countDown: 3,
};

module.exports.onLoad = async function ({ api }) {
  // Author lock check
  if (module.exports.config.author !== "Akash Chowdhury") {
    console.error("❌ Author name has been changed. The file will not run.");
    return process.exit(1);
  }

  // আপনার দেওয়া ১২টি ভিডিও লিঙ্ক এখানে সেট করা হয়েছে
  const timerData = {
    "12:00 AM": { text: "🌙 রাত ১২টা বাজে! অনেক রাত হলো, এবার ঘুমানো দরকার।", video: "https://files.catbox.moe/tf2wix.mp4" },
    "01:00 AM": { text: "💤 রাত ১টা বাজে! এখনও জেগে আছেন কেন? ঘুমান!", video: "https://files.catbox.moe/knidwi.mp4" },
    "02:00 AM": { text: "🌌 রাত ২টা বাজে! চারপাশ খুব শান্ত, শুভ রাত্রি।", video: "https://files.catbox.moe/g0mifl.mp4" },
    "03:00 AM": { text: "🕌 রাত ৩টা বাজে! তাহাজ্জুদের সময় হয়ে গেছে।", video: "https://files.catbox.moe/qleixe.mp4" },
    "04:00 AM": { text: "🌅 ভোর ৪টা বাজে! ফজরের জন্য প্রস্তুতি নিন।", video: "https://files.catbox.moe/udao5p.mp4" },
    "05:00 AM": { text: "🕌 ভোর ৫টা বাজে! ফজরের আজান হয়ে গেছে। নামাজ পড়ুন।", video: "https://files.catbox.moe/beiu9p.mp4" },
    "06:00 AM": { text: "☀️ সকাল ৬টা বাজে! শুভ সকাল। দিনটি ভালো কাটুক।", video: "https://files.catbox.moe/dyopmh.mp4" },
    "07:00 AM": { text: "🍳 সকাল ৭টা বাজে! নাস্তা করে নিন।", video: "https://files.catbox.moe/de8utb.mp4" },
    "08:00 AM": { text: "💼 সকাল ৮টা বাজে! কাজের সময় হয়ে গেলো।", video: "https://files.catbox.moe/vz971z.mp4" },
    "09:00 AM": { text: "☕ সকাল ৯টা বাজে! এক কাপ চা খান আর কাজে মন দিন।", video: "https://files.catbox.moe/vz971z.mp4" },
    "10:00 AM": { text: "🕙 সকাল ১০টা বাজে! আপনার সকালের ব্যস্ততা কেমন চলছে?", video: "https://files.catbox.moe/v90l1g.mp4" },
    "11:00 AM": { text: "🕚 বেলা ১১টা বাজে! রোদ অনেক কড়া, সাবধানে থাকুন।", video: "https://files.catbox.moe/2jyp2x.mp4" },
    
    // দুপুরের পর থেকে লিঙ্কগুলো আবার রিপিট করা হয়েছে (২৪ ঘণ্টা কভার করার জন্য)
    "12:00 PM": { text: "🕛 দুপুর ১২টা বাজে! যোহরের নামাজের সময়।", video: "https://files.catbox.moe/tf2wix.mp4" },
    "01:00 PM": { text: "🍛 দুপুর ১টা বাজে! দুপুরের খাবারের সময় হয়েছে।", video: "https://files.catbox.moe/knidwi.mp4" },
    "02:00 PM": { text: "🕑 দুপুর ২টা বাজে! কিছুক্ষণ বিশ্রাম নিতে পারেন।", video: "https://files.catbox.moe/g0mifl.mp4" },
    "03:00 PM": { text: "🕒 দুপুর ৩টা বাজে! কাজের ফাঁকে বিরতি নিন।", video: "https://files.catbox.moe/qleixe.mp4" },
    "04:00 PM": { text: "🕓 বিকাল ৪টা বাজে! আসরের নামাজের সময়।", video: "https://files.catbox.moe/udao5p.mp4" },
    "05:00 PM": { text: "🕔 বিকাল ৫টা বাজে! একটু রিফ্রেশ হয়ে নিন।", video: "https://files.catbox.moe/beiu9p.mp4" },
    "06:00 PM": { text: "🕕 সন্ধ্যা ৬টা বাজে! মাগরিবের নামাজের সময়।", video: "https://files.catbox.moe/dyopmh.mp4" },
    "07:00 PM": { text: "🕖 সন্ধ্যা ৭টা বাজে! পড়াশোনা বা পরিবারকে সময় দিন।", video: "https://files.catbox.moe/de8utb.mp4" },
    "08:00 PM": { text: "🕗 রাত ৮টা বাজে! এশার নামাজের সময় হয়েছে।", video: "https://files.catbox.moe/vz971z.mp4" },
    "09:00 PM": { text: "🕘 রাত ৯টা বাজে! রাতের খাবারের সময়।", video: "https://files.catbox.moe/vz971z.mp4" },
    "10:00 PM": { text: "🕙 রাত ১০টা বাজে! ঘুমানোর প্রস্তুতি নিন।", video: "https://files.catbox.moe/v90l1g.mp4" },
    "11:00 PM": { text: "🕚 রাত ১১টা বাজে! সারাদিনের কাজের ক্লান্তি দূর হোক।", video: "https://files.catbox.moe/2jyp2x.mp4" }
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
        if (statusMap[thread.threadID] !== false) { // Default true (On)
          try {
            const videoPath = path.join(__dirname, "cache", `autotimer_${thread.threadID}.mp4`);
            const getVid = (await axios.get(timerData[now].video, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(videoPath, Buffer.from(getVid, "utf-8"));

            api.sendMessage({
              body: timerData[now].text,
              attachment: fs.createReadStream(videoPath)
            }, thread.threadID, () => {
              fs.unlinkSync(videoPath);
            });
          } catch (e) {
            console.error("Error sending auto message:", e);
          }
        }
      }
    }
  }, 1000 * 30); // প্রতি ৩০ সেকেন্ড পর চেক করবে
};

module.exports.run = async function ({ api, event, args }) {
  const statusMap = getStatusMap();
  const threadID = event.threadID;

  if (args[0] === "on") {
    statusMap[threadID] = true;
    saveStatusMap(statusMap);
    return api.sendMessage("✅ এই গ্রুপে অটোটাইমার অন করা হয়েছে।", threadID);
  } else if (args[0] === "off") {
    statusMap[threadID] = false;
    saveStatusMap(statusMap);
    return api.sendMessage("❌ এই গ্রুপে অটোটাইমার অফ করা হয়েছে।", threadID);
  } else {
    return api.sendMessage("ব্যবহারবিধি: `autotimer on` অথবা `autotimer off` লিখুন।", threadID);
  }
};
