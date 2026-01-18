import multer from "multer";
import fs from "fs";
import path from "path";
import { HttpStatusCode } from "axios";
import { User } from "../model/user.model.js";
import { ChatMsg } from "../model/chat_msg.model.js";

export async function chat_list(req, res) {
  const { mobile} = req.body;

  const user = await User.findOne({ mobile: mobile });
  // console.log("chat list ",user)
  return res.status(HttpStatusCode.Ok).json({
    status: true,
    message: "success",
    value: user.chat,
  });
}

export async function invite_list(req, res) {
  const { mobile} = req.body;
  const user = await User.findOne({ mobile: mobile });

  return res.status(HttpStatusCode.Ok).json({
    status: true,
    message: "success",
    value: user.invite,
  });
}

export async function inviteUser(req, res) {
  const {sender, reciever , mobile,name, color,request_type } = req.body;
  const user = await User.findOne({ mobile: reciever });
    // push new invite user
    user.invite.push({
      mobile,
      name,
      color,
      request_type,
      reject: 'reject'
    });

    await user.save();
    console.log("save")

  return res.status(HttpStatusCode.Ok).json({
    status: true,
    message: "success",
    value: user.invite,
  });
}

export async function acceptUser(req, res) {
  const {sender, reciever} = req.body;

  const senderUser = await User.findOne({ mobile: sender.mobile });
  const recieverUser = await User.findOne({ mobile: reciever.mobile });

    senderUser.chat.push(reciever);
    recieverUser.chat.push(senderUser);

    await senderUser.save();
    await recieverUser.save();

    // invite delete 
    await User.updateOne(
      { mobile: sender.mobile },
      {
        $pull: {
          invite: { mobile: reciever.mobile },
        },
      }
    );
    
  return res.status(HttpStatusCode.Ok).json({
    status: true,
    message: "success",
  });
}


export async function rejectUser(req, res) {
  const {sender, reciever} = req.body;

    // invite delete 
 await User.updateOne(
      { mobile: sender.mobile },
      {
        $pull: {
          invite: { mobile: sender.mobile },
        },
      }
    );

  await User.updateOne(
      { mobile: sender.mobile },
      {
        $pull: {
          invite: { mobile: reciever.mobile },
        },
      }
    );
    
  return res.status(HttpStatusCode.Ok).json({
    status: true,
    message: "delete",
  });
}

export async function unreadMsg(req) {
  const result = await User.updateOne(
    {
      mobile: req.clientTo,
      "chat.mobile": req.clientFrom,
    },
    {
      $set: {
        "chat.$.last_message": req.message,
        "chat.$.time": new Date().toLocaleTimeString(),
        "chat.$.date": new Date().toLocaleDateString(),
        "chat.$.timestamp": Date.now(),
      },
      $inc: {
        "chat.$.count": 1,
      },
    }
  );
}

export async function readMsg(req, io, socket) {
  try {
    const result = await User.updateOne(
      {
        mobile: req.sender,
        "chat.mobile": req.reciever,
      },
      {
        $set: {
          "chat.$.count": 0,
          "chat.$.time": new Date().toLocaleTimeString(),
          "chat.$.date": new Date().toLocaleDateString(),
          "chat.$.timestamp": Date.now(),
        },
      }
    );
    io.emit(`readMsg${req.sender}`);

  } catch (error) {
    console.error("readMsg error:", error);
  }
}


async function upsertChatMessage(name, messageData) {
  // 1️⃣ Try to push message if name exists
  const updated = await ChatMsg.findOneAndUpdate(
    { "chatmsg.name": name },
    {
      $push: {
        "chatmsg.$.value": messageData,
      },
    },
    { new: true }
  );

  // 2️⃣ If name not found → create new entry
  if (!updated) {
    await ChatMsg.create({
      chatmsg: [
        {
          name,
          value: [messageData],
        },
      ],
    });
  }
}


export async function saveChatMesg(req, res) {

    try {
  const {  message, from, clientFrom, clientTo, date, time, isUnread} = req.body
  const fromname =  `${clientFrom}-${clientTo}`
  const toname =  `${clientTo}-${clientFrom}`

    // ---------- SAVE FOR SENDER ----------
    await upsertChatMessage(fromname, req.body);

    // ---------- SAVE FOR RECEIVER ----------
    await upsertChatMessage(toname, req.body);

    return res.status(HttpStatusCode.Ok).json({
      status: true,
      message: "Chat saved successfully",
    });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'error',
      });
    }
}

export async function chatHistory(req, res) {
  try {
    const { name } = req.body;
    console.log(name)
  
    if (!name) {
      return res.status(400).json({
        status: false,
        message: "name is required",
      });
    }
    const chatdata = await ChatMsg.findOne({
      "chatmsg.name": name,
    });
  
     // 2️⃣ If no document found
     if (!chatdata) {
      return res.status(200).json({
        status: true,
        message: "No data available",
        value: [],
      });
    }
    // Extract only the conversation that matches the name
    const conversation = chatdata.chatmsg.find((c) => c.name === name);

   // 4️⃣ If conversation not found (edge case)
   if (!conversation) {
    return res.status(200).json({
      status: true,
      message: "No conversation found",
      value: [],
    });
  }
  // 5️⃣ Success
    return res.status(200).json({
      status: true,
      message: "success",
      value: conversation.value, // 👈 messages array
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
}
}


export async function updateProfile(req, res) {
  try {
    const { mobile, color, name } = req.body;
    const result = await User.updateOne(
      {
        mobile: mobile,
      },
      {
        $set: {
          "color": color,
          "name":name
        },
      }
    );
    const user = await User.findOne({mobile:mobile});

    return res.status(HttpStatusCode.Ok).json({
      status: true,
      message: "Profile updated successfully",
      value : user
    });   

  } catch (error) {
    console.error("readMsg error:", error);
  }
}