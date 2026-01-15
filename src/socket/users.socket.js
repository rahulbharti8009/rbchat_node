import axios from "axios";

export const getUsersApi=(io,socket)=> {
    socket.on("getUsers", async (mobile) => {
        console.log("getUser ")
        axios
          .post(`${process.env.BASE_URL}api/users`, {mobile : mobile})
          .then((response) => {
            io.emit("users", response.data.value);
          })
          .catch((error) => {
            console.error("users error ", error);
          });
      });
}