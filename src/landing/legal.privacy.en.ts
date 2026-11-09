import { footerHtml } from "./public-site";


const IMG: Record<string, string> = {

};

export const title = "Personal data and cookies — Bellami-Elan Parelyada — Norwich Terrier";
export const description = "Personal data and cookies on Pari’s website.";
export const bodyHtml = `
  <a class="skip-link" href="#content">Skip to content</a>
  <div class="site-chrome">
  <header class="site-header is-solid">
    <div class="header-inner">
      <a class="wordmark" href="/en">Bellami-Elan Parelyada</a>
      <nav class="desktop-nav" aria-label="Primary"><a href="/en#about">Pari</a><a href="/en#shows">Shows</a><a href="/en#breed">The Breed</a><a href="/en#puppies">Planned Litter</a><a href="/en#gallery">Gallery</a><a href="/en#contacts">Contact</a></nav>
      <div class="header-tools">
        <div class="lang-switch" aria-label="Language">
          <a href="/ru/legal/privacy"  hreflang="ru">RU</a>
          <span aria-hidden="true">|</span>
          <a href="/en/legal/privacy" aria-current="true" hreflang="en">EN</a>
        </div>
        <a class="btn btn-primary header-cta" href="/en#contacts">Get in touch</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span></button>
      </div>
    </div>
  </header>
    <nav id="mobile-menu" class="mobile-nav" hidden aria-label="Menu">
      <div class="mobile-nav-top">
        <p class="caption" style="margin:0">Site pages</p>
        <button class="btn btn-line" type="button" data-close-menu>Close</button>
      </div>
      <a href="/en#about">Pari</a><a href="/en#shows">Shows</a><a href="/en#breed">The Breed</a><a href="/en#puppies">Planned Litter</a><a href="/en#gallery">Gallery</a><a href="/en#contacts">Contact</a>
      <a class="btn btn-primary" href="/en#contacts">Get in touch</a>
    </nav>
  </div>
  <main id="content">
    <header class="page-hero"><div class="container"><h1>Personal data and cookies</h1></div></header>
    <section class="section-tight"><div class="container blog-prose"></div></section>
  </main>
  ${footerHtml("en")}
  
`;
