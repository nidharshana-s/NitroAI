const API_URL = import.meta.env.VITE_API_URL;

function parseGroqError(text) {
  try {
    const json = JSON.parse(text);
    return json.error?.message || json.error || text;
  } catch {
    return text;
  }
}

export async function* createChatStream({ model, messages }) {
  const response = await fetch(`${API_URL}/api/groq/stream`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages }),
  });

  if (!response.ok) {
    throw new Error(parseGroqError(await response.text()));
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const data = line.slice(6).trim();
      if (data === "[DONE]") return;

      const json = JSON.parse(data);
      if (json.error) {
        throw new Error(json.error.message || "Groq API error");
      }

      const content = json.choices?.[0]?.delta?.content;
      if (content) yield content;
    }
  }
}
