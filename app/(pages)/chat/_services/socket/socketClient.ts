import { io, Socket } from "socket.io-client";

export class SocketClient {
  private socket: Socket | null = null;
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(this.url, { transports: ["websocket"] });

      this.socket.on("connect", () =>
        console.log("🔗 Conectado ao WebSocket!")
      );
      this.socket.on("disconnect", () =>
        console.log("🔌 Desconectado do WebSocket!")
      );
      this.socket.on("error", (error: any) =>
        console.error("⚠️ Erro no WebSocket:", error)
      );
      this.socket.on("reconnect", () =>
        console.error("⚠️WebSicket Reconectado:")
      );
    }
  }

  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
