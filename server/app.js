import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v4 } from "uuid";
import cors from "cors";
import bodyParser from "body-parser";
import "dotenv/config";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let meetingsOnline = [];
let usersOnline = [];

app.post("/api/v1/check-meeting-exist", (req, res) => {
  const meetingId = req.body.meetingIdInput;

  if (meetingsOnline.includes(meetingId)) {
    return res.status(200).send("Meeting exist");
  } else {
    return res.status(404).send("Invalid code");
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("create-meeting", async (name) => {
    const meetingId = v4();
    meetingsOnline.push(meetingId);
    socket.join(meetingId);

    usersOnline.push({ socketId: socket.id, meetingId, name });

    socket.emit("meeting-created", meetingId);
  });

  socket.on("join-meeting", async (name, meetingId) => {
    console.log(name, meetingId);
    socket.join(meetingId);

    usersOnline.push({ socketId: socket.id, meetingId, name });

    io.to(meetingId).emit("meeting-joined", `${name} joined the meeting`);
  });

  socket.on("get-peerId", (peerId, meetingId) => {
    if (peerId) {
      socket.to(meetingId).emit("get-peerId", peerId);
    }
  });

  socket.on("toggleVideo", (peerId, isVideoOn, meetingId, name) => {
    console.log(`peerId: ${peerId} isVideoOn: ${isVideoOn} name: ${name}`);

    socket.to(meetingId).emit("toggleVideo", peerId, isVideoOn, name);
  });

  socket.on("toggleMic", (peerId, isMicOn, meetingId, name) => {
    console.log(`peerId: ${peerId} isMicOn: ${isMicOn} name: ${name}`);

    socket.to(meetingId).emit("toggleMic", peerId, isMicOn, name);
  });

  socket.on("disconnected-user-peerId", (peerId, meetingId) => {
    socket.to(meetingId).emit("disconnected-user-peerId", peerId);
  });

  socket.on("get-participants", (meetingId) => {
    const participants = usersOnline.filter(
      (obj) => obj.meetingId === meetingId
    );
    io.to(meetingId).emit("get-participants-list", participants);
  });

  socket.on("message", (data) => {
    console.log(data);
    // io.to(data.meetingId).emit("message", `${data.name}: ${data.message}`);
    socket.to(data.meetingId).emit("message", `${data.name}: ${data.message}`);
  });

  socket.on("disconnect", async () => {
    try {
      const disconnectedUser = await usersOnline.find(
        (user) => user.socketId === socket.id
      ); // for the user name to emit

      socket
        .to(disconnectedUser.meetingId)
        .emit("user-left", `${disconnectedUser.name} left the meeting`);

      // remove the user from the array
      usersOnline = usersOnline.filter((user) => user.socketId !== socket.id);
    } catch (error) {
      console.log(error);
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
