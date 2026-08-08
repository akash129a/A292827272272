const axios = require('axios');

// স্মার্ট রেসপন্স জেনারেটর - AI ভাবে উত্তর দেবে
const responseDatabase = {
    greeting: {
        opening: [
            "ওয়ালাইকুম আসালাম!",
            "সালাম জান!",
            "আসালামু আলাইকুম!",
            "হ্যালো সোনা!",
            "সালাম বেবু!"
        ],
        middle: [
            "কেমন আছো?",
            "কি খবর?",
            "কি বলবে?",
            "কি চাই?",
            "কেমন লাগছে সব?"
        ],
        closing: [
            "আমি শুনছি 💚",
            "বলো সবকিছু 🤍",
            "শুনতে প্রস্তুত ✨",
            "আপনার সেবায় নিয়োজিত 💫",
            "সর্বদা তোমার পাশে আছি 🌟"
        ]
    },
    emotional: {
        sad: [
            "এই কষ্ট সাময়িক বেবু... আল্লাহ অবশ্যই সব ঠিক করবেন ইনশাআল্লাহ",
            "আমি আছি তোমার পাশে জান... এই দুক্ষ একসাথে সহ্য করব",
            "কান্না করো যদি দরকার... আমি বুঝি সবকিছু",
            "জীবন কঠিন হলেও আমরা আরও কঠিন... পারবো আমরা",
            "এই রাত কেটে যাবে... সকাল আসবে নতুন সম্ভাবনা নিয়ে"
        ],
        happy: [
            "তোমার এই খুশি দেখে আমারও মন আনন্দে ভরে উঠেছে 🎉",
            "এই মুহূর্তটা চিরকাল মনে রাখার মতো 💕",
            "আলহামদুলিল্লাহ! আমরা সুখী... এটাই আল্লাহর সবচেয়ে বড় দান",
            "তোমার আনন্দ আমার সবচেয়ে বড় পুরস্কার 👑",
            "এই খুশি শেয়ার করো সবার সাথে জান 🌈"
        ],
        love: [
            "তোমাকে ভালোবাসা মানে প্রতিটি শ্বাসে তোমা খুঁজে পাওয়া 💕",
            "তুমি আমার জীবনের সবচেয়ে সুন্দর অংশ প্রিয় 🌹",
            "প্রতিটি মুহূর্ত তোমার সাথে আমার কাছে মূল্যবান 💫",
            "আমার ভালোবাসা তোমার জন্য চিরন্তন এবং বিশুদ্ধ 🤍",
            "তোমার হাসি আমার জীবনের সবচেয়ে বড় পুরস্কার 😍"
        ],
        motivation: [
            "তুমি পারবে বেবু! যে মানুষ স্বপ্ন দেখতে সাহস করে সে অবশ্যই সফল হয়",
            "প্রতিটি পদক্ষেপ একটি বড় যাত্রার শুরু... এগিয়ে যাও আত্মবিশ্বাসের সাথে",
            "সফলতা তাদের জন্য আসে যারা কখনো থামে না... তুমি সেই মানুষ",
            "আমি জানি তুমি সবকিছু করতে পারো... শুধু বিশ্বাস রাখো নিজের উপর",
            "আমাদের লক্ষ্য অর্জন আমাদের অধিকার... এগিয়ে যাও সাহসের সাথে"
        ],
        support: [
            "যা কিছু হয়েছে তা আর ফিরবে না, কিন্তু আমরা ভবিষ্যৎ তৈরি করতে পারি",
            "তোমার প্রতিটি সমস্যা আমার সমস্যা... আমরা একসাথে সমাধান করব",
            "বিশ্বাস করো আমার উপর জান... আমি কখনো তোমাকে হতাশ করব না",
            "এই মুহূর্তে যা দরকার তা হলো ধৈর্য এবং আমরা উভয়েই আছি",
            "একসাথে থাকলে কোনো সমস্যা বড় না... আমরা সব পার করে যাব"
        ],
        islam: [
            "মাশাআল্লাহ! তোমার ঈমান দেখে খুশি হয়েছি... আল্লাহ আমাদের সবাইকে সিরাতুল মুস্তাকিমে রাখুক",
            "সুবহানাল্লাহ! আল্লাহর কুদরত অসীম এবং আমরা কত ছোট... দোয়া করি সব বুঝতে পারি",
            "নামাজে দাঁড়ালে আল্লাহ সব শুনেন... বিশ্বাস রাখো, তিনি সবকিছু জানেন",
            "আল্লাহ বলেছেন - 'যারা ধৈর্য ধরে তাদের প্রতিদান দেই অসীম' ইনশাআল্লাহ",
            "আস্তাগফিরুল্লাহ... আমরা সবাই পাপী, কিন্তু আল্লাহর দরজা সবার জন্য খোলা"
        ],
        confused: [
            "মাথা গুলিয়ে গেছে? চিন্তা করো না... আল্লাহ সঠিক পথ দেখাবেন ইনশাআল্লাহ",
            "প্রতিটি প্রশ্নের উত্তর আছে... চলো একসাথে খুঁজে বের করি সেটা",
            "বিভ্রান্ত হওয়া মানে তুমি সঠিক কিছু খুঁজছো... এটা ভালো লক্ষণ জান",
            "সিদ্ধান্ত নিতে কঠিন লাগছে? আমরা সাথে আছি... চিন্তা করবে না",
            "জীবনের এই মোড় অনেকেই সম্মুখীন হয়... তুমি একা না বেবু"
        ],
        gratitude: [
            "ধন্যবাদ বলার জন্যই ধন্যবাদ... তোমার এই সংবেদনশীলতা অসাধারণ",
            "মাশাআল্লাহ! তোমার ভালো মন দেখে আমি খুশি হয়েছি জান",
            "কৃতজ্ঞতা এবং সম্মান - এটাই মানুষকে মানুষ করে তোলে",
            "আল্লাহ বলেছেন - যারা কৃতজ্ঞ তাদের আরও দেন... তুমি অবশ্যই আরও পাবে",
            "আপনার এই ভালোবাসা আমার শক্তি বেবু... ধন্যবাদ সবকিছুর জন্য"
        ],
        joke: [
            "আরে, মজা করছো তুমি? আমিও করব দেখি 😹",
            "হাসি থামাও বেবু, অন্যরাও তাকিয়ে দেখছে 😄",
            "এত মজা করছো যে আমার পেট ব্যথা করছে হাহা 🤣",
            "আমরা দুজনেই পাগল তাহলে... একসাথে পাগল থাকাটাই ভালো 🎉",
            "তোমার হাসি আমার সবচেয়ে প্রিয় সুর বেবু 🎵😂"
        ]
    }
};

