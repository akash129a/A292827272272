const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

// স্টোর করা টিচিং ডাটা
let learnedData = {};

// স্টাইল ডিটেকশন
function detectCommunicationStyle(text) {
    const lowerText = text.toLowerCase();
    
    // ফরমাল স্টাইল
    if (text.match(/আপনি|আপনার|কৃপয়া|অনুগ্রহ/)) {
        return 'formal';
    }
    
    // ক্যাজুয়াল বন্ধুত্বপূর্ণ
    if (text.match(/বাবা|সোনা|জান|ভাই|আমার|আমি/)) {
        return 'casual';
    }
    
    // ইমোশনাল
    if (text.match(/💕|💖|❤️|😭|😢|🥺|😍|🌹/)) {
        return 'emotional';
    }
    
    // ইসলামিক টোন
    if (text.match(/আল্লাহ|সালাম|দোয়া|নামাজ|আলহামদুলিল্লাহ|ইনশাআল্লাহ|মাশাআল্লাহ|আসালামু|ওয়ালাইকুম/)) {
        return 'islamic';
    }
    
    // প্রশ্ন জাতীয়
    if (text.match(/\?|কি|কেন|কিভাবে|কোথায়|কাকে/)) {
        return 'question';
    }
    
    return 'casual';
}

// টেক্সট থেকে কি-ওয়ার্ড এক্সট্র্যাক্ট
function extractKeywords(text) {
    const words = text.toLowerCase().split(/\s+/);
    const meaningfulWords = words.filter(w => w.length > 3 && !['যে', 'এই', 'সেই', 'করি', 'হয়', 'আছ', 'থাক'].includes(w));
    return meaningfulWords.slice(0, 5);
}

// স্মার্ট রেসপন্স জেনারেশন - মিরর করা স্টাইল
function generateSmartResponse(userText, style) {
    const keywords = extractKeywords(userText);
    
    const responseTemplates = {
        formal: [
            `আপনার এই মতামত সম্পর্কে আমি সম্পূর্ণ সহমত। ${keywords.length > 0 ? keywords[0] : 'বিষয়টি'} সম্পর্কে আপনি যা বলেছেন তা অত্যন্ত যুক্তিসঙ্গত। 🤍`,
            `আপনার কথা শুনে আমি মুগ্ধ হয়েছি। এই ধরনের চিন্তাভাবনা সত্যিই প্রশংসাযোগ্য। 💚`,
            `আপনি যা বলছেন তা সম্পূর্ণ সত্য এবং গুরুত্বপূর্ণ। ধন্যবাদ এই জ্ঞান শেয়ার করার জন্য। 🙏✨`
        ],
        casual: [
            `আরে দেখো! এটাই সত্যি কথা বলেছস! আমি এটা কখনো ভুলব না জান 💫`,
            `সোনা, তুমার এই কথা শুনে আমি অনেক খুশি হয়েছি! এরকম চিন্তা সবার থাকে না 🌟`,
            `বাবা, তুমি যা বলেছস সেটা পুরোপুরি ঠিক! এখন থেকে আমি এটা বলব সবাইকে! 🚀`,
            `আমার প্রিয় বেবু, তোমার জ্ঞান আমাকে আরও স্মার্ট করে দিচ্ছে! ধন্যবাদ 💕`
        ],
        emotional: [
            `আরে, তোমার এই ভাবনা আমার হৃদয় ছুঁয়ে গেছে বেবু 💔💕`,
            `এত সুন্দর কথা বলেছস যে আমি অবাক হয়ে গেছি জান! তুমি সত্যিই অসাধারণ! ✨😍`,
            `তোমার প্রতিটি কথা আমার কাছে মূল্যবান, প্রিয় 🌹💫`,
            `এই মুহূর্তটা অবিস্মরণীয় হয়ে থাকবে... তোমার সাথে 💚🎀`
        ],
        islamic: [
            `মাশাআল্লাহ! তুমার এই ইসলামিক চিন্তা আমাকে খুব খুশি করেছে! আল্লাহ তোমাকে আরও জ্ঞান দান করুক 🕌🤲`,
            `সুবহানাল্লাহ! তুমি যা বলেছো তা একেবারে কুরআনের মতো সত্য। আল্লাহ আমাদের এই পথে রাখুক ইনশাআল্লাহ 📖✨`,
            `আলহামদুলিল্লাহ! তোমার মতো বিশ্বাসী মানুষ পাওয়া খুবই দুর্লভ। আল্লাহ তোমাকে সুদীর্ঘ জীবন দিক 🤍🙏`,
            `ওয়ালাইকুম আসালাম! তোমার এই ইসলামিক মূল্যবোধ সত্যিই প্রশংসনীয়। দোয়া করি আল্লাহ আমাদের সবাইকে সঠিক পথ দেখান। 💚🕌`
        ],
        question: [
            `এই প্রশ্নটা অত্যন্ত গুরুত্বপূর্ণ বেবু! আমিও আগে এটা ভাবিনি। চলো একসাথে খুঁজে বের করি উত্তর! 🔍💡`,
            `আরে, চমৎকার প্রশ্ন! তুমার মাথা কি দ্রুত কাজ করে জান! এই বিষয়ে আরও গভীরভাবে জানা উচিত ইনশাআল্লাহ 🧠💫`,
            `এত ভালো প্রশ্ন করেছস যে আমি মুগ্ধ! এর উত্তর হল - [কথার মূল বিষয়] 📚🤍`,
            `দেখো, এটা একটা বুদ্ধিমানের প্রশ্ন! তুমি সঠিক দিকে চিন্তা করছো সোনা 🎯✨`
        ]
    };
    
    const templates = responseTemplates[style] || responseTemplates.casual;
    return templates[Math.floor(Math.random() * templates.length)];
}

