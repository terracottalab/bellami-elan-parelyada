"use client";

import { useState } from "react";
import { MessageCircle, X, Send, User, Phone, CheckSquare, Square } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  createTicketFromChat,
} from "@/lib/chat.functions";
import { Link } from "@tanstack/react-router";

type Locale = "ru" | "en";
type Step = "language" | "contact" | "chat";

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
    nameLabel: "Ваше имя",
    phoneLabel: "Телефон (международный формат)",
    consentPrefix: "Я согласен(а) с",
    privacyLink: "Политикой конфиденциальности",
    consentRequired: "Необходимо согласие",
    startChat: "Начать чат",
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
    contactSent: "Запрос на связь отправлен.",
    languageLabel: "RU",
  },
  en: {
    assistantName: "Norwich Assistant",
    greeting: "Hello! I'm Norwich Assistant.",
    subGreeting: "I can tell you about the breed, about Pari, and answer your questions.",
    chooseLanguage: "Which language would you prefer for our conversation?",
    nameLabel: "Your name",
    phoneLabel: "Phone (international format)",
    consentPrefix: "I agree to the",
    privacyLink: "Privacy Policy",
    consentRequired: "Consent is required",
    startChat: "Start chat",
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
    contactSent: "Contact request sent to the owner.",
    languageLabel: "EN",
  },
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("language");
  const [locale, setLocale] = useState<Locale>("ru");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", consent: false });
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const startSession = useServerFn(startChatSession);
  const sendMessage = useServerFn(sendChatMessage);
  const createTicket = useServerFn(createTicketFromChat);

  const t = copy[locale];

  const handleLanguage = (lang: Locale) => {
    setLocale(lang);
    setStep("contact");
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setFormError(t.consentRequired);
      return;
    }
    if (!form.consent) {
      setFormError(t.consentRequired);
      return;
    }
    setFormError("");
    setLoading(true);
    try {
      const { id } = await startSession({
        data: { locale, name: form.name, phone: form.phone, consent: true },
      });
      setSessionId(id);
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: locale === "ru" ? "Приветствую! Что вас интересует?" : "Welcome! What would you like to know?",
        },
      ]);
      setStep("chat");
    } catch (err) {
      setFormError(locale === "ru" ? "Не удалось начать чат. Попробуйте позже." : "Could not start chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (text: string) => {
    if (!sessionId || !text.trim() || loading) return;
    setLoading(true);
    setNotice("");
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

  const handleContact = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const { message } = await createTicket({
        data: { sessionId, reason: locale === "ru" ? "Связаться с владельцем" : "Contact the owner" },
      });
      setNotice(message);
    } catch (err) {
      setNotice(locale === "ru" ? "Не удалось отправить запрос." : "Could not send request.");
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
                    onClick={() => handleLanguage("ru")}
                  >
                    Русский
                  </Button>
                  <Button
                    variant="outline"
                    className="chat-lang-btn"
                    onClick={() => handleLanguage("en")}
                  >
                    English
                  </Button>
                </div>
              </div>
            )}

            {step === "contact" && (
              <form className="chat-contact" onSubmit={handleStartChat}>
                <p className="chat-greeting">{t.greeting}</p>
                <p className="chat-choose">{t.chooseLanguage}</p>
                <div className="chat-field">
                  <label htmlFor="chat-name">{t.nameLabel}</label>
                  <Input
                    id="chat-name"
                    value={form.name}
                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="chat-field">
                  <label htmlFor="chat-phone">{t.phoneLabel}</label>
                  <Input
                    id="chat-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                    required
                    autoComplete="tel"
                    placeholder="+7 999 000-00-00"
                  />
                </div>
                <label className="chat-consent">
                  <button
                    type="button"
                    className="chat-checkbox"
                    onClick={() => setForm((s) => ({ ...s, consent: !s.consent }))}
                    aria-pressed={form.consent}
                  >
                    {form.consent ? (
                      <CheckSquare className="size-4" />
                    ) : (
                      <Square className="size-4" />
                    )}
                  </button>
                  <span>
                    {t.consentPrefix}{" "}
                    <Link
                      to={locale === "en" ? "/en/legal/privacy" : "/ru/legal/privacy"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chat-privacy-link"
                    >
                      {t.privacyLink}
                    </Link>
                  </span>
                </label>
                {formError && <p className="chat-error">{formError}</p>}
                <Button type="submit" className="chat-start-btn" disabled={loading}>
                  {loading ? "..." : t.startChat}
                </Button>
              </form>
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

                {notice && <div className="chat-notice">{notice}</div>}

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
                  <button type="button" className="chat-cta-btn" onClick={handleEnquiry} disabled={loading}>
                    {t.enquiryCta}
                  </button>
                  <button type="button" className="chat-cta-btn chat-cta-btn-primary" onClick={handleContact} disabled={loading}>
                    {t.contactCta}
                  </button>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
