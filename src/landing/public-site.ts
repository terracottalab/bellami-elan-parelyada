export type PublicLocale = "ru" | "en";
export const SITE_ORIGIN = "https://norwichland.com";
// Await a real email address; a VK URL must never be used as a mailto address.
export const CONTACT_EMAIL = "";
export const METRICA_COUNTER: number | null = null;
export const CONSENT_KEY = "norwichland.analytics-consent";

export function publicPageLinks(locale: PublicLocale, suffix = "", home = false) {
  const path = home ? "/" : `/${locale}${suffix}`;
  return [
    { rel: "canonical", href: `${SITE_ORIGIN}${path}` },
    { rel: "alternate", hrefLang: "ru", href: `${SITE_ORIGIN}/ru${suffix}` },
    { rel: "alternate", hrefLang: "en", href: `${SITE_ORIGIN}/en${suffix}` },
    { rel: "alternate", hrefLang: "x-default", href: `${SITE_ORIGIN}/ru` },
  ];
}

export function footerHtml(locale: PublicLocale) {
  const ru = locale === "ru";
  const home = `/${locale}`;
  return `<footer class="site-footer"><div class="container-wide">
    <div class="footer-grid"><div><p class="serif footer-brand">Bellami-Elan Parelyada</p><p>${ru ? "Норвич-терьер" : "Norwich Terrier"}</p></div>
    <nav class="footer-nav"><a href="${home}#about">${ru ? "Пари" : "Pari"}</a><a href="${home}/shows">${ru ? "Выставки" : "Shows"}</a><a href="${home}#breed">${ru ? "О породе" : "The breed"}</a><a href="${home}#puppies">${ru ? "Будущий помёт" : "Planned litter"}</a><a href="${home}#gallery">${ru ? "Галерея" : "Gallery"}</a><a href="${home}#contacts">${ru ? "Написать мне" : "Get in touch"}</a></nav>
    <div class="social-list"><a href="https://t.me/norwichinfo" target="_blank" rel="noopener noreferrer">Telegram</a><a href="https://vk.ru/norwichinfo" target="_blank" rel="noopener noreferrer">${ru ? "ВКонтакте" : "VK"}</a>${CONTACT_EMAIL ? `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>` : ""}<p><a href="/ru">RU</a> | <a href="/en">EN</a></p></div></div>
    <div class="footer-meta"><span>© 2026 Bellami-Elan Parelyada</span><a href="${home}/legal/privacy">${ru ? "Персональные данные и cookie" : "Personal data and cookies"}</a></div>
  </div></footer>`;
}

export function contactsHtml(locale: PublicLocale) {
  const ru = locale === "ru";
  const subject = ru ? "Норвич — знакомство" : "Norwich — introduction";
  const body = ru ? "Город:\nКогда планирую щенка:\nОпыт с собаками:\nПочему норвич:\n" : "City:\nWhen I plan a puppy:\nExperience with dogs:\nWhy a Norwich:\n";
  const email = CONTACT_EMAIL ? `<a class="btn btn-primary" data-goal="click_email" href="mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}">${ru ? "Написать письмо" : "Send an email"}</a><div class="contact-email"><span>${CONTACT_EMAIL}</span><button class="btn btn-line" type="button" data-copy-email="${CONTACT_EMAIL}" data-copied="${ru ? "Скопировано" : "Copied"}">${ru ? "Скопировать" : "Copy"}</button></div>` : "";
  return `<section class="section enquiry-band" id="contacts"><div class="container">
    <h2>${ru ? "Написать мне" : "Get in touch"}</h2>
    <p class="lede">${ru ? "Первый помёт Пари планируется на 2027 год. Если вы думаете о норвиче, напишите мне: где вы живёте, когда планируете щенка, был ли у вас опыт с собаками и почему именно норвич. Это не бронь — просто начало знакомства." : "Pari’s first litter is planned for 2027. If you are considering a Norwich, write to me: where you live, when you are planning a puppy, your experience with dogs and why a Norwich. This is not a reservation — just the start of getting to know each other."}</p>
    <div class="btn-row">${email}<a class="btn btn-primary" href="https://vk.me/norwichinfo" target="_blank" rel="noopener noreferrer" data-goal="click_vk">${ru ? "Написать во ВКонтакте" : "Message on VK"}</a></div>
    <p class="caption contact-policy">${ru ? "Как я обращаюсь с письмами — в разделе " : "How I handle your emails — see "}<a href="/${locale}/legal/privacy">${ru ? "„Персональные данные и cookie“" : "„Personal data and cookies“"}</a></p>
  </div></section>`;
}