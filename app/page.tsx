"use client";

import { useEffect, useState } from "react";

interface SlackNotification {
  type: string;
  text?: string;
}

export default function Home() {
  const [notifications, setNotifications] = useState<SlackNotification[]>([]);

  useEffect(() => {
    // WebSocket 연결
    const ws = new WebSocket("ws://localhost:3000/api/slack");

    // WebSocket 메시지 수신
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Notification received:", data);

      // 새로운 알림을 상태에 추가
      setNotifications((prev) => [...prev, data]);
    };

    // WebSocket 연결 종료 처리
    ws.onclose = () => {
      console.log("🔌 WebSocket connection closed.");
    };

    // 컴포넌트 언마운트 시 WebSocket 연결 해제
    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Slack Notifications</h1>
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
