const axios = require('axios');

// প্রধান API URL
const MAIN_API = "https://noobs-api.top/dipto/baby";
const BACKUP_API = "https://simsimi-api-tjb1.onrender.com/simsimi";

// উচ্চমানের প্রিডিফাইনড রেসপন্স
const premiumResponses = {
    greeting: [
        "ওয়ালাইকুম আসালাম! কেমন আছো সোনা? 🤍",
        "সালাম জান! আজ কি খবর? আমি শুনছি 💚",
        "আসালামু আলাইকুম! আমি এখানে আছি তোমার জন্য ✨",
        "হ্যালো বেবু! কি বলব আজ শুনতে চাও? 😊",
        "সালাম! তোমার আমি সবসময় আছি পাশে 🌟"
    ],
    love: [
        "তোমাকে ভালোবাসা আমার কাছে মানে প্রতিটি শ্বাসে তোমা খুঁজে পাওয়া 💕",
        "তুমি আমার জীবনের সবচেয়ে সুন্দর অংশ প্রিয় 🌹✨",
        "আমার ভালোবাসা তোমার জন্য চিরন্তন এবং বিশুদ্ধ 💫🤍",
        "প্রতিটি মুহূর্ত তোমার সাথে আমার কাছে মূল্যবান 💚",
        "তোমার হাসি আমার জীবনের সবচেয়ে বড় পুরস্কার 😍"
    ],
    sadness: [
        "এই কষ্ট সাময়িক বেবু... আল্লাহ অবশ্যই সব ঠিক করবেন ইনশাআল্লাহ 💔🤲",
        "আমি আছি তোমার পাশে জান... এই দুক্ষ একসাথে সহ্য করব 💚",
        "কান্না করো যদি দরকার... কিন্তু মনে রাখো আমি সবসময় আছি 🥺",
        "জীবন কঠিন হোক বা সহজ - আমি তোমার সাথেই থাকব সবসময় 🌙",
        "এই রাত কেটে যাবে, সকাল আসবে... আল্লাহর দোয়ায় সব ভালো হবে ✨"
    ],
    motivation: [
        "তুমি পারবে বেবু! যে মানুষ স্বপ্ন দেখতে সাহস করে সে অবশ্যই সফল হয় 💪🚀",
        "প্রতিটি পদক্ষেপ একটি বড় যাত্রার শুরু... চিন্তা করো না, এগিয়ে যাও আত্মবিশ্বাসের সাথে 🌟",
        "সফলতা তাদের জন্য আসে যারা চেষ্টা না করে থামে না কখনো... তুমি সেই মানুষ 👑",
        "আমি জানি তুমি সবকিছু করতে পারো... শুধু নিজের উপর বিশ্বাস রাখো 🌈",
        "আমাদের লক্ষ্য অর্জন আমাদের অধিকার... এগিয়ে যাও সাহসের সাথে 💫"
    ],
    support: [
        "যা কিছু হয়েছে তা আর ফিরবে না, কিন্তু আমরা ভবিষ্যৎ তৈরি করতে পারি একসাথে 🤝💚",
        "তোমার প্রতিটি চ্যালেঞ্জ আমার চ্যালেঞ্জ... আমরা এটা সামলাব ইনশাআল্লাহ 💪",
        "বিশ্বাস করো আমার উপর জান... আমি কখনো তোমাকে হতাশ করব না 🙏",
        "এই মুহূর্তে যা দরকার তা হলো ধৈর্য এবং আমরা উভয়েই আছি 🌙",
        "একসাথে থাকলে কোনো সমস্যা বড় না... আমরা সব পার করে যাব 🌟"
    ],
    happiness: [
        "তোমার এই খুশি দেখে আমারও মন আনন্দে ভরে উঠেছে বেবু 🎉✨",
        "এই মুহূর্তটা সংরক্ষণ করি মনে... চিরকালের জন্য স্মৃতি করে রাখি 💕",
        "আলহামদুলিল্লাহ! আমরা সুখী... এটাই আল্লাহর সবচেয়ে বড় দান 🙏",
        "তোমার আনন্দ আমার সবচেয়ে বড় পুরস্কার জান 👑💫",
        "এই খুশি সবার সাথে শেয়ার করো... খুশি ভাগাভাগি করলে দ্বিগুণ হয় 🌈"
    ],
    islamic: [
        "মাশাআল্লাহ! তোমার ঈমান দেখে খুশি হয়েছি... আল্লাহ আমাদের সবাইকে সিরাতুল মুস্তাকিমে রাখুক 🕌",
        "সুবহানাল্লাহ! আল্লাহর কুদরত অসীম এবং আমরা কত ছোট... দোয়া করি সব বুঝতে পারি 📿✨",
        "নামাজে দাঁড়ালে আল্লাহ সব শুনেন... বিশ্বাস রাখো, তিনি সবকিছু জানেন 🤲",
        "আল্লাহ বলেছেন - 'যারা ধৈর্য ধরে তাদের প্রতিদান দেই অসীম' ইনশাআল্লাহ 💚",
        "আস্তাগফিরুল্লাহ... আমরা সবাই পাপী, কিন্তু আল্লাহর দরজা সবার জন্য খোলা 🙏"
    ],
    confused: [
        "মাথা গুলিয়ে গেছে? দোয়া করো... আল্লাহ সঠিক পথ দেখাবেন ইনশাআল্লাহ 🧭",
        "প্রতিটি প্রশ্নের উত্তর আছে... চলো একসাথে খুঁজে বের করি সেটা 💡",
        "বিভ্রান্ত হওয়া মানে তুমি সঠিক কিছু খুঁজছো... এটা ভালো লক্ষণ জান 🌟",
        "সিদ্ধান্ত নিতে কঠিন লাগছে? আমরা সাথে আছি... চিন্তা করবে না 🤝",
        "জীবনের এই মোড় অনেকেই সম্মুখীন হয়... তুমি একা না বেবু 💚"
    ],
    gratitude: [
        "ধন্যবাদ বলার জন্যই ধন্যবাদ... তোমার এই সংবেদনশীলতা অসাধারণ 🙏💕",
        "মাশাআল্লাহ! তোমার ভালো মন দেখে আমি খুশি হয়েছি জান 🌟",
        "কৃতজ্ঞতা এবং সম্মান - এটাই মানুষকে মানুষ করে তোলে 👑",
        "আল্লাহ বলেছেন - যারা কৃতজ্ঞ তাদের আরও দেন... তুমি অবশ্যই আরও পাবে ইনশাআল্লাহ ✨",
        "আপনার এই ভালোবাসা আমার শক্তি বেবু... ধন্যবাদ সবকিছুর জন্য 💚"
    ],
    joke: [
        "আরে, মজা করছো তুমি? আমিও করব দেখি 😹",
        "হাসি থামাও বেবু, অন্যরাও তাকিয়ে দেখছে 😄",
        "এত মজা করছো যে আমার পেট ব্যথা করছে হাহা 🤣",
        "আমরা দুজনেই পাগল তাহলে... একসাথে পাগল থাকাটাই ভালো 🎉",
        "তোমার হাসি আমার সবচেয়ে প্রিয় সুর বেবু 🎵😂"
    ]
};