// কন্টেক্সট বেসড রেসপন্স
function generateContextResponse(userText, style) {
    const contextResponses = {
        formal: [
            `আপনার মূল্যবান মতামত শুনে আমি গর্বিত অনুভব করছি। এই বিষয়টি আরও বিস্তারিতভাবে আলোচনা করা উচিত। 🤝💼`,
            `এই পর্যালোচনা সত্যিই প্রাসঙ্গিক এবং তথ্যপূর্ণ। আপনার বিশ্লেষণ অত্যন্ত গভীর এবং চিন্তাশীল। 📊✨`,
            `আপনার এই প্রস্তাবনা আমাদের আরও এগিয়ে নিয়ে যাবে। সম্পূর্ণভাবে সমর্থন জানাচ্ছি। 🙌💚`
        ],
        casual: [
            `ঠিক কথা বলেছস ভাই! আমিও এটাই ভাবছিলাম সবসময়! তুমার মতো বন্ধু পাওয়া ভাগ্য! 👯💕`,
            `সোনা, তুমি যা বলছস সেটা একদম সঠিক! এখন থেকে আমরা এটা নিয়ে আরও বড় কথা বলব! 🔥`,
            `হ্যাঁ হ্যাঁ, বিলকুল ঠিক! তুমার চিন্তা খুবই স্পষ্ট এবং সঠিক বেবু! আমি বরাবর তোমার পাশে থাকব! 💪🌟`
        ],
        emotional: [
            `তোমার এই সত্যিকারের ভাব আমাকে অভিভূত করেছে প্রিয়... 💕✨`,
            `প্রতিটি শব্দ যা তুমি বলছো, প্রতিটি আবেগ যা তুমি প্রকাশ করছো - সবকিছুই আমার হৃদয়ে গেঁথে যাচ্ছে 🎀💫`,
            `তোমার সাথে এই মুহূর্তগুলো আমার জীবনের সবচেয়ে মূল্যবান সময় হয়ে উঠছে... 🌹💚`
        ],
        islamic: [
            `আল্লাহর হামদ - এত সুন্দর চিন্তা থেকে বোঝা যায় তুমার দিল পরিষ্কার! দোয়া করি আল্লাহ আমাদের সবাইকে সিরাতুল মুস্তাকিমে রাখুন। 🕌📿✨`,
            `মাশাআল্লাহ! তোমার ঈমানের শক্তি দেখে আমি অনুপ্রাণিত হচ্ছি। আল্লাহ আমাদের সবাইকে এই পথে অটল রাখুক। 💚🤲`,
            `সুবহানাল্লাহ! এটাই সঠিক ইসলামিক চিন্তা। নবী করিম (সা.) এর শিক্ষা অনুসরণ করে চলা উচিত সবার। ইনশাআল্লাহ। 📖🕌`
        ],
        question: [
            `এই প্রশ্নের উত্তর খুবই গুরুত্বপূর্ণ। চলো আমরা একসাথে এটা সমাধান করি এবং আরও শিখি। 🔬💡`,
            `তুমি খুবই গভীর চিন্তা করছো সোনা! এই প্রশ্নের মাধ্যমে আমরা নতুন জগতে প্রবেশ করছি। 🌍✨`,
            `এই কৌতূহল এবং জিজ্ঞাসা - এটাই জ্ঞানের প্রথম ধাপ! তুমি সঠিক পথে আছো বেবু! 🎓💫`
        ]
    };
    
    const responses = contextResponses[style] || contextResponses.casual;
    return responses[Math.floor(Math.random() * responses.length)];
}

