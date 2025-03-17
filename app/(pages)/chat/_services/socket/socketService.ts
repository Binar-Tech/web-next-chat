import { CreateMessageDto } from "../../_actions/dtos/create-message.dto";
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
    this.client.on("reconnect", () => eventManager.emit("reconnect"));
    this.client.on("new-message", (message) =>
      eventManager.emit("new-message", message)
    );
    this.client.on("accept-call", (message) =>
      eventManager.emit("accept-call", message)
    );
    this.client.on("call-accepted", (call) =>
      eventManager.emit("callUpdate", call)
    );
    this.client.on("logged", (logged) => eventManager.emit("logged", logged));
  }

  login(data: LoginSocketDto) {
    this.client.emit("login", data);
  }

  sendMessage(message: CreateMessageDto) {
    this.client.emit("message", message);
  }

  disconnect() {
    this.client.disconnect();
  }
}

export const socketService = new SocketService();
