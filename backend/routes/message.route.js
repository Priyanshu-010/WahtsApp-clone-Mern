import express from 'express';
import {
  getAllConversations,
  getMessagesByUser,
  sendMessage,
  processPayloads,
} from '../controllers/message.controller.js';

const router = express.Router();

router.get('/conversations', getAllConversations);
router.get('/:wa_id', getMessagesByUser);
router.post('/send', sendMessage);
router.post('/process-payloads', processPayloads);

export default router;
