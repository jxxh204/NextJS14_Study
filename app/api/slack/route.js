import { WebSocketServer } from "ws";
import { createNotionBacklog } from "../../../services/notionService";

let wss; // WebSocket 서버 인스턴스

export async function POST(req) {
  const body = await req.json();

  // Slack URL 검증
  if (body.type === "url_verification") {
    console.log("🔑 Slack URL verification request received");
    return new Response(JSON.stringify({ challenge: body.challenge }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Slack 이벤트 처리
  if (body.event) {
    const { event } = body;

    console.log("📩 Slack Event Received:", event);

    // Notion에 백로그 작성
    try {
      await createNotionBacklog(event);
    } catch (error) {
      console.error("❌ Failed to save backlog to Notion");
    }

    // WebSocket 클라이언트에게 알림 전송
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(event)); // 이벤트 데이터를 WebSocket 클라이언트로 전송
        }
      });
    }

    return new Response("Event received", { status: 200 });
  }

  return new Response("Unsupported request", { status: 400 });
}

export const config = {
  api: {
    bodyParser: false, // WebSocket 업그레이드 지원
  },
};

// WebSocket 서버 초기화
if (!global.wss) {
  global.wss = new WebSocketServer({ noServer: true });

  // WebSocket 연결 처리
  global.wss.on("connection", (ws) => {
    console.log("🌐 New WebSocket connection established!");

    ws.on("message", (message) => {
      console.log("📩 Message from client:", message);
    });

    ws.on("close", () => {
      console.log("🔌 WebSocket connection closed.");
    });
  });

  // WebSocket 업그레이드 처리
  global.server.on("upgrade", (request, socket, head) => {
    if (request.url === "/api/slack") {
      global.wss.handleUpgrade(request, socket, head, (ws) => {
        global.wss.emit("connection", ws, request);
      });
    }
  });

  wss = global.wss;
}