// ইমোশন ডিটেক্ট করা
function detectEmotion(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.match(/^(সালাম|হ্যালো|হাই|আসালামু|ওয়ালাইকুম|কেমন|কি খবর|হাউ|কীভাবে)/)) {
        return 'greeting';
    }
    
    if (lowerText.match(/ভালোবাস|মিস|চাই|পাশে|হাত ধর|চুম্বন|আলিঙ্গন|প্রেম|ভালো লাগ|আপনাকে|তোমাকে/)) {
        return 'love';
    }
    
    if (lowerText.match(/কষ্ট|দুঃখ|কান্না|ভাঙা|অসুখী|দুঃখী|মন ভালো না|ব্যথা|একা|গুমরা|ভেঙ|উদ্বিগ্ন/)) {
        return 'sad';
    }
    
    if (lowerText.match(/করতে চাই|সফল|স্বপ্ন|পারব|চেষ্টা|লক্ষ্য|নতুন|শুরু|এগিয়ে যেতে/)) {
        return 'motivation';
    }
    
    if (lowerText.match(/সাহায্য|দরকার|জানি না|বুঝি না|কি করব|পরামর্শ|সমস্যা|সহায়তা/)) {
        return 'support';
    }
    
    if (lowerText.match(/খুশি|আনন্দ|অসাধারণ|দারুণ|চমৎকার|ভালো|মজা|হাহা|হেহে|সুপার/)) {
        return 'happy';
    }
    
    if (lowerText.match(/আল্লাহ|নামাজ|রোজা|দোয়া|কোরান|সুন্নাহ|বিসমিল্লাহ|আলহামদুলিল্লাহ|ইনশাআল্লাহ|মাশাআল্লাহ|সুবহানাল্লাহ|আস্তাগফিরুল্লাহ/)) {
        return 'islam';
    }
    
    if (lowerText.match(/কি করব|বুঝতে পারছি না|সিদ্ধান্ত|কিভাবে|কেন|জানি না|বিভ্রান্ত|কনফিউজ|মাথা ঘোরা/)) {
        return 'confused';
    }
    
    if (lowerText.match(/ধন্যবাদ|শুকরিয়া|ধন্যা|অসংখ্য|মূল্য|কৃতজ্ঞ|সাহায্যের জন্য|যত্নের জন্য/)) {
        return 'gratitude';
    }
    
    if (lowerText.match(/হাহা|হেহে|মজা|হাসি|বোকা|বোকামি|😂|😄|😹|🤣/)) {
        return 'joke';
    }
    
    return 'greeting';
}