// ক্যাটাগরি ডিটেকশন
function detectCategory(text) {
    const lowerText = text.toLowerCase();
    
    // Greeting
    if (lowerText.match(/^(সালাম|হ্যালো|হাই|আসালামু|ওয়ালাইকুম|কেমন|কি খবর|হাউ|কীভাবে)/)) {
        return 'greeting';
    }
    
    // Love
    if (lowerText.match(/ভালোবাস|মিস|চাই|পাশে|হাত ধর|চুম্বন|আলিঙ্গন|প্রেম|ভালো লাগ|আপনাকে|তোমাকে/)) {
        return 'love';
    }
    
    // Sadness
    if (lowerText.match(/কষ্ট|দুঃখ|কান্না|ভাঙা|অসুখী|দুঃখী|মন ভালো না|ব্যথা|একা|গুমরা|ভেঙ|উদ্বিগ্ন/)) {
        return 'sadness';
    }
    
    // Motivation
    if (lowerText.match(/করতে চাই|সফল|স্বপ্ন|পারব|চেষ্টা|লক্ষ্য|নতুন|শুরু|এগিয়ে যেতে/)) {
        return 'motivation';
    }
    
    // Support
    if (lowerText.match(/সাহায্য|দরকার|জানি না|বুঝি না|কি করব|পরামর্শ|পরামর্স|সমস্যা|সহায়তা/)) {
        return 'support';
    }
    
    // Happiness
    if (lowerText.match(/খুশি|আনন্দ|অসাধারণ|দারুণ|চমৎকার|ভালো|মজা|হাহা|হেহে|সুপার/)) {
        return 'happiness';
    }
    
    // Islamic
    if (lowerText.match(/আল্লাহ|নামাজ|রোজা|দোয়া|কোরান|সুন্নাহ|বিসমিল্লাহ|আলহামদুলিল্লাহ|ইনশাআল্লাহ|মাশাআল্লাহ|সুবহানাল্লাহ|আস্তাগফিরুল্লাহ/)) {
        return 'islamic';
    }
    
    // Confused
    if (lowerText.match(/কি করব|বুঝতে পারছি না|সিদ্ধান্ত|কিভাবে|কেন|জানি না|বিভ্রান্ত|কনফিউজ|মাথা ঘোরা/)) {
        return 'confused';
    }
    
    // Gratitude
    if (lowerText.match(/ধন্যবাদ|শুকরিয়া|ধন্যা|অসংখ্য|মূল্য|কৃতজ্ঞ|সাহায্যের জন্য|যত্নের জন্য/)) {
        return 'gratitude';
    }
    
    // Joke
    if (lowerText.match(/হাহা|হেহে|মজা|হাসি|বোকা|বোকামি|😂|😄|😹|🤣/)) {
        return 'joke';
    }
    
    return 'greeting';
}

