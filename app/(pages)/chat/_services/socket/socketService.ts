import { AcceptCallDto } from "../../_actions/dtos/accept-call.dto";
import { CreateMessageDto } from "../../_actions/dtos/create-message.dto";
import { EnterChatDto } from "../../_actions/dtos/enter-chat.dto";
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

    this.client.on("accepted-call", (call) =>
      eventManager.emit("accepted-call", call)
    );
    this.client.on("entered-call", (call) =>
      eventManager.emit("entered-call", call)
    );

    this.client.on("leaved-call", (call) =>
      eventManager.emit("leaved-call", call)
    );
    this.client.on("logged", (logged) => eventManager.emit("logged", logged));
  }

  login(data: LoginSocketDto) {
    this.client.emit("login", data);
  }

  sendMessage(message: CreateMessageDto) {
    this.client.emit("message", message);
  }

  acceptCall(message: AcceptCallDto) {
    this.client.emit("accept-call", message);
  }

  enterCall(message: EnterChatDto) {
    this.client.emit("enter-call", message);
  }
  leaveCall(message: EnterChatDto) {
    this.client.emit("leave-call", message);
  }

  disconnect() {
    this.client.disconnect();
  }
}

export const socketService = new SocketService();
