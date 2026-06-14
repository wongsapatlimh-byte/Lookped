const { headerBar, separator } = require('./flexBuilders');

// การ์ดถาม "ชื่อตัวละคร" (ขั้นแรกของการลงทะเบียน)
function generateAskNameFlexMessage() {
  return {
    type: "flex",
    altText: "โปรดระบุชื่อตัวละครในเกมของคุณ",
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#152238",
        paddingAll: "20px",
        contents: [
          headerBar("📝 REGISTRATION"),
          separator("#5273A5"),
          {
            type: "text",
            text: "ระบุชื่อตัวละคร",
            weight: "bold",
            size: "xl",
            color: "#FFFFFF",
            align: "center",
            margin: "lg"
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            backgroundColor: "#1E2E4A",
            cornerRadius: "md",
            paddingAll: "16px",
            spacing: "md",
            contents: [
              {
                type: "text",
                text: "โปรดกรอกข้อมูลชื่อตัวละคร\nในเกมของคุณ",
                color: "#E2E8F0",
                size: "sm",
                wrap: true,
                align: "center",
                weight: "bold"
              },
              {
                type: "text",
                text: "พิมพ์ตอบกลับมาในแชทนี้\nได้เลยครับ ⌨️",
                color: "#FCE68E",
                size: "sm",
                wrap: true,
                align: "center",
                weight: "bold"
              }
            ]
          }
        ]
      }
    }
  };
}

// การ์ดถาม "Username" (ขั้นที่สองของการลงทะเบียน)
function generateAskUsernameFlexMessage() {
  return {
    type: "flex",
    altText: "โปรดระบุ Username สำหรับลงทะเบียน",
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#152238",
        paddingAll: "20px",
        contents: [
          headerBar("📝 REGISTRATION"),
          separator("#5273A5"),
          {
            type: "text",
            text: "ระบุ Username",
            weight: "bold",
            size: "xl",
            color: "#FFFFFF",
            align: "center",
            margin: "lg"
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            backgroundColor: "#1E2E4A",
            cornerRadius: "md",
            paddingAll: "16px",
            spacing: "md",
            contents: [
              {
                type: "text",
                text: "โปรดกรอกข้อมูล Username\nสำหรับ Login LOOKPED Portal Hub",
                color: "#E2E8F0",
                size: "sm",
                wrap: true,
                align: "center",
                weight: "bold"
              },
              {
                type: "text",
                text: "พิมพ์ตอบกลับมาในแชทนี้\nได้เลยครับ ⌨️",
                color: "#FCE68E",
                size: "sm",
                wrap: true,
                align: "center",
                weight: "bold"
              }
            ]
          }
        ]
      }
    }
  };
}

// การ์ดแจ้งผล "ลงทะเบียนสำเร็จ"
function generateRegisterSuccessFlexMessage(charName) {
  return {
    type: "flex",
    altText: `ลงทะเบียนตัวละคร ${charName} สำเร็จ โปรดรอการอนุมัติ`,
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#152238",
        paddingAll: "lg",
        contents: [
          headerBar("✅ SUCCESSFUL", { color: "#4ADE80" }),
          separator("#5273A5"),
          {
            type: "text",
            text: "ลงทะเบียนสำเร็จ",
            weight: "bold",
            size: "xl",
            color: "#FFFFFF",
            align: "center",
            margin: "lg"
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            backgroundColor: "#1E2E4A",
            cornerRadius: "md",
            paddingAll: "md",
            spacing: "md",
            contents: [
              {
                type: "text",
                text: "บันทึกตัวละครชื่อ",
                color: "#E2E8F0",
                size: "sm",
                align: "center",
                wrap: true
              },
              {
                type: "text",
                text: `"${charName}"`, // แทรกตัวแปรชื่อที่ผู้ใช้พิมพ์เข้ามา
                color: "#FCE68E",
                size: "md",
                weight: "bold",
                align: "center",
                wrap: true
              },
              {
                type: "text",
                text: "เพื่อขอเข้าร่วมกิลด์เรียบร้อยแล้ว\nโปรดรอการอนุมัติจาก Admin ครับ ⏳",
                color: "#4ADE80",
                size: "sm",
                wrap: true,
                align: "center",
                weight: "bold"
              }
            ]
          }
        ]
      }
    }
  };
}

// การ์ดแจ้งผล "เกิดข้อผิดพลาดในการลงทะเบียน"
function generateRegisterErrorFlexMessage() {
  return {
    type: "flex",
    altText: "เกิดข้อผิดพลาดในการลงทะเบียน โปรดติดต่อ Admin",
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#152238",
        paddingAll: "lg",
        contents: [
          headerBar("❌ SYSTEM ERROR", { color: "#F87171" }),
          separator("#5273A5"),
          {
            type: "text",
            text: "เกิดข้อผิดพลาด",
            weight: "bold",
            size: "xl",
            color: "#FFFFFF",
            align: "center",
            margin: "lg"
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            backgroundColor: "#1E2E4A",
            cornerRadius: "md",
            paddingAll: "md",
            spacing: "md",
            contents: [
              {
                type: "text",
                text: "เกิดปัญหาขัดข้องบางประการ\nทำให้สมัครสมาชิกไม่สำเร็จครับ",
                color: "#E2E8F0",
                size: "sm",
                align: "center",
                wrap: true
              },
              {
                type: "text",
                text: "โปรดลองทำรายการใหม่อีกครั้ง\nหรือแคปหน้าจอนี้แจ้ง Admin ครับ 🛠️",
                color: "#FCE68E",
                size: "sm",
                wrap: true,
                align: "center",
                weight: "bold"
              }
            ]
          }
        ]
      }
    }
  };
}

module.exports = {
  generateAskNameFlexMessage,
  generateAskUsernameFlexMessage,
  generateRegisterSuccessFlexMessage,
  generateRegisterErrorFlexMessage,
};
