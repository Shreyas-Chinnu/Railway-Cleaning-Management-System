import { NextApiResponse } from "next";
import initializeSocket from "../pages/socket";
import { sendTaskReminders } from "@/lib/taskReminder";

export default function handler(req: any, res: NextApiResponse) {
  if ((res.socket as any)?.server?.io) {
    res.end();
    return;
  }

  const io = initializeSocket(res, req);
  (res.socket as any).server.io = io;

  setInterval(() => {
    sendTaskReminders();
  }, 3600000); // Every 1 hour

  res.end();
}
