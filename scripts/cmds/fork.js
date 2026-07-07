exports.config = {
  name: "fork",
  version: "1.1.0",
  author: "EryXenX",
  countDown: 10,
  role: 1, // ১ মানে অ্যাডমিনদের জন্য
  shortDescription: "Fork Link",
  longDescription: "Responds with GitHub repo link when 'fork' or 'repository' is mentioned. Admin only.",
  category: "system",
  guide: {
    en: "Type 'fork' or 'repository' (Admin Only)"
  }
};

const last = {};
const cool = 10000; // ১০ সেকেন্ড কুলডাউন

exports.onStart = async function() {};

exports.onChat = async function({ event, api }) {
  const { threadID, messageID, body, role } = event;
  const n = Date.now();

  // যদি ইউজার অ্যাডমিন না হয় (role 0 মানে সাধারণ ইউজার) তবে রিটার্ন করবে
  if (role < 1) return;

  const m = (body || "").toLowerCase().trim();
  if (!m) return;

  const isKeyword = m.includes("fork") || m.includes("repository");

  if (isKeyword) {
    // কুলডাউন চেক
    if (last[threadID] && n - last[threadID] < cool) return;

    const message = `🔗 𝗚𝗶𝘁𝗛𝘂𝗯 𝗙𝗼𝗿𝗸 𝗟𝗶𝗻𝗸:
https://github.com/EryXenX/GoatBot-Pro.git

🎬 𝗦𝗲𝘁𝘂𝗽 𝗧𝘂𝘁𝗼𝗿𝗶𝗮𝗹 👇🏼
https://youtube.com/c/EryXenX`;

    api.sendMessage(message, threadID, messageID);

    // কুলডাউন আপডেট
    last[threadID] = n;
  }
};
