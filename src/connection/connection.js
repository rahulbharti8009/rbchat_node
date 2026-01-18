import mongoose from "mongoose";
import fs from "fs";
import axios from "axios";
import { getUsersApi } from "../socket/users.socket.js";
import { getChatListApi } from "../socket/chatlist.socket.js";
import { getInviteListApi } from "../socket/invitelist.socket.js";
import { getInviteUserApi } from "../socket/inviteuser.socket.js";
import { getAcceptUserApi } from "../socket/acceptuser.socket.js";
import { getRejectUserApi } from "../socket/rejectuser.socket.js";
import { readMsg, saveChatMesg, unreadMsg } from "../controller/dashboard.controller.js";

export async function connectMongoDb(params) {
  mongoose
    .connect(params)
    .then(async () => {
      console.log("database is connected");
      // Create uploads folder if not present
      if (!fs.existsSync("uploads")) {
        fs.mkdirSync("uploads");
      }
    })
    .catch(() => {
      console.log("Connection is failed");
    });
}

const connectedUsers = new Map();
const chatingUsers = new Map();

export async function connectSocketIO(io) {
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);
// save mobile number
    if (userId) {
      connectedUsers.set(userId, userId);
    }
    socket.on(`unread`, (user) => {
      console.log(`unread`, user);
      io.emit(`unread${user.reciever}`, user);
    })
// read msg 
    socket.on("readMsg", (data) => {
      console.log("readMsg", data);
      readMsg(data, io,socket);
    })

// conversation msg 
    socket.on("user-message", (msg) => {
      if(!msg.isUnread) {
        unreadMsg(msg);
      }

      console.log("user-message", msg);
      const socketParamsFrom = `message${msg.clientFrom}-${msg.clientTo}`;
      const socketParamsTo = `message${msg.clientTo}-${msg.clientFrom}`;
      if (msg.clientTo == msg.clientFrom) {
        console.log("if ", socketParamsFrom)
        io.emit(socketParamsFrom, msg);
      } else {
        // console.log("else to", socketParamsTo)
        // console.log("else from ", socketParamsFrom)
        io.emit(socketParamsFrom, msg);
        io.emit(socketParamsTo, msg);
          axios
          .post(`${process.env.BASE_URL}api/save_chat_msg`, msg)
          .then((response) => {
            console.log("save_chat_msg success");
          })
          .catch((error) => {
            console.error("save_chat_msg error ", error);
          });
      }
    });
    // group chat
    socket.on("addgroup", (data)=> {
    console.log("addgroup", data)
    const {group_user} = data
    console.log("addgroup", group_user)

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.BASE_URL}api/addchatgroups`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        for(let i = 0; i < group_user.length; i++){
                 const mobile = group_user[i].mobile;
                  console.log("group res", mobile);
                  io.emit(`getGroupApi${mobile}`, mobile); 
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }); // ======= end add group
     // chat one to one
     socket.on("group", (mobile) => {
      console.log("group", mobile);
      let data = JSON.stringify({
        "mobile": mobile
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.BASE_URL}api/getchatgroups`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        // console.log("group res", response.data);
        io.emit(`group${mobile}`,  response.data.value)
      })
      .catch((error) => {
        console.log(error);
      });
    });
  // users
  getUsersApi(io,socket);
  // chat list api
  getChatListApi(io,socket);
  // invite list api
  getInviteListApi(io,socket);
  //add invite list api
  getInviteUserApi(io,socket);
    //accept user
  getAcceptUserApi(io,socket);
//reject user
  getRejectUserApi(io,socket);
    // disconnected
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      // Remove disconnected user
      if (userId) {
        connectedUsers.delete(userId);
      }
    });
  });
}


