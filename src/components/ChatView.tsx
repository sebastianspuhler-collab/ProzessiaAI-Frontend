import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, FileText } from 'lucide-react';
import { api } from '../lib/api';
import { DEMO_CONTENT } from '../lib/demoContent';
import type {
  Message,
  Chat,
  RAGSource,
  MentionItem,
  ChatResponse,
  Attachment,
  Agent,
  Workflow,
} from '../types';

export function ChatView({
  chat,
  onUpdateChat,
  pendingInput,
  onPendingInputConsumed,
}: {
  chat: Chat;
  onUpdateChat: (messages: Message[]) => void;
  pendingInput?: string;
  onPendingInputConsumed?: () => void;
}) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionItems, setMentionItems] = useState<MentionItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pendingInput) {
      setInput(pendingInput);
      onPendingInputConsumed?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingInput]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages, loading]);

  const handleInputChange = async (value: string) => {
    setInput(value);
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const query = value.slice(atIndex + 1).toLowerCase();
      setShowMentions(true);
      try {
        const [agentsData, workflowsData, docsData] = await Promise.all([
          api.get<{ agents: Agent[] }>('/api/agents'),
          api.get<{ workflows: Workflow[] }>('/api/workflows'),
          api.get<{ documents: { id: string; filename: string }[] }>('/api/rag/upload'),
        ]);
        const items: MentionItem[] = [
          ...(agentsData.agents ?? []).map((a) => ({ id: a.id, label: a.name, type: 'Agent' as const })),
          ...(workflowsData.workflows ?? []).map((w) => ({ id: w.id, label: w.name, type: 'Workflow' as const })),
          ...(docsData.documents ?? []).map((d) => ({ id: d.id, label: d.filename, type: 'Dokument' as const })),
        ].filter((i) => i.label.toLowerCase().includes(query));
        setMentionItems(items.slice(0, 6));
      } catch {
        setMentionItems([]);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (item: MentionItem) => {
    const atIndex = input.lastIndexOf('@');
    setInput(input.slice(0, atIndex) + `@${item.label} `);
    setShowMentions(false);
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const base64 = reader.result.split(',')[1];
      setAttachment({ name: file.name, base64, mime: file.type });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const sendMessage = async () => {
    if (!input.trim() && !attachment) return;
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      attachments: attachment ? [attachment.name] : undefined,
    };
    const newMessages = [...chat.messages, userMessage];
    onUpdateChat(newMessages);
    setInput('');
    setAttachment(null);
    setLoading(true);
    try {
      const data = await api.post<ChatResponse>('/api/chat?stream=false', {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        enableRAG: true,
      });
      onUpdateChat([...newMessages, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.text ?? '',
        sources: data.sources ?? [],
        suggestions: data.suggestions ?? [],
        timestamp: new Date(),
      }]);
    } catch {
      onUpdateChat([...newMessages, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Verbindungsfehler – bitte erneut versuchen.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text: string): string =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-zinc-100 px-1 rounded text-[13px]">$1</code>')
      .replace(/\n/g, '<br/>');

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden bg-[#FAFAFA]">

        {/* Header */}
        <div className="px-7 py-4 bg-white border-b border-[#E4E4E7] shrink-0">
          <h1 className="text-[20px] font-bold tracking-[-0.04em] text-[#09090B] leading-none">
            Prozessia AI
          </h1>
          <p className="text-[12px] text-[#A1A1AA] mt-1">Ihr intelligenter Unternehmens-Assistent</p>
        </div>

        {/* Leerer Zustand */}
        {chat.messages.length === 0 && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#09090B] mb-2">
              Wie kann ich Ihnen helfen?
            </h2>
            <p className="text-[14px] text-[#52525B] mb-8">
              Fragen Sie alles – ich habe Zugriff auf Ihr Unternehmenswissen.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-[480px]">
              {DEMO_CONTENT.chatSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="p-3 bg-white border border-[#E4E4E7] rounded-[10px] text-[13px] font-medium text-[#52525B] text-left hover:border-[#D1D1D6] hover:shadow-sm transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nachrichten */}
        {(chat.messages.length > 0 || loading) && (
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
            {chat.messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-[8px] bg-[#18181B] flex items-center justify-center text-white text-[11px] font-semibold shrink-0 mt-0.5">
                    P
                  </div>
                )}
                <div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3.5 py-2.5 text-[14px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-[#09090B] font-medium'
                      : 'text-[#09090B]'
                  }`}>
                    {msg.attachments?.map((a) => (
                      <div key={a} className="flex items-center gap-1.5 mb-2 text-[12px] text-[#A1A1AA]">
                        <FileText size={12} />{a}
                      </div>
                    ))}
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-col gap-0.5 px-3.5">
                      {msg.sources.slice(0, 3).map((s: RAGSource, i: number) => (
                        <p key={i} className="text-[12px] text-[#A1A1AA] leading-relaxed">
                          Quelle: {s.title}
                        </p>
                      ))}
                    </div>
                  )}
                  <span className="text-[11px] text-[#A1A1AA] px-3.5">
                    {msg.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-[8px] bg-[#18181B] flex items-center justify-center text-white text-[11px] font-semibold shrink-0">P</div>
                <div className="bg-white border border-[#E4E4E7] rounded-[12px] rounded-tl-[4px] px-4 py-3 flex gap-1.5 shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#A1A1AA] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="px-6 pb-5 pt-3 bg-[#FAFAFA] border-t border-[#E4E4E7]">
          {attachment && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="flex items-center gap-1.5 bg-white border border-[#E4E4E7] rounded-[6px] px-2.5 py-1.5 text-[12px] text-[#52525B]">
                <FileText size={12} />{attachment.name}
                <button onClick={() => setAttachment(null)} className="ml-1 text-[#A1A1AA] hover:text-[#52525B]">
                  <X size={11} />
                </button>
              </div>
            </div>
          )}
          {showMentions && mentionItems.length > 0 && (
            <div className="mb-2 bg-white border border-[#E4E4E7] rounded-[8px] shadow-md overflow-hidden">
              {mentionItems.map((item) => (
                <button key={item.id} onClick={() => insertMention(item)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] hover:bg-[#F4F4F5] text-left">
                  <span className="text-[#A1A1AA] text-[11px] w-16 shrink-0">{item.type}</span>
                  <span className="font-medium text-[#09090B]">{item.label}</span>
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2 bg-white border border-[#E4E4E7] rounded-[12px] px-3 py-2 shadow-sm focus-within:border-[#D1D1D6]">
            <button onClick={() => fileRef.current?.click()} className="text-[#A1A1AA] hover:text-[#52525B] p-1 transition-colors shrink-0">
              <Paperclip size={16} />
            </button>
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.xlsx,.txt" onChange={handleFileAttach} />
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Nachricht schreiben... (@Agent, @Dokument)"
              rows={1}
              className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#09090B] placeholder-[#A1A1AA] resize-none max-h-[120px] py-1"
              style={{ lineHeight: '1.5' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() && !attachment}
              className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-all shrink-0 ${input.trim() || attachment ? 'bg-[#18181B] text-white hover:bg-[#27272A]' : 'bg-[#F4F4F5] text-[#A1A1AA]'}`}
            >
              <Send size={14} />
            </button>
          </div>
          <p className="text-center text-[11px] text-[#A1A1AA] mt-2">
            Prozessia AI · DSGVO-konform · EU-Hosting
          </p>
        </div>
      </div>
    </div>
  );
}
