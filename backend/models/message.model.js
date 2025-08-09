import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  wa_id: String,
  name: String,
  type: String,
  text: String,
  timestamp: Date,
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  message_id: String,
});

export default mongoose.model('Message', messageSchema);
