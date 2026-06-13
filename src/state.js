// เก็บสถานะชั่วคราวของผู้ใช้ระหว่างขั้นตอนลงทะเบียน (รอชื่อตัวละคร / รอ username)
// หมายเหตุ: เป็น in-memory ต่อ instance เท่านั้น ถ้า Cloud Run สเกลหลาย instance
// หรือรีสตาร์ท สถานะนี้จะหาย (พฤติกรรมเดิมไม่เปลี่ยน)
const tempUserState = {};

module.exports = tempUserState;