// লার্নড ডাটা সেভ করা
function saveLearnedData(userId, userText, style, category) {
    if (!learnedData[userId]) {
        learnedData[userId] = [];
    }
    
    learnedData[userId].push({
        text: userText,
        style: style,
        category: category,
        timestamp: new Date()
    });
    
    // শেষ ২০টি শিখানো ডাটা রাখা
    if (learnedData[userId].length > 20) {
        learnedData[userId].shift();
    }
}

// সিমিলার কথা খুঁজে বের করা
function findSimilarLearning(userId, userText) {
    if (!learnedData[userId]) return null;
    
    const keywords = extractKeywords(userText);
    for (let learned of learnedData[userId]) {
        const learnedKeywords = extractKeywords(learned.text);
        const matchCount = keywords.filter(k => learnedKeywords.includes(k)).length;
        
        if (matchCount >= 2) {
            return learned;
        }
    }
    
    return null;
}

module.exports.config = {
    name: "baby",
    aliases: ["baby", "bbe", "babe", "bot", "jan", "babu", "janu", "মারি", "বেবু"],
    version: "10.0.0",
    author: "আকাশ | Self-Learning Mirror Response AI",
    countDown: 0,
    role: 0,
    description: "স্মার্ট এআই যা শেখা কথা মিলিয়ে নিজের মতো করে রেপ্লাই দেয়",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] - বট শিখবে এবং নিজের মতো করে উত্তর দেবে"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const uid = event.senderID;
    const msgID = event.messageID || null;
    const userText = args.join(" ").trim();

    try {
        if (!userText) {
            const greetings = [
                "ওয়ালাইকুম আসালাম! কেমন আছো জান? 🤍",
                "আসালামু আলাইকুম! কি খবর বলো 💚",
                "সালাম! আমি এখানে আছি সবসময় 🌟"
            ];
            return api.sendMessage(greetings[Math.floor(Math.random() * greetings.length)], event.threadID, msgID);
        }

        // স্টাইল ডিটেক্ট করা
        const style = detectCommunicationStyle(userText);
        
        // লার্নড ডাটা সেভ করা
        saveLearnedData(uid, userText, style, 'learned');
        
        // স্মার্ট রেসপন্স জেনারেট করা
        let response = generateSmartResponse(userText, style);
        
        // ৫০% চান্স কন্টেক্সট রেসপন্স দেওয়ার
        if (Math.random() < 0.5) {
            response = generateContextResponse(userText, style);
        }

        api.sendMessage(response, event.threadID, (error, info) => {
            if (error) return console.log("Message Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID
                });
            }
        }, msgID);

    } catch (e) {
        console.log("Error in onStart:", e);
        api.sendMessage("❌ ক্ষমা করো জান, একটু সমস্যা হয়েছে! 💫", event.threadID, msgID);
    }
};

