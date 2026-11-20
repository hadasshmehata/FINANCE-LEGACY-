import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Coins,
  FileText,
  Shield,
  Clock,
  RotateCcw,
  Copy,
  Check,
  Trash2,
  Cpu,
  CornerDownLeft,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FinancialAssistant: React.FC = () => {
  const { messages, sendMessage, isAiTyping, currentUser, clearChatHistory, aiEngineSource, assets, gaps, claims } =
    useApp();
  const [inputVal, setInputVal] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Dynamic context-aware suggested prompts
  const dynamicPrompts = [
    'What assets have been detected?',
    'What is my total potential recovery?',
    'Which asset should I claim first?',
    'What documents am I missing?',
    'How do I recover my EPF?',
    'Explain my Financial Legacy Score.',
    'Why is my asset unverified?',
    'What is the difference between a claim and an asset?',
    'Explain nominee recovery.',
    'How can I protect myself from financial fraud?',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isAiTyping) return;
    sendMessage(inputVal.trim());
    setInputVal('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePromptClick = (p: string) => {
    if (isAiTyping) return;
    sendMessage(p);
  };

  /**
   * Safe lightweight markdown formatter for financial messages
   */
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed text-xs">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Header 3 (###)
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-extrabold text-white text-xs sm:text-sm mt-2 mb-1 text-cyan-300">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          // Header 2 (##)
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-extrabold text-white text-sm sm:text-base mt-2.5 mb-1 text-emerald-300">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }

          // Bullet points (• or -)
          if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1.5">
                <span className="text-cyan-400 font-bold select-none">•</span>
                <span>{renderInlineFormatting(content)}</span>
              </div>
            );
          }

          // Numbered lists (1. , 2. )
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1.5 mt-0.5">
                <span className="text-emerald-400 font-bold font-mono text-[11px] select-none">{numMatch[1]}.</span>
                <span>{renderInlineFormatting(numMatch[2])}</span>
              </div>
            );
          }

          // Blank line spacer
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Standard paragraph
          return <p key={idx}>{renderInlineFormatting(line)}</p>;
        })}
      </div>
    );
  };

  /**
   * Helper for bold, code, and links inside text lines
   */
  const renderInlineFormatting = (text: string) => {
    // Split by bold (**text**)
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-[#061525] border border-[#1E3A5F] text-cyan-300 font-mono text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10283D] p-5 sm:p-6 rounded-3xl border border-[#1E3A5F] shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              AI Financial Assistant
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Ask Anything About Your Financial Legacy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Trained on statutory recovery guidelines, EPFO rules, RBI master circulars, and your active profile context.
          </p>
        </div>

        {/* Engine Source & Control Pills */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-2xl border ${
              aiEngineSource === 'gemini-api'
                ? 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30'
                : 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30'
            }`}
            title="Active Intelligence Engine"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>
              {aiEngineSource === 'gemini-api' ? 'Gemini 1.5 Flash AI' : 'Financial Intelligence Engine'}
            </span>
          </div>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-1.5 rounded-2xl bg-[#061525] hover:bg-[#0B1E32] text-slate-400 hover:text-red-400 border border-[#1E3A5F] text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl shadow-card overflow-hidden flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#1E3A5F] bg-[#0B1E32] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-glow-cyan/20">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Legacy AI Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </h3>
              <p className="text-[10px] text-slate-400">
                Active for: <strong className="text-slate-300">{currentUser.name}</strong> • {assets.length} Assets • {claims.length} Claims
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                clearChatHistory();
              }}
              className="text-[11px] text-slate-400 hover:text-cyan-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#061525] border border-[#1E3A5F]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#061525]/80 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs ${
                    isUser
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble Container */}
                <div className="space-y-1 max-w-full">
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 relative group ${
                      isUser
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 font-semibold shadow-glow-emerald rounded-tr-none'
                        : 'bg-[#10283D] border border-[#1E3A5F] text-slate-200 rounded-tl-none shadow-card'
                    }`}
                  >
                    {isUser ? <p className="whitespace-pre-line">{msg.text}</p> : renderFormattedText(msg.text)}

                    {/* Copy Button for Assistant responses */}
                    {!isUser && (
                      <div className="pt-2 border-t border-[#1E3A5F]/60 flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span className="font-mono">{msg.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <span className="block text-[9px] font-mono text-right text-slate-500 pr-1">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isAiTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#10283D] border border-[#1E3A5F] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-400 italic ml-1">Analyzing portfolio records...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Dynamic Contextual Suggestion Pills */}
        <div className="p-2.5 bg-[#0B1E32] border-t border-[#1E3A5F] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex-shrink-0 pl-1">
            Suggested Prompts:
          </span>
          {dynamicPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isAiTyping}
              onClick={() => handlePromptClick(p)}
              className="px-2.5 py-1 rounded-full bg-[#10283D] hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-[#1E3A5F] hover:border-emerald-500/50 text-[11px] font-medium transition-all whitespace-nowrap flex-shrink-0 disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar with Multi-line and Enter Support */}
        <form onSubmit={handleSend} className="p-3 bg-[#10283D] border-t border-[#1E3A5F] flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your assets, EPF, missing documents, or recovery steps... (Enter to send, Shift+Enter for new line)"
              className="w-full bg-[#061525] border border-[#1E3A5F] focus:border-cyan-400 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all resize-none max-h-32 scrollbar-thin"
            />
          </div>

          <button
            type="submit"
            disabled={!inputVal.trim() || isAiTyping}
            className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 text-slate-950 font-bold shadow-glow-emerald transition-all flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Send Message (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#10283D] border border-[#1E3A5F] rounded-3xl max-w-sm w-full p-6 shadow-card space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Clear Chat History?</h3>
            </div>
            <p className="text-xs text-slate-300">
              This will erase your current conversation with the assistant for this profile. Your financial assets and documents will remain intact.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#061525] text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearChatHistory();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs shadow-glow-red"
              >
                Yes, Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
