import type { Namespace } from "socket.io";

import type { GameType } from "@/index";
import { logger } from "@/lib/logger";

export const initSocketServer = (
  io: Namespace,
  name: GameType,
  rooms = false
) => {
  io.on("connection", (socket) => {
    logger.info(`Client connected to ${name} Namespace: ${socket.id}`);

    if (rooms) {
      socket.on("join-room", (interval) => {
        const roomName = `interval-${interval}`;
        socket.join(roomName);
        logger.info(`Socket ${socket.id} joined room: ${roomName}`);
      });

      socket.on("leave-room", (interval) => {
        const roomName = `interval-${interval}`;
        socket.leave(roomName);
        logger.info(`Socket ${socket.id} left room: ${roomName}`);
      });
    } else {
      //
    }
  });
};
