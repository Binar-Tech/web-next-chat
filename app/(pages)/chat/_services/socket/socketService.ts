import { LoginSocketDto } from "../dto/loginSocket.dto";
import { eventManager } from "./eventManager";
import { SocketClient } from "./socketClient";

class SocketService {
  private client: SocketClient;

  constructor() {
    this.client = new SocketClient("ws://10.0.1.121:4000");
  }

  connect() {
    this.client.connect();

    this.client.on("connect", () => eventManager.emit("connect"));
    this.client.on("disconnect", () => eventManager.emit("disconnect"));
    this.client.on("message", (message) =>
      eventManager.emit("message", message)
    );
    this.client.on("callUpdate", (call) =>
      eventManager.emit("callUpdate", call)
    );
  }

  login(data: LoginSocketDto) {
    this.client.emit("login", data);
  }

  sendMessage(chatId: number, message: string) {
    this.client.emit("sendMessage", { chatId, message });
  }

  disconnect() {
    this.client.disconnect();
  }
}

export const socketService = new SocketService();
