// ครอบ route handler แบบ async ให้ error ที่เกิดขึ้นถูกส่งต่อไปยัง error middleware กลาง
// แทนที่จะต้องเขียน try/catch ครอบซ้ำในทุก route
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
