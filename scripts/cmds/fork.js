exports.config = {
  name: "fork",
  version: "1.3.0",
  author: "EryXenX",
  countDown: 5,
  role: 0,
  shortDescription: "Fork Link (Owner Only with Error)",
  longDescription: "Only owner gets the link, others get an error message.",
  category: "system",
  guide: {
    en: "Type 'fork' or 'repository'"
  }
};

const last = {};
const cool = 10000; 

exports.onStart = async function() {};

exports.onChat = async function({ event, api }) {
  const { threadID, messageID, body, senderID } = event;
  const ownerUID = "61589020949344"; // আপনার UID

  const m = (body || "").toLowerCase().trim();
  if (!m) return;

  const isKeyword = m.includes("fork") || m.includes("repository");

  if (isKeyword) {
    const n = Date.now();
    
    // কুলডাউন চেক (বারবার মেসেজ দিয়ে বিরক্ত করা রোধ করতে)
    if (last[threadID] && n - last[threadID] < cool) return;
    last[threadID] = n;

    // যদি ইউজার আপনি হন
    if (senderID === ownerUID) {
      return api.sendMessage(
        `🔗 𝗚𝗶𝘁𝗛𝘂𝗯 𝗙𝗼𝗿𝗸 𝗟𝗶𝗻𝗸:\nhttps://github.com/EryXenX/GoatBot-Pro.git\n\n🎬 𝗦𝗲𝘁𝘂𝗽 𝗧𝘂𝘁𝗼𝗿𝗶𝗮𝗹 👇🏼\n(আপনার লিংক)`,
        threadID,
        messageID
      );
    } 
    // যদি অন্য কেউ হয় তবে এই এরর মেসেজটি যাবে
    else {
      return api.sendMessage(
        `❌ Access Denied!\n\nএই কমান্ডটি শুধুমাত্র বোটের মেইন মালিকের (Owner) জন্য সংরক্ষিত। আপনার এই লিংকটি পাওয়ার অনুমতি নেই।`,
        threadID,
        messageID
      );
    }
  }
};
