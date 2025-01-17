import { getDatabaseItems } from "../services/notionService";

// Notion 데이터베이스 ID
const databaseId = process.env.NOTION_DATABASE_ID;

export async function POST(req) {
  try {
    const body = await req.json(); // Slack에서 보낸 요청 바디를 파싱
    console.log("📩 Slack POST Request:", body);

    // Notion 데이터베이스에서 데이터 조회
    const notionItems = await getDatabaseItems(databaseId);

    // Slack 요청에 응답
    return new Response(JSON.stringify({ data: notionItems }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error handling Slack request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process Slack request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
