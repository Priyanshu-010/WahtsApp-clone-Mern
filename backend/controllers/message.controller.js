import Message from '../models/message.model.js';
import fs from 'fs';
import path from 'path';

export const getAllConversations = async (req, res) => {
  const messages = await Message.find({});
  const grouped = {};

  messages.forEach(msg => {
    if (!grouped[msg.wa_id]) grouped[msg.wa_id] = [];
    grouped[msg.wa_id].push(msg);
  });

  res.json(grouped);
};

export const getMessagesByUser = async (req, res) => {
  const wa_id = req.params.wa_id;
  const messages = await Message.find({ wa_id }).sort({ timestamp: 1 });
  res.json(messages);
};

export const sendMessage = async (req, res) => {
  try {
    const { wa_id, name, text } = req.body;

    const newMsg = await Message.create({
      wa_id,
      name,
      type: 'text',
      text,
      timestamp: new Date(),
      status: 'sent',
      message_id: `msg-${Date.now()}`
    });

    if (global.io) {
      global.io.emit('new-message', newMsg);
    }

    // Simulate delivered after 2s
    setTimeout(async () => {
      const updated = await Message.findByIdAndUpdate(
        newMsg._id,
        { status: 'delivered' },
        { new: true }
      );
      if (global.io) {
        global.io.emit('message-status-update', updated);
      }
    }, 2000);

    // Simulate read after 4s
    setTimeout(async () => {
      const updated = await Message.findByIdAndUpdate(
        newMsg._id,
        { status: 'read' },
        { new: true }
      );
      if (global.io) {
        global.io.emit('message-status-update', updated);
      }
    }, 4000);

    res.json(newMsg);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};




export const processPayloads = async (req, res) => {
  try {
    const payload = req.body;

    if (payload.type === 'message') {
      await Message.create({
        wa_id: payload.wa_id,
        name: payload.name,
        text: payload.text,
        type: payload.type,
        timestamp: new Date(payload.timestamp),
        message_id: payload.message_id,
        status: 'sent'
      });
    } 
    else if (payload.type === 'status') {
      await Message.findOneAndUpdate(
        { message_id: payload.meta_msg_id },
        { status: payload.status }
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process payload' });
  }
};
