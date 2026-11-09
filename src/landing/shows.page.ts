import { footerHtml } from "./public-site";
export type PublicShow = {
  id: string;
  show_date: string;
  title: string;
  country: string | null;
  city: string | null;
  dog_class: string | null;
  result: string | null;
  awarded_title: string | null;
  notes: string | null;
};

export const showsTitleRu = "Выставочные результаты Пари — норвич-терьер";
export const showsDescriptionRu =
  "Все выставки Пари: даты, судьи, оценки и титулы.";
export const showsTitleEn = "Pari’s show results — Norwich Terrier";
export const showsDescriptionEn =
  "Every show Pari has entered: dates, judges, grades and titles.";

const COUNTRY_EN: Record<string, string> = { Россия: "Russia", Армения: "Armenia" };
const CLASS_EN: Record<string, string> = {
  Бэби: "Baby",
  Щенки: "Puppy",
  Юниоры: "Junior",
  Взрослые: "Adult",
};

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slug(value: string) {
  return value.replace(/[^\p{L}\p{N}]+/gu, "-").toLowerCase();
}

function formatDate(iso: string, locale: "ru" | "en") {
  const [y, m, d] = iso.split("-");
  return locale === "ru" ? `${d}.${m}.${y}` : `${d}/${m}/${y}`;
}

export function buildShowsHtml(shows: PublicShow[], locale: "ru" | "en") {
  const ru = locale === "ru";
  const years = [...new Set(shows.map((s) => s.show_date.slice(0, 4)))].sort().reverse();
  const countries = [...new Set(shows.map((s) => s.country ?? "").filter(Boolean))];
  const classes = [...new Set(shows.map((s) => s.dog_class ?? "").filter(Boolean))];

  const label = (raw: string, map: Record<string, string>) => (ru ? raw : (map[raw] ?? raw));

  const options = (items: string[], map: Record<string, string>) =>
    [`<option value="all">${ru ? "Все результаты" : "All results"}</option>`]
      .concat(items.map((i) => `<option value="${esc(slug(i))}">${esc(label(i, map))}</option>`))
      .join("");

  const cards = shows
    .map((s) => {
      const meta = [
        formatDate(s.show_date, locale),
        s.country ? label(s.country, COUNTRY_EN) : "",
        s.city ?? "",
        s.dog_class ? label(s.dog_class, CLASS_EN) : "",
      ]
        .filter(Boolean)
        .join(" · ");
      const details = [s.result, s.awarded_title, s.notes].filter(Boolean).join(" · ");
      return `<article class="show-card" data-year="${esc(s.show_date.slice(0, 4))}" data-country="${esc(slug(s.country ?? ""))}" data-class="${esc(slug(s.dog_class ?? ""))}">
        <p class="eyebrow">${esc(meta)}</p>
        <h3>${esc(s.title)}</h3>
        ${details ? `<p class="show-details">${esc(details)}</p>` : ""}
      </article>`;
    })
    .join("");

  const nav = ru
    ? `<a href="/ru#about">Пари</a><a href="/ru#shows">Выставки</a><a href="/ru#breed">О породе</a><a href="/ru#puppies">Будущий помёт</a><a href="/ru#gallery">Галерея</a><a href="/ru#contacts">Контакты</a>`
    : `<a href="/en#about">Pari</a><a href="/en#shows">Shows</a><a href="/en#breed">The Breed</a><a href="/en#puppies">Planned Litter</a><a href="/en#gallery">Gallery</a><a href="/en#contacts">Contact</a>`;
  const home = ru ? "/ru" : "/en";
  const cta = ru ? "Написать мне" : "Get in touch";
  const ctaHref = ru ? "/ru#contacts" : "/en#contacts";

  return `
  <a class="skip-link" href="#content">${ru ? "К содержанию" : "Skip to content"}</a>
  <div class="site-chrome">
  <header class="site-header is-solid">
    <div class="header-inner">
      <a class="wordmark" href="${home}">Bellami-Elan Parelyada</a>
      <nav class="desktop-nav" aria-label="Primary">${nav}</nav>
      <div class="header-tools">
        <div class="lang-switch" aria-label="${ru ? "Язык" : "Language"}">
          <a href="/ru/shows"${ru ? ' aria-current="true"' : ""} hreflang="ru">RU</a>
          <span aria-hidden="true">|</span>
          <a href="/en/shows"${ru ? "" : ' aria-current="true"'} hreflang="en">EN</a>
        </div>
        <a class="btn btn-primary header-cta" href="${ctaHref}">${cta}</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="${ru ? "Открыть меню" : "Open menu"}"><span></span></button>
      </div>
    </div>
  </header>
    <nav id="mobile-menu" class="mobile-nav" hidden aria-label="${ru ? "Меню" : "Menu"}">
      <div class="mobile-nav-top">
        <p class="caption" style="margin:0">${ru ? "Разделы сайта" : "Site pages"}</p>
        <button class="btn btn-line" type="button" data-close-menu>${ru ? "Закрыть" : "Close"}</button>
      </div>
      ${nav}
      <a class="btn btn-primary" href="${ctaHref}">${cta}</a>
    </nav>
  </div>
  <main id="content">
    <header class="page-hero"><div class="container">
      <p class="caption">${ru ? "Bellami-Elan Parelyada" : "Bellami-Elan Parelyada"}</p>
      <h1>${ru ? "Выставочные результаты" : "Show Results"}</h1>
      <p class="lede" style="margin-top:1rem">${
        ru
          ? "Все ринги, оценки и титулы Пари — от бэби-класса до юниоров."
          : "Every ring, grade and title of Pari — from baby class to junior."
      }</p>
    </div></header>
    <section class="section-tight"><div class="container">
      <div class="show-filters" data-show-filters>
        <label>${ru ? "Год" : "Year"} <select data-filter-year>${options(years, {})}</select></label>
        <label>${ru ? "Страна" : "Country"} <select data-filter-country>${options(countries, COUNTRY_EN)}</select></label>
        <label>${ru ? "Класс" : "Class"} <select data-filter-class>${options(classes, CLASS_EN)}</select></label>
      </div>
      <div class="timeline" data-show-list>${cards}</div>
      <p data-show-empty hidden class="muted">${ru ? "Нет результатов по выбранным фильтрам." : "No results match these filters."}</p>
      <p style="margin-top:2rem"><a class="btn btn-line" href="${home}">${ru ? "Вернуться на главную" : "Back to home"}</a></p>
    </div></section>
  </main>
  ${footerHtml(locale)}
  `;
}
