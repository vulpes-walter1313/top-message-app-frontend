import { io } from "socket.io-client";
import { getBackendUrl } from "./utils";
export const socket = io(getBackendUrl(), {
  auth: { token: "" },
  autoConnect: false,
});
export async function connectToRoom(room: string) {
  const beUrl = getBackendUrl();
  const res = await fetch(`${beUrl}/user/token`, {
    mode: "cors",
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json();
    console.error("Error fetching auth token for websocket");
    throw new Error(data.error.message);
  }

  const data = await res.json();
  if (data.success && data.token) {
    socket.off();
    socket.disconnect();
    //@ts-expect-error auth.token type is buggy
    socket.auth.token = data.token;
    socket.connect();
    socket.emit("join-room", room);
    console.log("connectToRoom -> data.userId: ", data.userId);
    return data.userId;
  }
}
export function leaveRoom(room: string) {
  socket.emit("leave-room", room);
  console.log("leaving room: ", room);
}
