import axios from "axios";

export const getRejectUserApi=(io,socket)=> {
  socket.on("rejectuser", async (params) => {
    console.log("rejectuser")
    axios
      .post(`${process.env.BASE_URL}api/reject_user`, params)
      .then((response) => {
        io.emit(`reject_user`);
      })
      .catch((error) => {
        console.error("rejectuser error ", error);
      });
  });
}