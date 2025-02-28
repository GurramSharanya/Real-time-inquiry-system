import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Create WebSocket server
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // Allow frontend connections
});

app.use(cors());
app.use(express.json());

let inquiries = [];

// ✅ Handle API for inquiries
app.get("/api/inquiries", (req, res) => {
  res.json(inquiries);
});

app.post("/api/inquiries", (req, res) => {
  const { userId, title, description } = req.body;

  if (!userId || !title || !description) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newInquiry = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    title,
    description,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inquiries.push(newInquiry);
  io.emit("inquiryUpdated", newInquiry); // ✅ Send real-time update

  res.status(201).json(newInquiry);
});

// ✅ Handle status updates
app.put("/api/inquiries/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const inquiry = inquiries.find(inq => inq.id === id);
  if (!inquiry) {
    return res.status(404).json({ error: "Inquiry not found" });
  }

  inquiry.status = status;
  inquiry.updatedAt = new Date().toISOString();
  io.emit("statusUpdated", { inquiryId: id, status }); // ✅ Send real-time status update

  res.json(inquiry);
});

// ✅ WebSocket connection handling
io.on("connection", (socket) => {
  console.log("🔗 A user connected");

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });

  socket.on("newInquiry", (inquiry) => {
    inquiries.push(inquiry);
    io.emit("inquiryUpdated", inquiry);
  });
});

// ✅ Start the backend server
server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
