import { getDatabaseItems } from "../services/notionService";

export async function GET(req) {
  try {
    const body = await req.json(); // Slack 요청의 바디를 파싱
    console.log("📩 Received Slack POST Request:", body); // Slack 요청 로그 출력

    // Optional: Notion 데이터베이스에서 데이터를 가져올 경우
    const databaseId = process.env.NOTION_DATABASE_ID; // Notion 데이터베이스 ID
    const notionData = await getDatabaseItems(databaseId);

    return new Response(
      JSON.stringify({ message: "Request received successfully", notionData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error handling Slack request:", error); // 에러 로그 출력
    return new Response(
      JSON.stringify({ error: "Failed to process Slack request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
