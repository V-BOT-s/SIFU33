module.exports.config = {

  name: "shifatgc",

  version: "1.1",

  credits: "—͟͟͞͞𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",

  cooldowns: 5,

  hasPermission: 0,

  description: "যোগ দিন অফিসিয়াল সাপোর্ট গ্রুপে",

  usePrefix: true,

  commandCategory: "General",

  usage: "shifatgc"

};


module.exports.run = async function ({ api, event }) {

  const userId = event.senderID;

  const supportGroupThreadId = "1969428260490804"; // আপনার সাপোর্ট গ্রুপের থ্রেড আইডি এখানে বসান


  try {

    const threadInfo = await api.getThreadInfo(supportGroupThreadId);

    const participantIds = threadInfo.participantIDs;


    if (participantIds.includes(userId)) {

      return api.sendMessage(

        `╭─━━━━━━❁✨✨❁━━━━━━─╮

   🙋‍♂️ প্রিয় ব্যবহারকারী,


   📌 আপনি ইতোমধ্যেই আমাদের 

      ✨𝐇𝐈𝐍𝐀𝐓𝐀 𝐖𝐎𝐑𝐋𝐃✨

        গ্রুপে যুক্ত আছেন।


   🤝 ধন্যবাদ আমাদের সাথে থাকার জন্য!

╰─━━━━━━━━❁✨❁━━━━━━━━─╯`,

        event.threadID

      );

    } else {

      await api.addUserToGroup(userId, supportGroupThreadId);

      return api.sendMessage(

        `╭─━━━━━━━━❁🌼❁━━━━━━━━─╮

   🎉 অভিনন্দন প্রিয় ব্যবহারকারী!


   ✅ আপনি সফলভাবে যুক্ত হয়েছেন 

       আমাদের অফিসিয়াল গ্রুপে।


   📥 গ্রুপটি যদি না দেখতে পান,

       তাহলে Message Request বা Spam 

       ফোল্ডার চেক করুন।


   🤗 দেখা হবে গ্রুপে ইনশাআল্লাহ!

╰─━━━━━━━━❁🌼❁━━━━━━━━─╯`,

        event.threadID

      );

    }


  } catch (error) {

    console.error("Error adding user to group:", error);

    return api.sendMessage(

      `╭─━━━━━━━━❁⚠️❁━━━━━━━━─╮

   😞 ওহো! কিছু একটা সমস্যা হয়েছে।


   ❌ আপনাকে এই মুহূর্তে গ্রুপে 

       যুক্ত করা যাচ্ছে না।


   📩 দয়া করে আমাকে একটি মেসেজ 

       পাঠান অথবা Friend Request দিন।


   🔁 তারপর আবার চেষ্টা করুন, 

       আমি আপনাকে ম্যানুয়ালি যুক্ত করব।


   ✉️ ✨𝐇𝐈𝐍𝐀𝐓𝐀 ✨ 𝐖𝐎𝐑𝐋𝐃✨!

╰─━━━━━━━━❁⚠️❁━━━━━━━━─╯`,

      event.threadID

    );

  }

};
