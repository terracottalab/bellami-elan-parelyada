"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import {
  startChatSession,
  sendChatMessage,
} from "@/lib/chat.functions";

type Locale = "ru" | "en";
type Step = "language" | "chat";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const copy = {
  ru: {
    assistantName: "Норвич Ассистент",
    greeting: "Здравствуйте! Я — Норвич Ассистент.",
    subGreeting: "Помогу узнать больше о породе, о Пари и ответить на вопросы.",
    chooseLanguage: "На каком языке вам будет удобнее продолжить общение?",
    placeholder: "Напишите сообщение...",
    quickTitle: "Быстрые вопросы",
    quickQuestions: [
      "Расскажите о породе",
      "Подойдёт ли мне Norwich Terrier?",
      "Расскажите о Пари",
      "Уход и груминг",
      "Задать свой вопрос",
    ],
    contactCta: "Связаться с владельцем",
    languageLabel: "RU",
  },
  en: {
    assistantName: "Norwich Assistant",
    greeting: "Hello! I'm Norwich Assistant.",
    subGreeting: "I can tell you about the breed, about Pari, and answer your questions.",
    chooseLanguage: "Which language would you prefer for our conversation?",
    placeholder: "Type a message...",
    quickTitle: "Quick questions",
    quickQuestions: [
      "Tell me about the breed",
      "Would a Norwich Terrier suit me?",
      "Tell me about Pari",
      "Care and grooming",
      "Ask my own question",
    ],
    contactCta: "Contact the owner",
    languageLabel: "EN",
  },
};

export function ChatWidget({ initialLocale = "ru" }: { initialLocale?: Locale }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("language");
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const startSession = useServerFn(startChatSession);
  const sendMessage = useServerFn(sendChatMessage);

  const t = copy[locale];

  const handleLanguage = async (lang: Locale) => {
    if (loading) return;
    setLocale(lang);
    setLoading(true);
    setFormError("");
    try {
      const { id } = await startSession({ data: { locale: lang } });
      setSessionId(id);
      setMessages([{ id: "welcome", role: "assistant", content: lang === "ru" ? "Приветствую! Что вас интересует?" : "Welcome! What would you like to know?" }]);
      setStep("chat");
    } catch {
      setFormError(lang === "ru" ? "Не удалось начать чат. Попробуйте позже." : "Could not start chat. Please try again.");
    } finally { setLoading(false); }
  };

  const submit = async (text: string) => {
    if (!sessionId || !text.trim() || loading) return;
    setLoading(true);
    const userMsg: MessageItem = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    try {
      const { reply } = await sendMessage({ data: { sessionId, message: text } });
      const assistantMsg: MessageItem = { id: crypto.randomUUID(), role: "assistant", content: reply };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errMsg =
        locale === "ru"
          ? "Не удалось отправить сообщение. Попробуйте позже."
          : "Could not send message. Please try again.";
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "assistant", content: errMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="chat-launcher"
        aria-label={t.assistantName}
      >
        <MessageCircle className="chat-launcher-icon" />
        <span className="chat-launcher-label">{t.assistantName}</span>
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label={t.assistantName}>
          <div className="chat-header">
            <div className="chat-header-title">
              <span className="chat-header-dot" />
              <span>{t.assistantName}</span>
            </div>
            <div className="chat-header-actions">
              <button
                type="button"
                className="chat-lang-switch"
                onClick={() => setLocale(locale === "ru" ? "en" : "ru")}
                aria-label="Switch language"
              >
                {locale.toUpperCase()}
              </button>
              <button
                type="button"
                className="chat-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="chat-body">
            {step === "language" && (
              <div className="chat-language">
                <p className="chat-greeting">{t.greeting}</p>
                <p className="chat-sub">{t.subGreeting}</p>
                <p className="chat-choose">{t.chooseLanguage}</p>
                <div className="chat-lang-buttons">
                  <Button
                    variant="outline"
                    className="chat-lang-btn"
                    onClick={() => handleLanguage("ru")} disabled={loading}
                  >
                    Русский
                  </Button>
                  <Button
                    variant="outline"
                    className="chat-lang-btn"
                    onClick={() => handleLanguage("en")} disabled={loading}
                  >
                    English
                  </Button>
                </div>
                {formError && <p className="chat-error">{formError}</p>}
              </div>
            )}

            {step === "chat" && (
              <>
                <Conversation className="chat-conversation">
                  <ConversationContent>
                    {messages.length === 0 ? (
                      <ConversationEmptyState />
                    ) : (
                      messages.map((msg) => (
                        <Message key={msg.id} from={msg.role}>
                          <MessageContent>
                            <MessageResponse>{msg.content}</MessageResponse>
                          </MessageContent>
                        </Message>
                      ))
                    )}
                  </ConversationContent>
                </Conversation>


                <div className="chat-quick">
                  <p className="chat-quick-title">{t.quickTitle}</p>
                  <div className="chat-quick-list">
                    {t.quickQuestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        className="chat-quick-btn"
                        onClick={() => submit(q)}
                        disabled={loading}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="chat-ctas">
                  <Button asChild variant="outline" className="chat-cta-btn chat-cta-btn-primary">
                    <a href={`/${locale}#contacts`} onClick={() => setOpen(false)}>{t.contactCta}</a>
                  </Button>
                </div>

                <PromptInput
                  onSubmit={(message) => submit(message.text)}
                  className="chat-composer"
                >
                  <PromptInputTextarea
                    placeholder={t.placeholder}
                    disabled={loading}
                    className="chat-textarea"
                  />
                  <PromptInputFooter className="chat-composer-footer">
                    <PromptInputSubmit disabled={loading} />
                  </PromptInputFooter>
                </PromptInput>
                <p className="chat-disclosure">{locale === "ru" ? "Отвечает ИИ-ассистент. Не указывайте в чате телефон и другие личные данные." : "Answers are AI-generated. Please don’t share your phone number or other personal details."}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
