export default async function handler(req, res) {
  const { method, body } = req;

  // Slack URL 검증
  if (method === "POST" && body.type === "url_verification") {
    return res.status(200).json({ challenge: body.challenge });
  }

  // Slack Slash Command 처리
  if (method === "POST" && body.command) {
    console.log("📩 Slash command received:", body);

    const { command, text, user_name } = body;

    // 명령어 처리 로직
    if (command === "/yourcommand") {
      const responseMessage = `Hello, ${user_name}! You said: "${text}"`;

      // 응답 반환
      return res.status(200).json({
        response_type: "in_channel", // 공개 응답 (in_channel) 또는 개인 응답 (ephemeral)
        text: responseMessage,
      });
    }

    return res.status(200).json({ text: "Unknown command" });
  }

  // Slack 이벤트 처리
  if (method === "POST" && body.event) {
    const { event } = body;
    console.log("📩 Slack event received:", event);

    if (event.type === "message") {
      const { text, channel, user } = event;
      console.log(`Message from ${user} in channel ${channel}: ${text}`);
    }

    return res.status(200).send("Event received");
  }

  res.status(405).json({ error: "Method not allowed" });
}