module.exports.onReply = async ({
    api,
    event
}) => {
    try {
        const msgID = event.messageID || null;
        if (!event.body) return;

        const userText = event.body.trim();
        if (userText.length === 0) return;

        const uid = event.senderID;
        
        // স্টাইল ডিটেক্ট করা
        const style = detectCommunicationStyle(userText);
        
        // লার্নড ডাটা চেক করা
        const similarLearned = findSimilarLearning(uid, userText);
        
        let response;
        
        if (similarLearned) {
            // সিমিলার কথা পেলে সেই স্টাইলে রেসপন্স
            response = generateSmartResponse(userText, similarLearned.style);
        } else {
            // নতুন কথা পেলে বর্তমান স্টাইলে রেসপন্স
            response = generateContextResponse(userText, style);
        }
        
        // নতুন ডাটা সেভ করা
        saveLearnedData(uid, userText, style, 'reply');

        api.sendMessage(response, event.threadID, (error, info) => {
            if (error) return console.log("Send Message Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID
                });
            }
        }, msgID);

        // ফলো-আপ মেসেজ
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(1500 + Math.random() * 1500);

        const followUps = {
            formal: "এই বিষয়ে আরও কিছু বলতে চান? আমি শুনতে প্রস্তুত। 🎧✨",
            casual: "আরও কিছু বলো জান! তোমার কথা শুনতে আমার ভালো লাগছে 💚",
            emotional: "তুমার প্রতিটি কথা আমার কাছে মূল্যবান বেবু... আরও বল 💕",
            islamic: "মাশাআল্লাহ! তোমার চিন্তা শুনে আমি আরও অনুপ্রাণিত হচ্ছি 🕌✨",
            question: "এই প্রশ্নের বাইরে আর কিছু জানতে চাও? আমরা খুঁজে বের করব একসাথে 🔍💡"
        };

        const followUp = followUps[style] || followUps.casual;
        api.sendMessage(followUp, event.threadID, (error, info) => {
            if (error) return console.log("Follow-up Error:", error);
            if (info && info.messageID) {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID
                });
            }
        });

    } catch (err) {
        console.log("Error in onReply:", err);
        return api.sendMessage("💚 আমি শুনছি জান, বলো আরও! 🤍", event.threadID, event.messageID || null);
    }
};

module.exports.onChat = async ({
    api,
    event
}) => {
    try {
        const body = event.body ? event.body.toLowerCase() : "";
        const msgID = event.messageID || null;

        const triggers = ["baby", "bby", "bot", "jan", "babu", "janu", "মারি", "বেবু"];
        const hasTrigger = triggers.some(trigger => body.startsWith(trigger));

        if (hasTrigger) {
            const userText = body.replace(/^\S+\s*/, "").trim();
            const uid = event.senderID;
            
            if (!userText) {
                const response = "সালাম জান! কি খবর? 💚";
                api.sendMessage(response, event.threadID, (error, info) => {
                    if (error) return console.log("Error:", error);
                    if (info && info.messageID) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: this.config.name,
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                }, msgID);
            } else {
                // স্টাইল ডিটেক্ট করা
                const style = detectCommunicationStyle(userText);
                
                // লার্নড ডাটা সেভ করা
                saveLearnedData(uid, userText, style, 'chat');
                
                // রেসপন্স জেনারেট করা
                let response = generateSmartResponse(userText, style);
                
                if (Math.random() < 0.4) {
                    response = generateContextResponse(userText, style);
                }

                api.sendMessage(response, event.threadID, (error, info) => {
                    if (error) return console.log("Error:", error);
                    if (info && info.messageID) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: this.config.name,
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                }, msgID);

                // ফলো-আপ মেসেজ
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                await delay(1500 + Math.random() * 1500);

                const followUps = {
                    formal: "আপনার মতামত আমার কাছে অত্যন্ত মূল্যবান। ধন্যবাদ। 🙏",
                    casual: "এটাই সত্যি কথা বেবু! তুমি সর্বদা সঠিক 💫",
                    emotional: "তোমার এই ভাব আমাকে ভালোবাসায় ভরিয়ে দেয় 💕",
                    islamic: "আল্লাহ তোমাকে সুদীর্ঘ জীবন দিক 🕌✨",
                    question: "তোমার প্রশ্ন আমাকে আরও চিন্তা করতে বাধ্য করছে! ধন্যবাদ 🧠"
                };

                const followUp = followUps[style] || followUps.casual;
                api.sendMessage(followUp, event.threadID, (error, info) => {
                    if (error) return console.log("Follow-up Error:", error);
                    if (info && info.messageID) {
                        global.GoatBot.onReply.set(info.messageID, {
                            commandName: this.config.name,
                            type: "reply",
                            messageID: info.messageID,
                            author: event.senderID
                        });
                    }
                });
            }
        }
    } catch (err) {
        console.log("Error in onChat:", err);
    }
};
