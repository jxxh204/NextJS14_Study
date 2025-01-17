import { Client } from "@notionhq/client";

// Notion API 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * Notion 데이터베이스에서 데이터 조회
 * @param {string} databaseId - Notion 데이터베이스 ID
 * @returns {Array} - 조회된 데이터 배열
 */
export async function getDatabaseItems(databaseId) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    // 데이터 가공
    const items = response.results.map((item) => ({
      id: item.id,
      title: item.properties.Name?.title?.[0]?.text?.content || "Untitled", // "Name" 필드를 기준으로 데이터 추출
      status: item.properties.Status?.select?.name || "No Status", // "Status" 필드 추출 (선택 필드)
    }));

    return items; // 가공된 데이터 반환
  } catch (error) {
    console.error("❌ Error fetching Notion database items:", error);
    throw new Error("Failed to fetch Notion database items");
  }
}