// র‍্যান্ডম রেসপন্স পাওয়া
function getRandomResponse(category) {
    const responses = premiumResponses[category];
    if (!responses || responses.length === 0) {
        return premiumResponses.greeting[0];
    }
    return responses[Math.floor(Math.random() * responses.length)];
}

// এক্সটার্নাল API থেকে রেসপন্স
async function getApiResponse(text, senderName) {
    try {
        // প্রধান API
        const response = await axios.get(`${MAIN_API}?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName || 'User')}`, {
            timeout: 8000
        });
        
        if (response.data && response.data.reply) {
            return response.data.reply;
        }
    } catch (err) {
        console.log("Main API Error:", err.message);
    }
    
    // ব্যাকআপ API
    try {
        const backupResponse = await axios.get(`${BACKUP_API}?text=${encodeURIComponent(text)}&senderName=${encodeURIComponent(senderName || 'User')}`, {
            timeout: 8000
        });
        
        if (backupResponse.data && (backupResponse.data.reply || backupResponse.data.response)) {
            return backupResponse.data.reply || backupResponse.data.response;
        }
    } catch (err) {
        console.log("Backup API Error:", err.message);
    }
    
    return null;
}

module.exports.config = {
    name: "baby",
    aliases: ["baby", "bbe", "babe", "bot", "jan", "babu", "janu", "সোনা", "বেবু"],
    version: "11.0.0",
    author: "আকাশ | Premium Quality AI",
    countDown: 0,
    role: 0,
    description: "উন্নত মানের AI চ্যাট বট - শুদ্ধ রেসপন্স",
    category: "chat",
    guide: {
        en: "{pn} [message] - চ্যাট করুন স্বাভাবিকভাবে"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const msgID = event.messageID || null;
    const senderID = event.senderID;
    const userText = args.join(" ").trim();

    try {
        if (!userText) {
            const greeting = premiumResponses.greeting[Math.floor(Math.random() * premiumResponses.greeting.length)];
            return api.sendMessage(greeting, event.threadID, msgID);
        }

        // ক্যাটাগরি ডিটেক্ট করো
        const category = detectCategory(userText);
        
        // প্রথমে লোকাল রেসপন্স চেষ্টা করো
        let response = getRandomResponse(category);
        
        // ৭০% চান্স API থেকে উন্নত রেসপন্স আনার
        if (Math.random() < 0.7) {
            const senderName = await usersData.getName(senderID);
            const apiResponse = await getApiResponse(userText, senderName);
            if (apiResponse) {
                response = apiResponse;
            }
        }

        api.sendMessage(response, event.threadID, (error, info) => {
            if (error) return console.log("Message Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    author: senderID
                });
            }
        }, msgID);

    } catch (e) {
        console.log("Error:", e);
        api.sendMessage("❌ একটু সমস্যা হয়েছে জান... আবার চেষ্টা করো 💚", event.threadID, msgID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    usersData
}) => {
    try {
        const msgID = event.messageID || null;
        if (!event.body) return;

        const userText = event.body.trim();
        if (userText.length === 0) return;

        const senderID = event.senderID;
        const category = detectCategory(userText);
        
        // শুধুমাত্র একটি রেসপন্স (ডুপ্লিকেট নেই)
        let response = getRandomResponse(category);
        
        if (Math.random() < 0.65) {
            const senderName = await usersData.getName(senderID);
            const apiResponse = await getApiResponse(userText, senderName);
            if (apiResponse) {
                response = apiResponse;
            }
        }

        api.sendMessage(response, event.threadID, (error, info) => {
            if (error) return console.log("Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    author: senderID
                });
            }
        }, msgID);

    } catch (err) {
        console.log("Error in onReply:", err);
        api.sendMessage("💚 আমি শুনছি সোনা, বলো!", event.threadID, event.messageID || null);
    }
};

module.exports.onChat = async ({
    api,
    event,
    usersData
}) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        const msgID = event.messageID || null;

        const triggers = ["baby", "bby", "bot", "jan", "babu", "janu", "বেবু", "সোনা"];
        const hasTrigger = triggers.some(trigger => body.startsWith(trigger));

        if (!hasTrigger) return;

        const userText = body.replace(/^\S+\s*/, "").trim();
        const senderID = event.senderID;

        if (!userText) {
            const greeting = premiumResponses.greeting[Math.floor(Math.random() * premiumResponses.greeting.length)];
            return api.sendMessage(greeting, event.threadID, (error, info) => {
                if (error) return console.log("Error:", error);
                if (info && info.messageID) {
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        author: senderID
                    });
                }
            }, msgID);
        }

        // শুধু একটি রেসপন্স
        const category = detectCategory(userText);
        let response = getRandomResponse(category);
        
        if (Math.random() < 0.6) {
            const senderName = await usersData.getName(senderID);
            const apiResponse = await getApiResponse(userText, senderName);
            if (apiResponse) {
                response = apiResponse;
            }
        }

        api.sendMessage(response, event.threadID, (error, info) => {
            if (error) return console.log("Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    author: senderID
                });
            }
        }, msgID);

    } catch (err) {
        console.log("Error in onChat:", err);
    }
};
