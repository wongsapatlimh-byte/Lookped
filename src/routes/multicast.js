const express = require('express');
const client = require('../lineClient');
const config = require('../config');
const asyncHandler = require('../middleware/asyncHandler');
const { sendToDiscord } = require('../services/discord');
const { generateGuildAnnouncementFlex } = require('../messages');
const getThaiFormattedDate = require('../utils/date');

const router = express.Router();

// ==========================================
// เส้นทางที่ 2: สำหรับให้ Management Web ยิงมาทำ บรอดแคสต์/มัลติแคสต์
// URL เวลายิงจากเว็บ: https://your-cloud-run-url.a.run.app/multicast
// ==========================================
router.post('/', asyncHandler(async (req, res) => {
  const webApiKey = req.headers['x-web-api-key'];
  const SECRET_KEY = config.managementWebSecret;
  let isFlexmessage = false;
  let flexMessage = "";
  let announcer = "Guild Master";
  const announceDate = getThaiFormattedDate();
  //ยังไม่ต้องเช็คสำหรับ boardcast
  //if (!webApiKey || webApiKey !== SECRET_KEY) {
  //  return res.status(401).send('Unauthorized');
  //}

  const { userIds, messageText, isBroadcast } = req.body;

  try {
    flexMessage = generateGuildAnnouncementFlex(messageText, announcer, announceDate);
    isFlexmessage = true;

    const payload = {
      embeds: [
        {
          title: "📢 ระบบส่งข้อความบรอดแคสต์ (LINE/DISCORD Broadcast)",
          color: 15844367, // สีทอง/เหลือง สำหรับการประกาศ (Hex: #F1C40F)
          // ใช้ description ในการโชว์ข้อความยาวๆ จะอ่านง่ายกว่าใส่ใน fields ครับ
          description: `**ข้อความที่ส่งหาทาง LINE/DISCORD:**\n\`\`\`\n${messageText}\n\`\`\``,
          fields: [
            { name: "👥 จำนวนผู้รับทั้งหมด", value: `${userIds.length} คน`, inline: true },
            { name: "🌐 แหล่งที่มา", value: "Management Web", inline: true }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "LOOKPED Portal Hub"
          }
        }
      ]
    };

    await sendToDiscord(payload, config.discordBoardcastUrl);

    const botInfo = await client.getBotInfo();
    if (isBroadcast) {
      await client.broadcast({
        messages: [flexMessage]
      });
    } else if (userIds && userIds.length > 0) {
      await client.multicast({
        to: userIds,
        messages: [flexMessage]
      });
    }
    /*
    await client.multicast({
        to: userIds,
        messages: [{ type: 'text', text: messageText }]
    });*/

    return res.status(200).json({ status: 'Success', botName: botInfo.displayName });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Error');
  }
}));

module.exports = router;
