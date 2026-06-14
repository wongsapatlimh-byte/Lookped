const express = require('express');
const client = require('../lineClient');
const config = require('../config');
const asyncHandler = require('../middleware/asyncHandler');
const { sendToDiscord, generateDiscordPayload } = require('../services/discord');

const router = express.Router();

// ==========================================
// เส้นทางที่ 3: สำหรับให้ Management Web ยิงมาทำ บรอดแคสต์/มัลติแคสต์ GVG
// URL เวลายิงจากเว็บ: https://your-cloud-run-url.a.run.app/gvgmulticast
// ==========================================
router.post('/', asyncHandler(async (req, res) => {
  const webApiKey = req.headers['x-web-api-key'];
  const SECRET_KEY = config.managementWebSecret;

  //ยังไม่ต้องเช็คสำหรับ boardcast
  //if (!webApiKey || webApiKey !== SECRET_KEY) {
  //  return res.status(401).send('Unauthorized');
  //}

  // ดึงข้อมูลทั้งหมดที่ส่งมาจาก Postman (รวมถึงอาเรย์ teams 40 คนด้วย)
  const { userIds, messageText, teams } = req.body;

  try {
    let discordEmbeds = [];
    if (teams && Array.isArray(teams)) {
      discordEmbeds = teams.map(team => {
        // เรียกใช้ฟังก์ชันของคุณโดยตรง (ส่ง teamName และ partyData เข้าไป)
        return generateDiscordPayload(team.teamName, team.partyData);
      });
    }

    const discordPayload = {
      content: `📢 **[LOOKPED BROADCAST]**\n${messageText}`,
      embeds: discordEmbeds // ใส่ก้อน Embeds (TEAM A และ TEAM B) ที่เจนเสร็จแล้วเข้าไป
    };

    await sendToDiscord(discordPayload, config.discordGVGUrl);

    const botInfo = await client.getBotInfo();

    if (userIds && userIds.length > 0) {
      await client.multicast({
        to: userIds,
        messages: [{ type: 'text', text: messageText }]
      });
    }

    return res.status(200).json({ status: 'Success', botName: botInfo.displayName });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Error');
  }
}));

module.exports = router;
