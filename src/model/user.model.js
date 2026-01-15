import mongoose from "mongoose";
const user = new mongoose.Schema(
  {
    color: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    chat: {
      type: [
        {
          mobile: {
            type: String,
            default: "",
          },
          name: {
            type: String,
            default: "",
          },
          last_message: {
            type: String,
            default: "",
          },
          count: {
            type: Number,
            default: 0,
          },
          color: {
            type: String,
            default: "",
          },
          time: {
            type: String,
            default: "",
          },
          date: {
            type: String,
            default: "",
          },
          timestamp: {
            type: String,
            default: "",
          },
        },
      ],
    },
    invite: {
      type: [
        {
          mobile: {
            type: String,
            default: "",
          },
          name: {
            type: String,
            default: "",
          },
          request_type: {
            type: String,
            default: "",
          },
          color: {
            type: String,
            default: "",
          },
          reject: {
            type: String,
            default: "",
          },
        },
      ],
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("user", user);

