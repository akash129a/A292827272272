const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "ppall",
    version: "2.0.0",
    author: "Akash", // অথর পরিবর্তন করে Akash করে দেওয়া হয়েছে
    countDown: 3,
    role: 0,
    shortDescription: "View profile pictures of everyone in the group chat 👥",
    longDescription: "View profile pictures of all group chat members, or specific mentioned/listed users.",
    category: "media",
    guide: {
      en: "{pn} [all / everyone / @mention / list of UIDs]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const cacheDir = path.join(__dirname, "cache");
    const threadID = event.threadID;

    try {
      await fs.ensureDir(cacheDir);

      let uids = [];

      // Case A: Reply to a message (gets the sender of the replied message)
      if (event.type === "message_reply") {
        uids.push(event.messageReply.senderID);
      } 
      // Case B: Mentions present (fetch profile pictures of all mentioned users)
      else if (Object.keys(event.mentions || {}).length > 0) {
        uids = Object.keys(event.mentions);
      } 
      // Case C: Explicit UIDs or "all" / "everyone" in args
      else if (args.length > 0) {
        if (["all", "everyone", "ppall", "@all", "@everyone"].includes(args[0].toLowerCase())) {
          let threadInfo;
          try {
            threadInfo = await api.getThreadInfo(threadID);
          } catch (e) {
            threadInfo = null;
          }
          uids = event.participantIDs || (threadInfo ? threadInfo.participantIDs : []);
        } else {
          // Treat args as raw UIDs
          uids = args.filter(arg => /^\d+$/.test(arg));
        }
      } 
      // Case D: Default with no args - fetch all participants in the group
      else {
        let threadInfo;
        try {
          threadInfo = await api.getThreadInfo(threadID);
        } catch (e) {
          threadInfo = null;
        }
        uids = event.participantIDs || (threadInfo ? threadInfo.participantIDs : []);
      }

      // Filter out duplicates and invalid IDs
      uids = [...new Set(uids)].filter(id => id && id !== "0" && id !== "1");

      if (uids.length === 0) {
        return api.sendMessage("⚠️ Could not find any valid user IDs to retrieve profile pictures for.", threadID, event.messageID);
      }

      api.sendMessage(`📸 [ppall] Downloading ${uids.length} profile pictures. Please wait...`, threadID, event.messageID);

      const attachments = [];
      const tempFiles = [];

      // Download images concurrently
      for (const uid of uids) {
        try {
          const cachePath = path.join(cacheDir, `ppall_${uid}_${Date.now()}.png`);
          const imageUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
          
          const response = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 10000 });
          await fs.writeFile(cachePath, response.data);
          
          attachments.push(fs.createReadStream(cachePath));
          tempFiles.push(cachePath);
        } catch (e) {
          console.error(`[ppall] Failed to fetch UID ${uid}:`, e.message);
        }
      }

      if (attachments.length === 0) {
        return api.sendMessage("❌ Failed to download any profile pictures.", threadID, event.messageID);
      }

      // Send the attachments in small batches of 5 to respect Messenger wrapper/API limits
      const chunkSize = 5;
      for (let i = 0; i < attachments.length; i += chunkSize) {
        const chunk = attachments.slice(i, i + chunkSize);
        await api.sendMessage(
          {
            body: `📸 [ppall] Profile Pictures (Part ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(attachments.length / chunkSize)}):`,
            attachment: chunk
          },
          threadID
        );
      }

      // Cleanup temporary files after a short delay to ensure stream processes completely
      setTimeout(() => {
        tempFiles.forEach(file => {
          fs.remove(file).catch(err => console.error("[ppall] Cleanup error:", err.message));
        });
      }, 7000);

    } catch (err) {
      console.error("[ppall]", err.message);
      api.sendMessage("⚠️ Failed to execute ppall command. Please try again.", threadID, event.messageID);
    }
  }
};
