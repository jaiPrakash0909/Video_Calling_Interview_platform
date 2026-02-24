import express from "express";
import path from "path";
import cors from "cors";
import {serve} from "inngest/express"
import { clerkMiddleware } from '@clerk/express'

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js"
import chatRoutes from "./routes/chatRoutes.js"

const app = express();

const __dirname = path.resolve();


//middleware
app.use(express.json())
//CREDENTIALS:TRUE meaning ?? => server allows a browser to include cookies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))
app.use(clerkMiddleware()); // this adds auth firld to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }))
app.use("/api/chat", chatRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ msg: "success from backend" });
});



//make our app ready for development
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log("Server is running on port", ENV.PORT),
    );
  } catch (error) {
    console.error("Error starting the server",error)
  }
};

startServer();