const express = require('express');
const line = require('@line/bot-sdk');
const config = require('../config');
const asyncHandler = require('../middleware/asyncHandler');
const handleEvent = require('../handlers/lineEvent');

const router = express.Router();

// ==========================================
// เส้นทางที่ 1: สำหรับรับ Webhook จาก LINE OA
// URL เวลาเอาไปกรอกใน LINE: https://your-cloud-run-url.a.run.app/
// ==========================================
router.post('/', asyncHandler(async (req, res) => {
  // 1. ตรวจสอบความถูกต้องของ Signature (Security)
  const signature = req.headers['x-line-signature'];

  if (!signature || !req.rawBody || !config.channelSecret) {
    console.error('❌ Missing verification data');
    return res.status(400).send('Bad Request');
  }

  // สำคัญ: GCP Functions เก็บ raw body ไว้ที่ req.rawBody
  if (!line.validateSignature(req.rawBody, config.channelSecret, signature)) {
    console.error('Invalid signature');
    return res.status(403).send('Invalid signature');
  }

  // 2. วนลูปจัดการ Events ที่เข้ามา (LINE อาจส่งมาหลาย Event พร้อมกัน)
  try {
    const events = req.body?.events;
    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(200).send('OK');
    }

    await Promise.all(events.map(handleEvent));
    res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
}));

module.exports = router;
