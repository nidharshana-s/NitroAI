const API_URL = import.meta.env.VITE_API_URL;

function parseGeminiError(text) {
  try {
    const json = JSON.parse(text);
    if (typeof json.error === "string") {
      const match = json.error.match(/data: ({.*})/);
      if (match) {
        const data = JSON.parse(match[1]);
        return data.error?.message || json.error;
      }
      return json.error;
    }
    return json.error?.message || text;
  } catch {
    return text;
  }
}

export async function* createInteractionStream({ model, store, input }) {
  const response = await fetch(`${API_URL}/api/gemini/stream`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, store, input }),
  });

  if (!response.ok) {
    throw new Error(parseGeminiError(await response.text()));
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      let eventType = null;
      for (const line of part.split("\n")) {
        if (line.startsWith("event: ")) {
          eventType = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));
          if (!data.event_type && eventType) {
            data.event_type = eventType;
          }
          if (data.event_type === "error") {
            throw new Error(data.error?.message || "Gemini API error");
          }
          yield data;
          eventType = null;
        }
      }
    }
  }
}
