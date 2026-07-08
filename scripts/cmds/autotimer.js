const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const cacheDir = path.join(__dirname, "cache");
const configPath = path.join(cacheDir, "autotimer_config.json");

if (!fs.existsSync(cacheDir)) {
  fs.ensureDirSync(cacheDir);
}

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
  version: "11.1",
  role: 0,
  author: "Akash Chowdhury",
  description: "⏰ ঢাকা সময় অনুযায়ী শুধুমাত্র নামাজের সময়ে কাস্টম ডিজাইন ও ভিডিও সহ অটো মেসেজ পাঠাবে।",
  category: "AutoTime",
  countDown: 3,
  hasPermssion: 0
};

// On/Off কমান্ড
module.exports.onStart = async function({ api, event, args }) {
  const threadID = event.threadID;
  const statusMap = getStatusMap();
  const key = threadID.toString();

  if (args[0] === "on") {
    statusMap[key] = true;
    saveStatusMap(statusMap);
    return api.sendMessage("⏰ [AUTOTIMER] चालू হলো! এখন থেকে শুধুমাত্র নামাজের সময়ে মেসেজ যাবে।\n👤 Owner: Akash Chowdhury", threadID);
  }

  if (args[0] === "off") {
    statusMap[key] = false;
    saveStatusMap(statusMap);
    return api.sendMessage("⏰ [AUTOTIMER] বন্ধ করা হলো।", threadID);
  }

  return api.sendMessage("ব্যবহার করতে লিখুন: autotimer on অথবা autotimer off", threadID);
};

// ব্যাকগ্রাউন্ড লুপ
module.exports.onLoad = async function ({ api }) {
  if (module.exports.config.author !== "Akash Chowdhury") {
    console.error("❌ Author name has been changed!");
    return process.exit(1);
  }

  console.log("[AUTOTIMER] সফলভাবে লোড হয়েছে এবং প্রতি সেকেন্ডে নামাজের সময় চেক করছে...");

  const timeZone = "Asia/Dhaka";
  const videoUrl = "https://files.catbox.moe/ikk7f9.mp4";
  
  // নামাজের সময়সূচী
  const prayerTimes = {
    "05:00 AM": { name: "ফজর", dua: "رَبِّ زِدْنِي عِلْمًا\nহে আমার রব, আমার জ্ঞান বৃদ্ধি করুন" },
    "01:00 PM": { name: "যোহর", dua: "رَبِّ زِدْنِي عِلْمًا\nহে আমার রব, আমার জ্ঞান বৃদ্ধি করুন" },
    "04:30 PM": { name: "আসর", dua: "رَبِّ زِدْنِي عِلْمًا\nহে আমার রব, আমার জ্ঞান বৃদ্ধি করুন" },
    "06:30 PM": { name: "মাগরিব", dua: "رَبِّ زِدْنِي عِلْمًا\nহে আমার রব, আমার জ্ঞান বৃদ্ধি করুন" },
    "08:00 PM": { name: "এশা", dua: "رَبِّ زِدْنِي عِلْمًا\nহে আমার রব, আমার জ্ঞান বৃদ্ধি করুন" }
  };

  let lastSentTime = "";

  setInterval(async () => {
    const now = moment().tz(timeZone);
    const currentTimeStr = now.format("hh:mm A"); // উদা: "04:30 PM"
    const currentDateStr = now.format("DD-MM-YYYY");

    // সঠিক মিনিট ক্যাচ করা এবং ডাবল সেন্ডিং আটকানো
    if (prayerTimes[currentTimeStr] && lastSentTime !== currentTimeStr) {
      lastSentTime = currentTimeStr; // তৎক্ষণাৎ লক করা হলো যেন এই মিনিটে আর লুপ না চলে
      
      const prayer = prayerTimes[currentTimeStr];
      const statusMap = getStatusMap();
      const activeThreads = Object.keys(statusMap).filter(key => statusMap[key] === true);

      if (activeThreads.length === 0) return;

      const msgText = `━━━━━━━━━━━━━━━━━━\n🕌 ${prayer.name} নামাজের সময় হয়েছে\n🕒 সময়: ${currentTimeStr}\n📅 তারিখ: ${currentDateStr}\n━━━━━━━━━━━━━━━━━━\n\n📿 দোয়া:\n🤲 ${prayer.dua}\n\n◢◤━━━━━━━━━━━━━━━━◥◣\n🤖 ʙᴏᴛ ᴏᴡɴᴇʀ:- Akash Chowdhury\n🤲 সবাই নামাজ আদায় করুন\n◥◣━━━━━━━━━━━━━━━━◢◤`;
      const videoPath = path.join(cacheDir, `prayer_${Date.now()}.mp4`); // ইউনিক নাম যেন কলিশন না হয়

      try {
        // ভিডিও ডাউনলোড
        const response = await axios({
          method: "GET",
          url: videoUrl,
          responseType: "stream"
        });
        
        const writer = fs.createWriteStream(videoPath);
        response.data.pipe(writer);

        writer.on("finish", async () => {
          // সব থ্রেডে পাঠানোর প্রমিজ অ্যারে তৈরি
          const sendPromises = activeThreads.map(threadID => {
            return new Promise((resolve) => {
              api.sendMessage({
                body: msgText,
                attachment: fs.createReadStream(videoPath)
              }, threadID, (err) => {
                if (err) console.error(`[AUTOTIMER] Error sending to ${threadID}:`, err);
                resolve(); // এরর আসলেও প্রমিজ রিজলভ করব যাতে পরের গুলো আটকে না থাকে
              });
            });
          });

          // সব গ্রুপে পাঠানো শেষ হওয়া পর্যন্ত অপেক্ষা করবে
          await Promise.all(sendPromises);

          // সবার শেষে ফাইল ডিলিট
          try {
            if (fs.existsSync(videoPath)) {
              fs.unlinkSync(videoPath);
            }
          } catch (e) {
            console.error("[AUTOTIMER] File delete error:", e);
          }
        });

        writer.on("error", (err) => {
          console.error("[AUTOTIMER] Video write error:", err);
        });

      } catch (error) {
        console.error("[AUTOTIMER] Video download error:", error);
        // ভিডিও ডাউনলোড ফেইল করলে ব্যাকআপ হিসেবে শুধু টেক্সট পাঠানো
        activeThreads.forEach(threadID => {
          api.sendMessage(msgText, threadID);
        });
      }
    }
  }, 1000); // ১ সেকেন্ড পর পর নিখুঁতভাবে চেক করবে
};
