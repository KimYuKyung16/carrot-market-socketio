import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors())
app.use(express.json());


let roomNum = '1';

io.on('connection', (socket: any) => {
  socket.on('setRoomNum', (num: number) => {
    if (num) {
      socket.join(String(num));
      console.log(num, '방에 입장했습니다')
    }
  })

  socket.on('message', (msg: any) => {
    io.to(msg.roomNum).emit('send Message', msg.message);
    if (msg.message.message === "거래가 완료되었습니다" && msg.message.notification) {
      io.to(msg.roomNum).emit('review', msg.message.userId);
    }
  });

  socket.on('deleteMessage', (msg: any) => {
    io.to(msg.roomNum).emit('delete Message', msg.message);
  });

  socket.on('leaveRoom', (roomNum: string) => {
    socket.leave(roomNum);
  })
});


httpServer.listen(5000, () => {
  console.log(`5000 Server ...`);
});