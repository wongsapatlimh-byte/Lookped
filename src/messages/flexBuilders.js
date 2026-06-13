// ตัวช่วยสร้างชิ้นส่วน Flex Message ที่ใช้ซ้ำบ่อยในหลายการ์ด (ลดโค้ดซ้ำ)

// แถบหัวข้อด้านบนของการ์ด เช่น "🛡️ GUILD SYSTEM"
function headerBar(text, { color = '#FCE68E', size = 'xs' } = {}) {
  return {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text,
        color,
        weight: 'bold',
        size,
        align: 'center',
      },
    ],
  };
}

// เส้นคั่นใต้แถบหัวข้อ
function separator(color) {
  return {
    type: 'separator',
    margin: 'md',
    color,
  };
}

module.exports = { headerBar, separator };
