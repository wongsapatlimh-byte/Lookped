const functions = require('@google-cloud/functions-framework');
const app = require('./src/app');

// ลงทะเบียน Cloud Function (HTTP) โดยใช้ Express app เป็น handler
// ชื่อ target ต้องเป็น 'lookpedWebhook' เหมือนเดิม เพื่อให้ deploy บน Cloud Run/Functions ทำงานต่อได้
functions.http('lookpedWebhook', app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AirZpot LINE Bot Server is running on port ${PORT}`);
});
