export function sendChatMessageStream(
  message: string,
  onToken: (token: string) => void,
  onDone: (data: {
    full: string;
    main: string;
    approval?: any;
    execution?: any;
    action_approval?: any;
  }) => void,
  onError: (err: Error) => void
): () => void {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Chat error: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is empty');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const rawData = trimmed.slice(6);
            if (rawData === '[DONE]') continue;
            try {
              const parsed = JSON.parse(rawData);
              if (parsed.t === 'token' && typeof parsed.d === 'string') {
                onToken(parsed.d);
              } else if (parsed.t === 'done') {
                onDone(parsed);
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE line:', rawData, parseError);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        onError(err);
      }
    }
  })();

  return () => {
    controller.abort();
  };
}
