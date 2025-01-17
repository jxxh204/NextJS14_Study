"use client";

import { useEffect, useState } from "react";

interface Notification {
  type: string;
  text?: string;
}

export default function Home() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [status, setStatus] = useState("Disconnected"); // WebSocket 연결 상태

  useEffect(() => {
    // WebSocket 연결
    const ws = new WebSocket("ws://localhost:3000/api/slack");

    // WebSocket 연결 이벤트
    ws.onopen = () => {
      console.log("🌐 WebSocket connected");
      setStatus("Connected");
    };

    // WebSocket 메시지 수신
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Notification received:", data);

      // 알림 추가
      setNotifications((prev) => [...prev, data]);
    };

    // WebSocket 연결 종료
    ws.onclose = () => {
      console.log("🔌 WebSocket connection closed");
      setStatus("Disconnected");
    };

    // WebSocket 오류 처리
    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      setStatus("Error");
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Slack Notifications</h1>
      <p>
        Status: <strong>{status}</strong>
      </p>
      <div style={{ marginTop: "20px" }}>
        {notifications.length === 0 ? (
          <p>No notifications yet...</p>
        ) : (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <strong>{notification.type}</strong>:{" "}
                {notification.text || "No text available"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