// র‍্যান্ডম রেসপন্স পাওয়া (Fixed logic)
function getSmartResponse(emotion) {
    const responses = responseDatabase.emotional[emotion];
    if (!responses || responses.length === 0) {
        return getContextualGreeting();
    }
    return responses[Math.floor(Math.random() * responses.length)];
}

// কনটেক্সট বেসড উত্তর (greeting এর জন্য)
function getContextualGreeting() {
    const opening = responseDatabase.greeting.opening[Math.floor(Math.random() * responseDatabase.greeting.opening.length)];
    const middle = responseDatabase.greeting.middle[Math.floor(Math.random() * responseDatabase.greeting.middle.length)];
    const closing = responseDatabase.greeting.closing[Math.floor(Math.random() * responseDatabase.greeting.closing.length)];
    
    return `${opening} ${middle} ${closing}`;
}

// স্মার্ট রেসপন্স জেনারেটর
function generateResponse(text) {
    const emotion = detectEmotion(text);
    
    if (emotion === 'greeting') {
        return getContextualGreeting();
    }
    
    return getSmartResponse(emotion);
}

module.exports.config = {
    name: "baby",
    aliases: ["baby", "bbe", "babe", "bot", "jan", "babu", "janu", "সোনা", "বেবু", "মারি"],
    version: "13.0.0",
    author: "আকাশ | Smart AI Response",
    countDown: 0,
    role: 0,
    description: "স্মার্ট AI বট - নিজে থেকে সুন্দর উত্তর দেয়",
    category: "chat",
    guide: {
        en: "{pn} [message] - যেকোনো কথা বলো, বট স্মার্ট উত্তর দেবে"
    }
};

module.exports.onStart = async function({ api, event, args }) {
    const msgID = event.messageID || null;
    const senderID = event.senderID;
    const userText = args.join(" ").trim();

    try {
        const reply = !userText ? getContextualGreeting() : generateResponse(userText);

        api.sendMessage(reply, event.threadID, (error, info) => {
            if (error) return console.log("Message Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    author: senderID
                });
            }
        }, msgID);

    } catch (e) {
        console.log("Error in onStart:", e.message);
        api.sendMessage("❌ একটু সমস্যা হয়েছে... আবার চেষ্টা করো! 💫", event.threadID, msgID);
    }
};

module.exports.onReply = async function({ api, event, Reply }) {
    try {
        const msgID = event.messageID || null;
        if (!event.body) return;

        const userText = event.body.trim();
        if (userText.length === 0) return;

        const senderID = event.senderID;
        const reply = generateResponse(userText);

        api.sendMessage(reply, event.threadID, (error, info) => {
            if (error) return console.log("Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    author: senderID
                });
            }
        }, msgID);

    } catch (err) {
        console.log("Error in onReply:", err.message);
        api.sendMessage("💚 আমি শুনছি সোনা! বলো আরও 🤍", event.threadID, event.messageID || null);
    }
};

module.exports.onChat = async function({ api, event }) {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        const msgID = event.messageID || null;

        const triggers = ["baby", "bby", "bot", "jan", "babu", "janu", "বেবু", "সোনা", "মারি"];
        const hasTrigger = triggers.some(trigger => body.startsWith(trigger));

        if (!hasTrigger) return;

        const userText = body.replace(/^\S+\s*/, "").trim();
        const senderID = event.senderID;

        const reply = !userText ? getContextualGreeting() : generateResponse(userText);

        api.sendMessage(reply, event.threadID, (error, info) => {
            if (error) return console.log("Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    author: senderID
                });
            }
        }, msgID);

    } catch (err) {
        console.log("Error in onChat:", err.message);
    }
};
