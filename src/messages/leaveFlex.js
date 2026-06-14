const { headerBar, separator } = require('./flexBuilders');

// การ์ดยืนยัน "คำร้องขอลาวอร์" (มีปุ่มยืนยัน/ยกเลิก)
function generateLeaveFlexMessage(leaveDate) {
  return {
    type: "flex",
    altText: `กรุณายืนยันการแจ้งขอลาวอร์วันที่ ${leaveDate}`, // ข้อความแจ้งเตือนที่ขึ้นบน Notifications
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#233554",
        paddingAll: "20px",
        contents: [
          headerBar("🛡️ GUILD SYSTEM"),
          separator("#5273A5"),
          {
            type: "text",
            text: "คำร้องขอลาวอร์",
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
            backgroundColor: "#152238",
            cornerRadius: "md",
            paddingAll: "12px",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  { type: "text", text: "วันที่ลา :", color: "#88A3C9", size: "sm", flex: 2 },
                  { type: "text", text: leaveDate, wrap: true, color: "#FCE68E", size: "md", flex: 4, weight: "bold" }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                margin: "md",
                contents: [
                  { type: "text", text: "สถานะ :", color: "#88A3C9", size: "sm", flex: 2 },
                  { type: "text", text: "รอการยืนยัน", wrap: true, color: "#4ADE80", size: "sm", flex: 4, weight: "bold" }
                ]
              }
            ]
          },
          {
            type: "text",
            text: "* หากยืนยันแล้ว ระบบจะแจ้งเตือนไปยังหัวหน้ากิลด์",
            color: "#88A3C9",
            size: "xxs",
            align: "center",
            margin: "md"
          }
        ]
      },
      footer: {
        type: "box",
        layout: "horizontal",
        spacing: "md",
        backgroundColor: "#233554",
        paddingStart: "20px",
        paddingEnd: "20px",
        paddingBottom: "20px",
        contents: [
          {
            type: "button",
            style: "primary",
            height: "sm",
            color: "#426496",
            action: {
              type: "postback",
              label: "⭕ ยืนยัน",
              data: `action=confirm_leave&date=${leaveDate}`, // แทรกตัวแปรวันที่ลงใน Payload ของ Postback
              displayText: "ยืนยันการลาวอร์"
            }
          },
          {
            type: "button",
            style: "primary",
            height: "sm",
            color: "#8A3A3A",
            action: {
              type: "postback",
              label: "❌ ยกเลิก",
              data: "action=cancel_process",
              displayText: "ยกเลิกรายการ"
            }
          }
        ]
      }
    }
  };
}

// การ์ดยืนยัน "ขอยกเลิกการลาวอร์" (มีปุ่มยืนยัน/ปิด)
function generateCancelLeaveFlexMessage(cancelDate) {
  return {
    type: "flex",
    altText: `กรุณายืนยันการยกเลิกการลาวอร์วันที่ ${cancelDate}`,
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#3D2B3D",
        paddingAll: "20px",
        contents: [
          headerBar("🛡️ GUILD SYSTEM"),
          separator("#805470"),
          {
            type: "text",
            text: "ขอยกเลิกการลาวอร์",
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
            backgroundColor: "#241724",
            cornerRadius: "md",
            paddingAll: "12px",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  { type: "text", text: "วันที่ยกเลิก :", color: "#C59CB6", size: "sm", flex: 4 },
                  { type: "text", text: cancelDate, wrap: true, color: "#FCE68E", size: "md", flex: 5, weight: "bold" }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                margin: "md",
                contents: [
                  { type: "text", text: "สถานะ :", color: "#C59CB6", size: "sm", flex: 4 },
                  { type: "text", text: "รอการยกเลิก", wrap: true, color: "#FCA5A5", size: "sm", flex: 5, weight: "bold" }
                ]
              }
            ]
          },
          {
            type: "text",
            text: "* หากยืนยันแล้ว รายชื่อคุณจะถูกนำกลับเข้าสู่ปาร์ตี้วอร์",
            color: "#C59CB6",
            size: "xxs",
            align: "center",
            margin: "md",
            wrap: true
          }
        ]
      },
      footer: {
        type: "box",
        layout: "horizontal",
        spacing: "md",
        backgroundColor: "#3D2B3D",
        paddingStart: "20px",
        paddingEnd: "20px",
        paddingBottom: "20px",
        contents: [
          {
            type: "button",
            style: "primary",
            height: "sm",
            color: "#8A3A3A",
            action: {
              type: "postback",
              label: "⭕ ยืนยัน",
              data: `action=confirm_cancelleave&date=${cancelDate}`,
              displayText: "ยืนยันยกเลิกการลาวอร์"
            }
          },
          {
            type: "button",
            style: "primary",
            height: "sm",
            color: "#5C4A5C",
            action: {
              type: "postback",
              label: "❌ ปิด",
              data: "action=cancel_process",
              displayText: "ยกเลิกรายการ"
            }
          }
        ]
      }
    }
  };
}

