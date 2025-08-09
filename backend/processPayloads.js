import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_BASE = process.env.API_BASE;

const processPayloads = async () => {
  try {
    const payloadDir = path.resolve('./payloads');
    const files = fs.readdirSync(payloadDir);

    for (const file of files) {
      const filePath = path.join(payloadDir, file);
      const raw = fs.readFileSync(filePath);
      const payload = JSON.parse(raw);
      
      if (payload.payload_type === 'whatsapp_webhook') {
        const change = payload.metaData.entry?.[0]?.changes?.[0];
        const value = change?.value;

        const contact = value?.contacts?.[0];
        const message = value?.messages?.[0];

        if (!contact || !message) {
          console.warn(`Skipped ${file} — no message data found`);
          continue;
        }

        const wa_id = contact.wa_id;
        const name = contact.profile?.name || 'Unknown';
        const text = message.text?.body || '';
        const timestamp = new Date(parseInt(message.timestamp) * 1000);
        const message_id = message.id;

        await axios.post(`${API_BASE || "http://localhost:3000"}/api/messages/process-payloads`, {
          type: 'message',
          wa_id,
          name,
          text,
          timestamp,
          message_id
        });

        console.log(`Processed message payload: ${file}`);
        continue;
      }

      await axios.post(`${API_BASE || "http://localhost:3000"}/api/messages/process-payloads`, payload);
      console.log(`Processed simple payload: ${file}`);
    }

    console.log("All payloads processed successfully!");
  } catch (err) {
    console.error(`Error processing payloads:`, err.message);
  }
};

processPayloads();
