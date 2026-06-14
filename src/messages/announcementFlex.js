const { headerBar, separator } = require('./flexBuilders');

// การ์ดประกาศของกิลด์ (ใช้ตอนบรอดแคสต์/มัลติแคสต์จาก Management Web)
function generateGuildAnnouncementFlex(message, announcer, announceDate) {
  return {
    type: "flex",
    altText: `📢 ประกาศ: แจ้งเตือน`, // ยังคงใช้ topic สำหรับแจ้งเตือนบนหน้าจอมือถือ
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#152238",
        paddingAll: "20px",
        contents: [
          headerBar("👑 GUILD ANNOUNCEMENT", { size: "sm" }),
          separator("#5273A5"),
          {
            type: "box",
            layout: "vertical",
            margin: "md",
            backgroundColor: "#1E2E4A",
            cornerRadius: "md",
            paddingAll: "16px",
            contents: [
              {
                type: "text",
                text: message, // แสดงข้อความประกาศตรงนี้เลย
                color: "#FFFFFF",
                size: "sm",
                wrap: true,
                weight: "regular"
              }
            ]
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  { type: "text", text: "ผู้ประกาศ :", color: "#88A3C9", size: "xs", flex: 3 },
                  { type: "text", text: announcer, wrap: true, color: "#FCE68E", size: "xs", flex: 7, weight: "bold" }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  { type: "text", text: "วันเวลา :", color: "#88A3C9", size: "xs", flex: 3 },
                  { type: "text", text: announceDate, wrap: true, color: "#88A3C9", size: "xs", flex: 7 }
                ]
              }
            ]
          }
        ]
      }
    }
  };
}

module.exports = { generateGuildAnnouncementFlex };
