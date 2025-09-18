const axios = require('axios');
const dipto = "https://www.noobs-api.rf.gd/dipto";

module.exports.config = {
 name: "edt",
 version: "6.9",
 credits: "dipto",
 countDown: 5,
 hasPermssion: 1,
 category: "AI",
 commandCategory: "AI",
 description: "Edit images using Edit AI",
 guide: {
 en: "Reply to an image with {pn} [prompt]"
 }
};

async function handleEdit(api, event, args, commandName) {
 const url = event.messageReply?.attachments[0]?.url;
 const prompt = args.join(" ") || "What is this";

 if (!url) {
 return api.sendMessage(" 𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎 𝚝𝚘 𝚎𝚍𝚒𝚝 𝚒𝚝.", event.threadID, event.messageID);
 }

 try {
 const response = await axios.get(`${dipto}/edit?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}`, {
 responseType: 'stream',
 validateStatus: () => true
 });

 // Check if response is image
 if (response.headers['content-type']?.startsWith('image/')) {
 return api.sendMessage(
 { attachment: response.data },
 event.threadID,
 (error, info) => {
 global.client.handleReply.push({
 name: commandName,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 link: albumOptions,
 });
 },
 event.messageID
 );
 }

 // If not image, try to parse as JSON
 let responseData = '';
 for await (const chunk of response.data) {
 responseData += chunk.toString();
 }

 const jsonData = JSON.parse(responseData);
 if (jsonData?.response) {
 return api.sendMessage(
 jsonData.response,
 event.threadID,
 (error, info) => {
 global.client.handleReply.push({
 name: commandName,
 type: "reply",
 messageID: info.messageID,
 author: event.senderID,
 link: albumOptions,
 });
 },
 event.messageID
 );
 }

 return api.sendMessage(
 "No valid response",
 event.threadID,
 event.messageID);

 } catch (error) {
 console.error("Edit command error:", error);
 return api.sendMessage(
 "𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚙𝚛𝚘𝚌𝚎𝚜𝚜 𝚢𝚘𝚞𝚛 𝚛𝚎𝚚𝚞𝚎𝚜𝚝.",
 event.threadID,
 event.messageID
 );
 }
}

module.exports.run = async ({ api, event, args }) => {
 if (!event.messageReply) {
 return api.sendMessage(
 "𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎 𝚝𝚘 𝚎𝚍𝚒𝚝 𝚒𝚝.",
 event.threadID,
 event.messageID);
 }
 await handleEdit(api, event, args, this.config.name);
};

module.exports.handleReply = async function ({ api, event, args }) {
 if (event.type === "message_reply") {
 await handleEdit(api, event, args, this.config.name);
 }
};
