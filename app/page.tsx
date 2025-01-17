"use client";

import { useState } from "react";

export default function Home() {
  const [logMessages, setLogMessages] = useState<string[]>([]); // 타입 추가
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리

  // Slack API 호출
  const sendSlackRequest = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      console.log("🚀 Sending request to /api/slack...");
      setLogMessages((prev) => [
        ...prev,
        "🚀 Sending request to /api/slack...",
      ]);

      // Slack API 호출
      const response = await fetch("/api/slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "Test Event", data: "Hello Slack" }),
      });

      if (!response.ok) {
        throw new Error("Failed to send Slack request");
      }

      const data = await response.json();
      console.log("✅ Slack API Response:", data);
      setLogMessages((prev) => [
        ...prev,
        `✅ Slack API Response: ${JSON.stringify(data)}`,
      ]);
    } catch (error: any) {
      console.error("❌ Error sending Slack request:", error);
      setLogMessages((prev) => [...prev, `❌ Error: ${error.message}`]);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Slack API Tester</h1>
      <button
        onClick={sendSlackRequest}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Slack Request"}
      </button>
      <div style={{ marginTop: "20px", textAlign: "left" }}>
        <h3>Logs:</h3>
        <ul>
          {logMessages.map((msg, index) => (
            <li
              key={index}
              style={{ marginBottom: "10px", wordWrap: "break-word" }}
            >
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
