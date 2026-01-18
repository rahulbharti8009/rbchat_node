import { HttpStatusCode } from "axios";
import { User } from "../model/user.model.js";
import { randomColor } from "../utils/common.js";

export async function login(req, res) {
  const { mobile } = req.body;

  const user = await User.findOne({ mobile: mobile });
  if (user) {
    return res.status(HttpStatusCode.Ok).json({
      status: true,
      message: "mobile no is already exist",
      value: user,
    });
  }
  //   const users = await User.create({ mobile: mobile , color:randomColor()});

  const users = await User.create({ mobile: mobile , color:'#DD9C0F'});

  return res.status(HttpStatusCode.Ok).json({
    status: true,
    message: "User is created.",
    value: users,
  });
}

export async function users(req, res) {
  const { mobile } = req.body;
  const users = await User.find({ mobile: { $ne: mobile } }).lean();
  // const users = await User.find({}).lean();
  const updatedUsers = users.map(user => {
        const isInChat = Array.isArray(user.chat) && user.chat.some(ch => ch.mobile === mobile);
        const isInvited = Array.isArray(user.invite) && user.invite.some(inv => inv.mobile === mobile);
        let requestType = "invite";

        if (isInChat) {
          requestType = "";
        } else if (isInvited) {
          console.log(isInvited)
          requestType = "pending";
        }

        return {
          ...user,
          requestType,
        };
      });

    return res.status(HttpStatusCode.Ok).json({
      status: true,
      message: "success",
      value: updatedUsers,
    });
}

