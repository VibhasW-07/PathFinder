import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';

// Basic role type for conversation history
type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

const GEMINI_MODEL_PRIMARY = 'gemini-1.5-pro-002';
const GEMINI_MODEL_FALLBACK = 'gemini-1.5-flash-latest';

export default function ChatBot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hi! I\'m your PathFinder Assistant. Ask me anything about careers, colleges, courses, scholarships, or general questions. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function callGemini(history: ChatMessage[]): Promise<string> {
    if (!apiKey) {
      return 'The AI service is not configured. Please set VITE_GEMINI_API_KEY in your env file.';
    }

    // Compose content: convert chat history into a single user prompt for REST API
    const systemPreamble =
      'You are PathFinder Assistant, a helpful, reliable, and concise educational and career guidance chatbot. ' +
      'Always answer with clear, contextual responses. If you cite facts, be accurate. If you are unsure, say so and suggest how to verify. ' +
      'Keep answers concise by default, but ensure they are sufficient to solve the user\'s question.';

    const mergedText =
      `SYSTEM:\n${systemPreamble}\n\n` +
      history
        .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n');

    const body = {
      contents: [{ role: 'user', parts: [{ text: mergedText }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 768 }
    };

    async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
      } finally {
        clearTimeout(id);
      }
    }

    const models = [GEMINI_MODEL_PRIMARY, GEMINI_MODEL_FALLBACK];
    for (const model of models) {
      try {
        const resp = await fetchWithTimeout(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
          20000
        );
        if (!resp.ok) continue;
        const data = await resp.json();
        const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        if (text && text.trim().length) return text.trim();
      } catch {
        // try next model
      }
    }
    return 'Sorry, I could not reach the AI service right now. Please try again in a moment.';
  }

  async function onSend() {
    if (!canSend) return;
    const userText = input.trim();
    const nextHistory = [...messages, { role: 'user', content: userText } as ChatMessage];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);
    const reply = await callGemini(nextHistory);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <>
      <Helmet>
        <title>ChatBot | PathFinder Assistant</title>
        <meta name="description" content="Ask the PathFinder Assistant any question and get instant help." />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">PathFinder Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={viewportRef}
                className="h-[60vh] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                {messages.map((m, idx) => (
                  <div key={idx} className="mb-4">
                    <div className={`text-xs mb-1 ${m.role === 'assistant' ? 'text-blue-600' : 'text-gray-500'}`}>
                      {m.role === 'assistant' ? 'Assistant' : m.role === 'user' ? (user?.email || 'You') : 'System'}
                    </div>
                    <div
                      className={`whitespace-pre-wrap leading-relaxed rounded-md px-3 py-2 ` +
                        (m.role === 'assistant'
                          ? 'bg-white border border-gray-200 text-gray-900'
                          : 'bg-gray-900 text-white')}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-sm text-gray-600">Thinking…</div>
                )}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Textarea
                  placeholder="Type your message (Shift+Enter for new line, Enter to send)"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="min-h-[80px] bg-white text-gray-900 placeholder-gray-500 border border-gray-300"
                />
                <div className="flex sm:flex-col gap-3">
                  <Button
                    onClick={onSend}
                    disabled={!canSend}
                    className="bg-black text-white hover:bg-black/90"
                  >
                    Send
                  </Button>
                </div>
              </div>
              {!apiKey && (
                <div className="mt-3 text-xs text-red-600">
                  Missing VITE_GEMINI_API_KEY. Please add it to your env file and restart the dev server.
                </div>
              )}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}
