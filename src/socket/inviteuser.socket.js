import axios from "axios";

export const getInviteUserApi=(io,socket)=> {
  socket.on("inviteuser", async (data) => {
    console.log("inviteuser")
    axios
      .post(`${process.env.BASE_URL}api/invite_user`, data)
      .then((response) => {
        io.emit("invite_user", response.data.value);
      })
      .catch((error) => {
        console.error("invite_user error ", error);
      });
  });
}