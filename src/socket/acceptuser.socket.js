import axios from "axios";

export const getAcceptUserApi=(io,socket)=> {
  socket.on("acceptuser", async (params) => {
    console.log("acceptuser")
    axios
      .post(`${process.env.BASE_URL}api/accept_user`, params)
      .then((response) => {
        io.emit(`accept_user`);
      })
      .catch((error) => {
        console.error("acceptuser error ", error);
      });
  });
}