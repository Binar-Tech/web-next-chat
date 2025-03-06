import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io("ws://10.0.1.121:4000", {
        transports: ["websocket"],
      });

      this.socket.on("connect", () => {
        console.log("🔗 Conectado ao WebSocket!");

        // Enviar login automaticamente após conectar
        // this.login({
        //   nome: "Usuário Teste",
        //   cnpj: "12345678901234",
        //   type: "TECNICO",
        // });
      });

      this.socket.on("disconnect", () => {
        console.log("🔌 Desconectado do WebSocket!");
      });

      this.socket.on("error", (error: any) => {
        console.error("⚠️ Erro no WebSocket:", error);
      });
    }
  }

  login(data: {
    nome: string;
    cnpj?: string | null;
    type: "OPERADOR" | "TECNICO";
  }) {
    if (this.socket) {
      this.socket.emit("login", data);
      console.log("📤 Enviando login:", data);
    } else {
      console.error("❌ Socket não conectado");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
