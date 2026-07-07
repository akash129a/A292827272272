exports.config = {
  name: "fork",
  version: "1.0.0",
  author: "EryXenX",
  countDown: 0,
  role: 1, // Admin Only
  shortDescription: "Fork Link",
  longDescription: "Responds with GitHub repo link when 'fork' or 'repository' is mentioned. Cooldown: 10 seconds. Admin only.",
  category: "system",
  guide: {
    en: "Type 'fork' or 'repository' (Admin Only)"
  }
};

const last = {};
const cool = 10000;

exports.onStart = async function(){};

exports.onChat = async function({ event: z, api: y, threadsData }) {
  const t = z.threadID;
  const n = Date.now();
  
  // Cooldown check
  if(last[t] && n - last[t] < cool) return;

  const m = (z.body || "").toLowerCase().trim();
  if(!m) return;

  const fork = m.includes("fork") || m.includes("repository");

  if(fork){
    // থ্রেড ডেটা থেকে চেক করা হচ্ছে মেসেজ প্রদানকারী অ্যাডমিন কি না
    const threadInfo = await threadsData.get(t);
    const adminIDs = threadInfo.adminIDs || [];
    const isGroupAdmin = adminIDs.includes(z.senderID);

    // যদি ইউজার গ্রুপের অ্যাডমিন না হয় (এবং বটের গ্লোবাল অ্যাডমিনও না হয়)
    if (!isGroupAdmin) {
      return y.sendMessage("❌ এই কমান্ডটি শুধুমাত্র গ্রুপের অ্যাডমিনদের জন্য!", t, z.messageID);
    }

    y.sendMessage(
`🔗 𝗚𝗶𝘁𝗛𝘂𝗯 𝗙𝗼𝗿𝗸 𝗟𝗶𝗻𝗸:
https://github.com/EryXenX/GoatBot-Pro.git

🎬 𝗦𝗲𝘁𝘂𝗽 𝗧𝘂𝘁𝗼𝗿𝗶𝗮𝗹 👇🏼
https://youtu.be/gPf_BFhQz_w?si=T1N6sB2DefeTGq2R`,
      t,
      z.messageID
    );

    last[t] = n;
  }
};
