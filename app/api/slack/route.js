import { getDatabaseItems } from "../services/notionService";

export async function GET(req) {
  try {
    // GET 요청의 URL에서 쿼리 매개변수 추출
    const { searchParams } = new URL(req.url); // 요청 URL에서 쿼리 파라미터 추출
    const databaseId =
      searchParams.get("databaseId") ||
      process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;

    // Notion 데이터베이스에서 데이터 가져오기
    const notionData = await getDatabaseItems(databaseId);
    // API token is invalid 오류 생김
    return new Response(
      JSON.stringify({ message: "Request received successfully", notionData }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error handling GET request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