// การ์ดแจ้งผล "บันทึกการลาสำเร็จ"
function generateLeaveSuccessFlexMessage(leaveDate) {
  return {
    type: "flex",
    altText: `บันทึกการลาวอร์วันที่ ${leaveDate} สำเร็จ`,
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#233554",
        paddingAll: "20px",
        contents: [
          headerBar("🛡️ GUILD SYSTEM"),
          separator("#5273A5"),
          {
            type: "text",
            text: "✅ บันทึกการลาสำเร็จ",
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
            backgroundColor: "#152238",
            cornerRadius: "md",
            paddingAll: "12px",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  { type: "text", text: "วันที่ลา :", color: "#88A3C9", size: "sm", flex: 4 },
                  { type: "text", text: leaveDate, wrap: true, color: "#FCE68E", size: "md", flex: 5, weight: "bold" }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                margin: "md",
                contents: [
                  { type: "text", text: "สถานะ :", color: "#88A3C9", size: "sm", flex: 4 },
                  { type: "text", text: "บันทึกข้อมูลแล้ว", wrap: true, color: "#4ADE80", size: "sm", flex: 5, weight: "bold" }
                ]
              }
            ]
          },
          {
            type: "text",
            text: "* ระบบได้แจ้งเตือนหัวหน้ากิลด์แล้ว ขอให้พักผ่อนอย่างเต็มที่ เจอกันวอร์หน้านะ!",
            color: "#88A3C9",
            size: "xxs",
            align: "center",
            margin: "md",
            wrap: true
          }
        ]
      }
    }
  };
}

// การ์ดแจ้งผล "ยกเลิกการลาสำเร็จ"
function generateCancelSuccessFlexMessage(cancelDate) {
  return {
    type: "flex",
    altText: `ยกเลิกการลาวอร์วันที่ ${cancelDate} สำเร็จ`,
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#3D2B3D",
        paddingAll: "20px",
        contents: [
          headerBar("🛡️ GUILD SYSTEM"),
          separator("#805470"),
          {
            type: "text",
            text: "✅ ยกเลิกการลาสำเร็จ",
            weight: "bold",
            size: "xl",
            color: "#FFFFFF",
            align: "center",
            margin: "lg",
            wrap: true,
            adjustMode: "shrink-to-fit"
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            backgroundColor: "#241724",
            cornerRadius: "md",
            paddingAll: "12px",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  { type: "text", text: "วันที่ :", color: "#C59CB6", size: "sm", flex: 4 },
                  { type: "text", text: cancelDate, wrap: true, color: "#FCE68E", size: "md", flex: 5, weight: "bold" }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                margin: "md",
                contents: [
                  { type: "text", text: "สถานะ :", color: "#C59CB6", size: "sm", flex: 4 },
                  { type: "text", text: "คืนสิทธิ์ลงวอร์", wrap: true, color: "#4ADE80", size: "sm", flex: 5, weight: "bold" }
                ]
              }
            ]
          },
          {
            type: "text",
            text: "* รายชื่อของคุณถูกนำกลับเข้าปาร์ตี้เรียบร้อยแล้ว เตรียมตัวลุย!",
            color: "#C59CB6",
            size: "xxs",
            align: "center",
            margin: "md",
            wrap: true
          }
        ]
      }
    }
  };
}

module.exports = {
  generateLeaveFlexMessage,
  generateCancelLeaveFlexMessage,
  generateLeaveSuccessFlexMessage,
  generateCancelSuccessFlexMessage,
};
