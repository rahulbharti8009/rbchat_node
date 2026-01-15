import fs from "fs";

export default function logReqRes(filename){
    return (req, res, next)=> {
        fs.appendFile(filename, `${new Date().getTime()} ${req.ip}: ${req.method} ${req.path}\n`, (err, data)=> {
            if (err) {
                return res.status(500).json("")
            }
            next()
        })
    }
}


