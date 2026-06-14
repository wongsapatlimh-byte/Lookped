// คืนค่าวันที่/เวลาปัจจุบันในรูปแบบไทย โซนเวลา Asia/Bangkok (GMT+7) เสมอ
function getThaiFormattedDate() {
  const now = new Date();

  // แปลงค่าเวลาให้เป็นโซนไทย (GMT+7) เสมอ ไม่ว่า Server จะอยู่ที่ไหนในโลก
  const thaiTimeStr = now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" });

  const date = new Date(thaiTimeStr);

  // จัดการวันที่ (เติม 0 ด้านหน้าถ้าเป็นเลขหลักเดียว)
  const day = String(date.getDate()).padStart(2, '0');

  // อาร์เรย์ชื่อเดือนภาษาไทยแบบย่อ
  const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  const month = thaiMonths[date.getMonth()];

  // จัดการปี ค.ศ.
  const year = date.getFullYear();

  // จัดการเวลา (ชั่วโมงและนาที เติม 0 ด้านหน้าถ้าเป็นเลขหลักเดียว)
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // นำมารวมกันตามรูปแบบที่ต้องการ
  return `${day} ${month} ${year} ${hours}:${minutes} น.`;
}

module.exports = getThaiFormattedDate;
