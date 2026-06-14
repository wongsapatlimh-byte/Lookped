// ฟังก์ชันส่งข้อความเข้า Discord ผ่าน Webhook URL
async function sendToDiscord(payload, discordUrl) {
  try {
    await fetch(discordUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log("ส่งข้อความไป Discord สำเร็จ!");
  } catch (error) {
    console.error("ส่งไป Discord ล้มเหลว:", error);
  }
}

// สร้าง Embed ของ Discord สำหรับ 1 ทีม (เช่น Team A หรือ Team B) ในศึก GVG
function generateDiscordPayload(teamName, partyData) {
  // partyData คือ Array ของปาร์ตี้ เช่น [{ name: "Party 1", members: [...] }]

  const fields = partyData.map(party => {
    // วนลูปจัดรูปแบบรายชื่อสมาชิกในปาร์ตี้นั้นๆ
    const memberLines = party.members.map((m, index) => {
      const remarkStr = m.remark ? ` \`${m.remark}\`` : '';
      return `${index + 1}. **${m.name}** (${m.job})${remarkStr}`;
    }).join('\n');

    return {
      name: `🔰 ${party.name}`,
      value: memberLines,
      inline: false
    };
  });

  // คืนค่ากลับไปเป็น Embed 1 ทีม (เช่น Team A หรือ Team B)
  return {
    title: `⚔️ สนามหลัก ${teamName}`,
    color: teamName.includes('A') ? 3447003 : 15158332, // Team A สีน้ำเงิน, Team B สีแดง
    fields: fields,
    timestamp: new Date().toISOString()
  };
}

module.exports = { sendToDiscord, generateDiscordPayload };
