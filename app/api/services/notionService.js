import { Client } from "@notionhq/client";

// Notion API 설정
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID; // Notion 데이터베이스 ID

/**
 * Notion에 Slack 이벤트를 백로그로 기록
 * @param {Object} event - Slack 이벤트 데이터
 */
export async function createNotionBacklog(event) {
  try {
    const { type, text, user, channel } = event;

    // Notion 백로그에 새 항목 생성
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Title: {
          title: [{ text: { content: `Slack Event: ${type}` } }],
        },
        Message: {
          rich_text: [{ text: { content: text || "No message content" } }],
        },
        User: {
          rich_text: [{ text: { content: user || "Unknown user" } }],
        },
        Channel: {
          rich_text: [{ text: { content: channel || "Unknown channel" } }],
        },
      },
    });

    console.log("✅ Notion backlog created successfully");
  } catch (error) {
    console.error("❌ Error creating Notion backlog:", error);
    throw error;
  }
}
