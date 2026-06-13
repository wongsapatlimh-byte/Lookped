const client = require('../lineClient');
const config = require('../config');
const tempUserState = require('../state');
const { sendToDiscord } = require('../services/discord');
const { registerUser } = require('../services/registration');
const { setAbsence } = require('../services/absence');
const {
  generateAskNameFlexMessage,
  generateAskUsernameFlexMessage,
  generateRegisterSuccessFlexMessage,
  generateRegisterErrorFlexMessage,
  generateLeaveFlexMessage,
  generateCancelLeaveFlexMessage,
  generateLeaveSuccessFlexMessage,
  generateCancelSuccessFlexMessage,
} = require('../messages');

// ฟังก์ชันแยกจัดการแต่ละ Event ที่เข้ามาจาก LINE
async function handleEvent(event) {
  console.log("มีข้อความเข้าครับ");
  console.log("event.type : " + event.type);
  const userId = event.source.userId;
  console.log("userId:", userId);

  if (event.type === 'message' && event.message.type === 'text') {
    const text = event.message.text;

    // เช็กว่า User คนนี้กำลังอยู่ในสถานะ "รอพิมพ์ชื่อตัวละคร" อยู่หรือเปล่า?
    if (tempUserState[userId] && tempUserState[userId].status === 'WAITING_FOR_CHARNAME') {
      const characterName = text;
      console.log(`Character Name: ${characterName}`);
      tempUserState[userId] = { status: 'WAITING_FOR_USERNAME', uuid: userId, playerName: characterName, userName: '' };
      const flexMessage = generateAskUsernameFlexMessage();
      // ตอบกลับว่าบันทึกสำเร็จ
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [flexMessage]
      });
    } else if (tempUserState[userId] && tempUserState[userId].status === 'WAITING_FOR_USERNAME') {
      const userName = text;
      const charName = tempUserState[userId].playerName;
      console.log(`UserName: ${userName}`);
      tempUserState[userId] = { status: 'WAITING_FOR_USERNAME', uuid: userId, playerName: charName, userName: userName };

      // Connect to DB for sent user data
      const response = await registerUser({
        lineUserId: userId,       // for line uuid
        requestedUsername: userName, // username
        lineDisplayName: charName,   // charname
      });

      if (!response.ok) {
        // ตอบกลับว่าเกิดข้อผิดพลาด
        const flexMessage = generateRegisterErrorFlexMessage();
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [flexMessage]
        });
        //throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('ส่งข้อมูลไป Render สำเร็จ:', data);

      // เมื่อบันทึกเสร็จ ต้อง "ล้างสถานะ" ทิ้ง เพื่อให้เขากลับไปเป็นสถานะปกติ
      delete tempUserState[userId];

      // send to Discord
      const payload = {
        embeds: [
          {
            title: "📢 สมาชิกใหม่ลงทะเบียนกิลด์ LOOKPEN",
            color: 65280, // รหัสสีรูปแบบ Decimal (65280 = สีเขียว)
            fields: [
              { name: "👤 ชื่อตัวละคร", value: charName, inline: true },
              { name: "🆔 LINE User ID", value: `\`${userId}\``, inline: true }
            ],
            timestamp: new Date().toISOString()
          }
        ]
      };
      await sendToDiscord(payload, config.discordRegisterUrl);
      const flexMessage = generateRegisterSuccessFlexMessage(charName);
      // ตอบกลับว่าบันทึกสำเร็จ
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [flexMessage]
      });
    } else {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: `ขอบคุณที่ส่งข้อความถึงเรา

        ต้องขออภัยเป็นอย่างยิ่งที่บัญชีนี้ไม่สามารถตอบข้อความใดๆ ได้
        โปรดรอรับข่าวสารใหม่ๆ จากเราผ่านช่องทางนี้` }]
      });
    }

    // ถ้าพิมพ์ข้อความมาเล่นๆ โดยไม่ได้กด Register ก่อน ก็ปล่อยผ่าน (ไม่ต้องตอบ)
    return Promise.resolve(null);
  }

  // จัดการเฉพาะ event ประเภท postback เท่านั้น
  // (กันพังกรณีเจอ event อื่น เช่น follow / join / sticker ที่ไม่มี event.postback)
  if (event.type !== 'postback') {
    return Promise.resolve(null);
  }

  // แปลงข้อมูล Postback String (เช่น action=leave&game=ROOC&date=2026-06-04) ให้เป็น Object
  const postbackData = new URLSearchParams(event.postback.data);
  const actionType = postbackData.get('action');
  const game = postbackData.get('game') || 'ROOC';
  let isFlexmessage = false;
  let replyText = "";
  let flexMessage = "";
  console.log("actionType:", actionType);
  // ลอจิกจัดการตามประเภท Action
  if (actionType === 'register') {
    // 💡 เปลี่ยนสถานะของ User คนนี้ให้กลายเป็น "กำลังรอชื่อ"
    tempUserState[userId] = { status: 'WAITING_FOR_CHARNAME', uuid: userId, playerName: '', userName: '' };

    flexMessage = generateAskNameFlexMessage();
    isFlexmessage = true;
    // ถามชื่อตัวละครกลับไป
    //replyText = "โปรดกรอกข้อมูลชื่อตัวละครในเกมส์ของคุณ พิมพ์ตอบกลับมาได้เลยครับ";

  } else if (actionType === 'leave') {
    const leaveDate = event.postback.params?.date || postbackData.get('date');
    console.log("leave:", leaveDate);

    // สร้าง Flex Message โดยใช้ฟังก์ชันที่เราเพิ่งเขียน
    flexMessage = generateLeaveFlexMessage(leaveDate);
    isFlexmessage = true;

    // TODO: บันทึกวันลาวอลง Database
    //replyText = `บันทึกการลาวอของวันที่ ${leaveDate} เรียบร้อยแล้ว พักผ่อนนะครับ!`;
    /*
    //Query ชื่อตัวละครจาก LINE ID เพื่อแจ้งลา
    const characterName = `Test ระบบ ลาวอ`;

    //send to Discord
    const payload = {
        embeds: [
            {
            title: "🚨 แจ้งขอลาวอร์ (Leave War)",
            color: 16711680,
            fields: [
                { name: "👤 ชื่อตัวละคร", value: characterName, inline: true },
                { name: "📅 วันที่ลา", value: leaveDate, inline: true },
                { name: "🆔 LINE UID", value: `\`${userId}\``, inline: false }
            ],
            timestamp: new Date().toISOString()
            }
        ]
    };
    await sendToDiscord(payload, config.discordLeaveUrl);*/

  } else if (actionType === 'cancelleave') {
    const leaveDate = event.postback.params?.date || postbackData.get('date');
    console.log("cancelleave:", leaveDate);

    flexMessage = generateCancelLeaveFlexMessage(leaveDate);
    isFlexmessage = true;
    // TODO: ลบข้อมูลวันลาออกจาก Database
    //replyText = `ยกเลิกการลาวอวันที่ ${leaveDate} สำเร็จ เตรียมลุยเลย!`;
    /*
    //Query ชื่อตัวละครจาก LINE ID เพื่อแจ้งลา
    const characterName = `Test ระบบ ยกเลิกลาวอ`;

    //send to Discord
    const payload = {
        embeds: [
            {
            title: "🛡️ ยกเลิกการลาวอร์ (Cancel Leave)",
            color: 255, // สีแดง
            fields: [
                { name: "👤 ชื่อตัวละคร", value: characterName, inline: true },
                { name: "📅 วันที่ยกเลิก", value: leaveDate, inline: true },
                { name: "🆔 LINE UID", value: `\`${userId}\``, inline: false }
            ],
            timestamp: new Date().toISOString()
            }
        ]
    };
    await sendToDiscord(payload, config.discordLeaveUrl);*/
  } else if (actionType === 'confirm_leave') {
    const leaveDate = event.postback.params?.date || postbackData.get('date');

    // บันทึกการลาเข้าระบบหลังบ้าน (Render) ก่อนตอบกลับ — ระบบหลังบ้าน resolve
    // สมาชิกจาก LINE user id เอง
    const absResp = await setAbsence({ lineUserId: userId, date: leaveDate, action: 'absent' });
    if (!absResp.ok) {
      console.error('setAbsence(absent) failed:', absResp.status);
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: `ขออภัย ไม่สามารถบันทึกการลาของวันที่ ${leaveDate} ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง` }]
      });
    }

    //ส่งไป web app
    flexMessage = generateLeaveSuccessFlexMessage(leaveDate);
    isFlexmessage = true;

    const characterName = `Test ระบบ ลาวอ`;
    /*
    //send to Discord
    const payload = {
        embeds: [
            {
            title: "🚨 แจ้งขอลาวอร์ (Leave War)",
            color: 16711680,
            fields: [
                { name: "👤 ชื่อตัวละคร", value: characterName, inline: true },
                { name: "📅 วันที่ลา", value: leaveDate, inline: true },
                { name: "🆔 LINE UID", value: `\`${userId}\``, inline: false }
            ],
            timestamp: new Date().toISOString()
            }
        ]
    };*/

    const KAFRA_ICON = "https://i.pinimg.com/originals/1e/86/e1/1e86e10260f84cb713217d8efba08213.png"; // ไอคอน Kafra หรือ Poring
    const SHIELD_ICON = "https://cdn-icons-png.flaticon.com/512/1055/1055183.png"; // ไอคอนโล่

    const payload = {
      // สามารถตั้งชื่อบอทให้เข้ากับธีมได้ (ถ้า Webhook อนุญาต)
      username: "Kafra System",
      avatar_url: KAFRA_ICON,
      embeds: [
        {
          author: {
            name: "🛡️ GUILD WAR SYSTEM",
            icon_url: SHIELD_ICON
          },
          title: "📜 แจ้งขอลาวอร์ (Leave Request)",
          description: "มีสมาชิกส่งคำร้องขอลาพักรบ ระบบได้ทำการบันทึกข้อมูลแล้ว",
          color: 15844367, // สีเหลืองทองแบบ RO (Hex: #F1C40F)
          thumbnail: {
            url: KAFRA_ICON // รูปเล็กๆ มุมขวาบน ทำให้ Embed ดูมีมิติ ไม่แบนจนเกินไป
          },
          fields: [
            {
              name: "👤 ชื่อตัวละคร",
              value: `> **${characterName}**`, // ใช้ > เพื่อเว้นวรรคให้เป็นกรอบอ้างอิงสวยๆ
              inline: true
            },
            {
              name: "📅 วันที่ลา",
              value: `> **${leaveDate}**`,
              inline: true
            },
            {
              name: "🆔 อ้างอิงระบบ (LINE UID)",
              // ใช้ || คลุมเพื่อให้เป็น Spoiler (ต้องกดดู) ช่วยให้แชทดูสะอาด และเซฟ Privacy
              value: `||${userId}||`,
              inline: false
            }
          ],
          footer: {
            text: "LOOKPED Headquarters • ROO Classic",
            icon_url: KAFRA_ICON
          },
          timestamp: new Date().toISOString()
        }
      ]
    };
    await sendToDiscord(payload, config.discordLeaveUrl);
  } else if (actionType === 'confirm_cancelleave') {
    const leaveDate = event.postback.params?.date || postbackData.get('date');

    // ยกเลิกการลาในระบบหลังบ้าน (Render) ก่อนตอบกลับ
    const absResp = await setAbsence({ lineUserId: userId, date: leaveDate, action: 'unabsent' });
    if (!absResp.ok) {
      console.error('setAbsence(unabsent) failed:', absResp.status);
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: 'text', text: `ขออภัย ไม่สามารถยกเลิกการลาของวันที่ ${leaveDate} ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง` }]
      });
    }

    //ส่งไป web app
    flexMessage = generateCancelSuccessFlexMessage(leaveDate);
    isFlexmessage = true;

    const characterName = `Test ระบบ ลาวอ`;

    const KAFRA_ICON = "https://i.pinimg.com/originals/1e/86/e1/1e86e10260f84cb713217d8efba08213.png";
    const SWORD_ICON = "https://cdn-icons-png.flaticon.com/512/1055/1055183.png"; // เปลี่ยนไอคอนเล็กๆ ด้านบนให้เหมาะกับบริบท (ถ้ามี)

    const payload = {
      username: "Kafra System",
      avatar_url: KAFRA_ICON,
      embeds: [
        {
          author: {
            name: "⚔️ GUILD WAR SYSTEM",
            icon_url: KAFRA_ICON
          },
          title: "🔄 ยกเลิกการลาวอร์ (Cancel Leave Request)",
          description: "สมาชิกได้ยกเลิกคำร้องขอลาพักรบ และ **พร้อมกลับเข้าสู่สนามรบแล้ว!**",
          color: 3066993, // สีเขียวสว่าง (Hex: #2ECC71) สื่อถึงการ Active / กลับมาลงวอร์
          thumbnail: {
            url: KAFRA_ICON
          },
          fields: [
            {
              name: "👤 ชื่อตัวละคร",
              value: `> **${characterName}**`,
              inline: true
            },
            {
              name: "📅 วันที่ขอยกเลิก",
              value: `> **${leaveDate}**`,
              inline: true
            },
            {
              name: "🆔 อ้างอิงระบบ (LINE UID)",
              value: `||${userId}||`,
              inline: false
            }
          ],
          footer: {
            text: "LOOKPED Headquarters • ROO Classic",
            icon_url: KAFRA_ICON
          },
          timestamp: new Date().toISOString()
        }
      ]
    };
    await sendToDiscord(payload, config.discordLeaveUrl);
  } else if (actionType === 'cancel_process') {
    return;
  } else {
    replyText = "คำสั่งไม่ถูกต้องครับ";
  }

  //console.log("ข้อความที่จะตอบกลับ:", replyText);

  if (isFlexmessage) {
    isFlexmessage = false;
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [flexMessage]
    });
  } else {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: 'text',
          text: replyText
        }
      ]
    });
  }
  // ให้ console.log แทน เพื่อดูว่าลอจิกทำงานถูกต้องไหม
  //console.log("ข้อความที่จะตอบกลับ:", replyText);
  //return Promise.resolve(null);
}

module.exports = handleEvent;
