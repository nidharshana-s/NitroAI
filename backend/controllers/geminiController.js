const FALLBACK_MODELS = ["gemini-3.5-flash", "gemini-2.5-flash"];

async function requestGeminiStream({ model, store, input }) {
  const models = [...new Set([model || FALLBACK_MODELS[0], ...FALLBACK_MODELS])];
  let lastError = "Failed to reach Gemini API";

  for (const modelName of models) {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions?alt=sse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          model: modelName,
          store: store ?? false,
          input,
          stream: true,
        }),
      }
    );

    if (response.ok) {
      return response;
    }

    lastError = await response.text();
    const retryable =
      response.status >= 500 || lastError.includes("high demand");

    if (!retryable) {
      break;
    }
  }

  throw new Error(lastError);
}

const streamGemini = async (req, res) => {
  const { model, store, input } = req.body;

  try {
    const response = await requestGeminiStream({ model, store, input });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    } else {
      res.end();
    }
  }
};

module.exports = { streamGemini };
