import axios from "axios";

export const getChatListApi=(io,socket)=> {
    socket.on("getchatList", async (data) => {
      // console.log("getchatList")
        axios
          .post(`${process.env.BASE_URL}api/chat_list`, {mobile : data.mobile})
          .then((response) => {
            io.emit(`chat_list${data.mobile}`, response.data.value);
          })
          .catch((error) => {
            console.error("chat_list error ", error);
          });
      });
}