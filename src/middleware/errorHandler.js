// ตัวจัดการ error กลาง (เดิมโค้ดก้อนนี้ถูกคัดลอกซ้ำอยู่ในทุก route)
// 💡 ถ้าพังตรงไหน มันจะมาโผล่ตรงนี้ ไม่ทำให้ Server ดับชั่วคราว
// หมายเหตุ: ต้องมีพารามิเตอร์ครบ 4 ตัว เพื่อให้ Express รู้ว่าเป็น error handler
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.error('💥 CRASH DETECTED:', err.message);
  res.status(500).send(`Internal Error: ${err.message}`);
};
