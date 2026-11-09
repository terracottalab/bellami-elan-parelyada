import { footerHtml } from "./public-site";


const IMG: Record<string, string> = {

};

export const title = "Персональные данные и cookie — Bellami-Elan Parelyada — норвич-терьер Пари";
export const description = "Персональные данные и cookie на сайте Пари.";
export const bodyHtml = `
  <a class="skip-link" href="#content">К содержанию</a>
  <div class="site-chrome">
  <header class="site-header is-solid">
    <div class="header-inner">
      <a class="wordmark" href="/ru">Bellami-Elan Parelyada</a>
      <nav class="desktop-nav" aria-label="Primary"><a href="/ru#about">Пари</a><a href="/ru#shows">Выставки</a><a href="/ru#breed">О породе</a><a href="/ru#puppies">Будущий помёт</a><a href="/ru#gallery">Галерея</a><a href="/ru#contacts">Контакты</a></nav>
      <div class="header-tools">
        <div class="lang-switch" aria-label="Язык">
          <a href="/ru/legal/privacy" aria-current="true" hreflang="ru">RU</a>
          <span aria-hidden="true">|</span>
          <a href="/en/legal/privacy"  hreflang="en">EN</a>
        </div>
        <a class="btn btn-primary header-cta" href="/ru#contacts">Написать мне</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Открыть меню"><span></span></button>
      </div>
    </div>
  </header>
    <nav id="mobile-menu" class="mobile-nav" hidden aria-label="Меню">
      <div class="mobile-nav-top">
        <p class="caption" style="margin:0">Разделы сайта</p>
        <button class="btn btn-line" type="button" data-close-menu>Закрыть</button>
      </div>
      <a href="/ru#about">Пари</a><a href="/ru#shows">Выставки</a><a href="/ru#breed">О породе</a><a href="/ru#puppies">Будущий помёт</a><a href="/ru#gallery">Галерея</a><a href="/ru#contacts">Контакты</a>
      <a class="btn btn-primary" href="/ru#contacts">Написать мне</a>
    </nav>
  </div>
  <main id="content">
    <header class="page-hero"><div class="container"><h1>Персональные данные и cookie</h1></div></header>
    <section class="section-tight"><div class="container blog-prose"></div></section>
  </main>
  ${footerHtml("ru")}
  
`;
