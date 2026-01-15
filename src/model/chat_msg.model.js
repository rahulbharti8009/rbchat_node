// models/ChatMessage.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: { type: String, default: '' },
    from: { type: String, default: '' },
    clientFrom: { type: String, default: '' },
    clientTo: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    isUnread: { type: Boolean, default: false },
  },
  { _id: false } // no separate _id for each message
);

const chatMessageSchema = new mongoose.Schema(
  {
    chatmsg: {
      type: [
        {
          name: { type: String, default: '' },
          value: { type: [messageSchema], default: [] },
        },
      ],
    }
  },
  { timestamps: true }
);

export const ChatMsg = mongoose.model("chatmsg", chatMessageSchema);
