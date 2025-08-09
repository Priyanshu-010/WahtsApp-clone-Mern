import fs from 'fs';
import path from 'path';
import axios from 'axios';

const processPayloads = async () => {
  try {
    const payloadDir = path.resolve('./payloads');
    const files = fs.readdirSync(payloadDir);

    for (const file of files) {
      const filePath = path.join(payloadDir, file);
      const raw = fs.readFileSync(filePath);
      const payload = JSON.parse(raw);

      // Send to backend API to process and store
      const res = await axios.post('http://localhost:3000/api/messages/process-payloads', payload);
      console.log(`✅ Processed ${file}:`, res.data);
    }

    console.log("🎉 All payloads processed successfully!");
  } catch (err) {
    console.error("❌ Error processing payloads:", err.message);
  }
};

processPayloads();
