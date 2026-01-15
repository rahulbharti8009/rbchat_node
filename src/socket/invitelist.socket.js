import axios from "axios";

export const getInviteListApi=(io,socket)=> {
    socket.on("getInviteList", async (data) => {
      // console.log("getInviteList")
        axios
          .post(`${process.env.BASE_URL}api/invite_list`,{mobile : data.mobile})
          .then((response) => {
            io.emit(`invite_list${data.mobile}`, response.data.value);
          })
          .catch((error) => {
            console.error("invite_list error ", error);
          });
      });
}