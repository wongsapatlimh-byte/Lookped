const functions = require('@google-cloud/functions-framework');
const app = require('./src/app');

// ลงทะเบียน Cloud Function (HTTP) โดยใช้ Express app เป็น handler
// ชื่อ target ต้องเป็น 'lookpedWebhook' เหมือนเดิม เพื่อให้ deploy บน Cloud Run/Functions ทำงานต่อได้
functions.http('lookpedWebhook', app);
