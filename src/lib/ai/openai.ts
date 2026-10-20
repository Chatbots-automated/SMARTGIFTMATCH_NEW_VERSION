import "server-only";
import OpenAI from "openai";

export const CHAT_MODEL = process.env.OPENAI_MODEL || "gpt-5.4-mini";
export const EMBEDDING_MODEL = "text-embedding-3-small"; // 1536 dims, matches the pgvector column
export const EMBEDDING_DIMS = 1536;

export const openai = process.env.OPENAI_API_KEY ? new OpenAI({ timeout: 25_000, maxRetries: 1 }) : null;

export async function embed(texts: string[]) {
  if (!openai) throw new Error("OPENAI_API_KEY is not set");
  const res = await openai.embeddings.create({ model: EMBEDDING_MODEL, input: texts });
  return res.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}
