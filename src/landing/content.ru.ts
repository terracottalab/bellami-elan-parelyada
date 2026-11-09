import { previewFor } from "./image-previews";
import { contactsHtml, footerHtml } from "./public-site";
import a0 from "@/assets/pari-hero.jpg.asset.json";
import a1 from "@/assets/pari-portrait-01.jpg.asset.json";
import a2 from "@/assets/pari-show-career.jpg.asset.json";
import a3 from "@/assets/diploma-jch-arm-2026.jpg.asset.json";
import a4 from "@/assets/diploma-jgrch-arm-2026.jpg.asset.json";
import a5 from "@/assets/diploma-jch-hrv.jpg.asset.json";
import a6 from "@/assets/diploma-jch-rus.jpg.asset.json";
import a7 from "@/assets/diploma-jgrch-rus.jpg.asset.json";
import a8 from "@/assets/diploma-jshch-rus.jpg.asset.json";
import a9 from "@/assets/diploma-cisj-winner-2026.jpg.asset.json";
import a10 from "@/assets/pari-live-log.jpg.asset.json";
import a11 from "@/assets/pari-live-awards.jpg.asset.json";
import a12 from "@/assets/pari-show-minsk-podium.jpg.asset.json";

import a13 from "@/assets/diploma-jch-blr-2026.jpg.asset.json";
import a14 from "@/assets/diploma-ch-slo-2026.jpg.asset.json";
import a15 from "@/assets/diploma-abruzzo-winner-2026.jpg.asset.json";
import a16 from "@/assets/diploma-alpensieger-2026.jpg.asset.json";
import a17 from "@/assets/diploma-show-ch-swiss-2026.jpg.asset.json";

const IMG: Record<string, string> = {
  "diploma-jch-blr-2026.jpg": a13.url,
  "diploma-ch-slo-2026.jpg": a14.url,
  "diploma-abruzzo-winner-2026.jpg": a15.url,
  "diploma-alpensieger-2026.jpg": a16.url,
  "diploma-show-ch-swiss-2026.jpg": a17.url,
  "pari-hero.jpg": a0.url,
  "pari-portrait-01.jpg": a1.url,
  "pari-show-career.jpg": a2.url,
  "diploma-jch-arm.jpg": a3.url,
  "diploma-jgrch-arm.jpg": a4.url,
  "diploma-jch-hrv.jpg": a5.url,
  "diploma-jch-rus.jpg": a6.url,
  "diploma-jgrch-rus.jpg": a7.url,
  "diploma-jshch-rus.jpg": a8.url,
  "diploma-cisj-winner.jpg": a9.url,
  "pari-live-log.jpg": a10.url,
  "pari-live-awards.jpg": a11.url,
  "pari-show-minsk-podium.jpg": a12.url,
};

export const title = "Пари — норвич-терьер Bellami-Elan Parelyada";
export const description = "Пари (Bellami-Elan Parelyada) — норвич-терьер, выставочная карьера и первый помёт в 2027 году.";
export const bodyHtml = `
  <a class="skip-link" href="#content">К содержанию</a>
  <div class="site-chrome">
  <header class="site-header is-solid">
    <div class="header-inner">
      <a class="wordmark" href="#top">Bellami-Elan Parelyada</a>
      <nav class="desktop-nav" aria-label="Primary"><a href="#about">Пари</a><a href="#shows">Выставки</a><a href="#breed">О породе</a><a href="#puppies">Будущий помёт</a><a href="#gallery">Галерея</a><a href="#contacts">Контакты</a></nav>
      <div class="header-tools">
        <div class="lang-switch" aria-label="Язык">
          <a href="/ru" aria-current="true" hreflang="ru">RU</a>
          <span aria-hidden="true">|</span>
          <a href="/en"  hreflang="en">EN</a>
        </div>
        <a class="btn btn-primary header-cta" href="#contacts">Написать мне</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Открыть меню"><span></span></button>
      </div>
    </div>
  </header>
    <nav id="mobile-menu" class="mobile-nav" hidden aria-label="Меню">
      <div class="mobile-nav-top">
        <p class="caption" style="margin:0">Разделы сайта</p>
        <button class="btn btn-line" type="button" data-close-menu>Закрыть</button>
      </div>
      <a href="#about">Пари</a><a href="#shows">Выставки</a><a href="#breed">О породе</a><a href="#puppies">Будущий помёт</a><a href="#gallery">Галерея</a><a href="#contacts">Контакты</a>
      <a class="btn btn-primary" href="#contacts">Написать мне</a>
    </nav>
  </div>
  <main id="content">
    
    
    <section class="hero">
      <div class="hero-media"><img fetchpriority="high" loading="eager" src="${IMG["pari-hero.jpg"]}" alt="Норвич-терьер Bellami-Elan Parelyada (Пари)" /></div>
      <div class="hero-copy">
        <p class="eyebrow">Норвич-терьер</p>
        <h1 class="hero-name"><span class="hero-name-line">Bellami-Elan</span><span class="hero-name-script">Parelyada</span></h1>
        <p class="hero-rank">Юный интернациональный чемпион красоты FCI (C.I.B.-J)</p>
        <p class="lede">Выставочная карьера. Международные линии. Будущая племенная программа.</p>
        <p class="hero-note">Первый помёт — 2027</p>
        <div class="btn-row">
          <a class="btn btn-primary" href="#contacts">Написать мне</a>
          <a class="btn btn-line" href="#about">Познакомиться с Пари</a>
        </div>
      </div>
    </section>
    <section class="section meet-section" id="about"><div class="container-wide split split-top split-fit">
      <div class="media-frame split-fit-photo"><img loading="lazy" data-original="${IMG["pari-portrait-01.jpg"]}" src="${previewFor(IMG["pari-portrait-01.jpg"])}" alt="Норвич-терьер Bellami-Elan Parelyada (Пари)" /></div>
      <div class="meet-copy">
        <p class="eyebrow">Знакомство</p>
        <h2>Маленький терьер с характером настоящей большой собаки</h2>
        <p>Norwich Terrier — компактный, но настоящий терьер: умный, компанейский, любознательный и энергичный. Он любит быть рядом с человеком, участвовать в его жизни, гулять, путешествовать и узнавать новое. При хорошей нагрузке и понятных правилах это очень комфортный компаньон — активный на прогулке и спокойный дома.</p>
        <p>Именно такую собаку я искала. Выбор породы был осознанным: до появления щенка я много читала о норвичах и хорошо представляла характер будущей собаки. А решение взять Bellami-Elan Parelyada — Пари — было принято почти сразу.</p>
        <p>Пари оказалась именно такой, какой я её представляла: умной, открытой, наблюдательной и очень социальной. С раннего возраста мы много занимались социализацией, гуляли, путешествовали и привыкали к новым местам. Сегодня она легко адаптируется к поездкам и остаётся очень комфортной собакой в повседневной жизни.</p>
        <p>Но для меня Пари прежде всего не титулы, а характер. Именно сочетание темперамента, породного типа, происхождения и экспертных оценок делает её основой будущей племенной программы.</p>
      </div>
    </div></section>
    <section class="section" id="shows"><div class="container-wide split show-career-split">
      <div class="show-career-copy">
        <p class="eyebrow">Ринг</p>
        <h2>Выставочная карьера</h2>
        <p>Пари начала карьеру в классе бэби и постепенно прошла классы puppy и junior, участвуя в национальных и международных выставках. За первый выставочный период она получила основные юниорские титулы в России и первые высокие оценки европейских экспертов.</p>
        <p>Для нас выставки — это не только титулы, но и независимая оценка породного типа, анатомии, движений, шерсти и темперамента собаки.</p>
        <p>Европейские эксперты в своих описаниях неоднократно отмечали породный тип, пропорции, баланс, голову, линию верха, структуру шерсти, свободные движения и темперамент Пари. При этом судьи также отмечали, что собака ещё молодая и продолжает физически формироваться.</p>
        <dl class="facts show-summary">
          <div class="fact"><dt>Классы</dt><dd>Baby · Puppy · Junior</dd></div>
          <div class="fact"><dt>География</dt><dd>Россия · Армения · Беларусь · Хорватия · Словения · Италия · Австрия · Швейцария</dd></div>
          <div class="fact fact--wide"><dt>Основные результаты</dt><dd>BISP-1 · BISP-3 · BISJ-1 · BISJ-2 · BIG-1 · BIG-2 · BIG-3 · BIS-2 · Best of Breed</dd></div>
        </dl>
        <div class="btn-row show-career-cta">
          <a class="btn btn-line" href="/ru/shows">Все выставочные результаты →</a>
        </div>
        <p class="caption">Полный список выставок, оценок, экспертов и сертификатов доступен здесь по кнопке.</p>
      </div>
      <div class="media-frame show-career-photo"><img loading="lazy" data-original="${IMG["pari-show-career.jpg"]}" src="${previewFor(IMG["pari-show-career.jpg"])}" alt="Bellami-Elan Parelyada на выставке" /></div>
    </div></section>
    <section class="section"><div class="container-wide">
      <p class="eyebrow">Почему Пари</p><h2>Основа будущей программы</h2>
      <div class="pillars pillars--flush">
        <article class="pillar"><h3>Выставочная карьера</h3><p>Ринг — способ сверять тип. Результаты будут обновляться здесь по мере подтверждения, без вымышленных побед. Среди титулов: Юный чемпион Армении, Юный гранд чемпион Армении, Юный чемпион Хорватии, Юный чемпион России, Юный победитель СНГ.</p></article>
        <article class="pillar"><h3>Родословная</h3><p>Родословную можно посмотреть в разделе <a href="#pedigree">«Линии / Родословная»</a>.</p></article>
        <article class="pillar"><h3>Темперамент</h3><p>Норвич должен оставаться живой рабочей маленькой собакой, удобной для семьи и понятной в ринге.</p></article>
        <article class="pillar"><h3>Здоровье</h3><p>Исследования будут опубликованы после получения. Никаких заранее придуманных сертификатов.</p></article>
        <article class="pillar"><h3>Международная стратегия</h3><p>Партнёры будут рассматриваться с учётом типа и разнообразия линий, а не ближайшего удобства.</p></article>
      </div>
      <div class="diploma-block" data-gallery>
    <div class="diploma-row"><button type="button" class="diploma-card" data-caption="Юный чемпион Армении"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-jch-arm.jpg"]}" src="${previewFor(IMG["diploma-jch-arm.jpg"])}" alt="Юный чемпион Армении" /></span><span class="diploma-label">Юный чемпион Армении</span></button><button type="button" class="diploma-card" data-caption="Юный гранд чемпион Армении"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-jgrch-arm.jpg"]}" src="${previewFor(IMG["diploma-jgrch-arm.jpg"])}" alt="Юный гранд чемпион Армении" /></span><span class="diploma-label">Юный гранд чемпион Армении</span></button><button type="button" class="diploma-card" data-caption="Юный чемпион Хорватии"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-jch-hrv.jpg"]}" src="${previewFor(IMG["diploma-jch-hrv.jpg"])}" alt="Юный чемпион Хорватии" /></span><span class="diploma-label">Юный чемпион Хорватии</span></button><button type="button" class="diploma-card" data-caption="Юный чемпион России"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-jch-rus.jpg"]}" src="${previewFor(IMG["diploma-jch-rus.jpg"])}" alt="Юный чемпион России" /></span><span class="diploma-label">Юный чемпион России</span></button><button type="button" class="diploma-card" data-caption="Юный гранд чемпион России"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-jgrch-rus.jpg"]}" src="${previewFor(IMG["diploma-jgrch-rus.jpg"])}" alt="Юный гранд чемпион России" /></span><span class="diploma-label">Юный гранд чемпион России</span></button><button type="button" class="diploma-card" data-caption="Юный шоу чемпион России"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-jshch-rus.jpg"]}" src="${previewFor(IMG["diploma-jshch-rus.jpg"])}" alt="Юный шоу чемпион России" /></span><span class="diploma-label">Юный шоу чемпион России</span></button><button type="button" class="diploma-card" data-caption="Юный победитель СНГ"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-cisj-winner.jpg"]}" src="${previewFor(IMG["diploma-cisj-winner.jpg"])}" alt="Юный победитель СНГ" /></span><span class="diploma-label">Юный победитель СНГ</span></button><button type="button" class="diploma-card" data-caption="Юный чемпион Беларуси"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-jch-blr-2026.jpg"]}" src="${previewFor(IMG["diploma-jch-blr-2026.jpg"])}" alt="Юный чемпион Беларуси" /></span><span class="diploma-label">Юный чемпион Беларуси</span></button><button type="button" class="diploma-card" data-caption="Чемпион Словении"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-ch-slo-2026.jpg"]}" src="${previewFor(IMG["diploma-ch-slo-2026.jpg"])}" alt="Чемпион Словении" /></span><span class="diploma-label">Чемпион Словении</span></button><button type="button" class="diploma-card" data-caption="Abruzzo Winner 2026 · BOB"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-abruzzo-winner-2026.jpg"]}" src="${previewFor(IMG["diploma-abruzzo-winner-2026.jpg"])}" alt="Abruzzo Winner 2026 · BOB" /></span><span class="diploma-label">Abruzzo Winner 2026 · BOB</span></button><button type="button" class="diploma-card" data-caption="Alpensieger 2026"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-alpensieger-2026.jpg"]}" src="${previewFor(IMG["diploma-alpensieger-2026.jpg"])}" alt="Alpensieger 2026" /></span><span class="diploma-label">Alpensieger 2026</span></button><button type="button" class="diploma-card" data-caption="Шоу чемпион Швейцарии"><span class="diploma-frame"><img loading="lazy" data-original="${IMG["diploma-show-ch-swiss-2026.jpg"]}" src="${previewFor(IMG["diploma-show-ch-swiss-2026.jpg"])}" alt="Шоу чемпион Швейцарии" /></span><span class="diploma-label">Шоу чемпион Швейцарии</span></button></div>
    <div class="lightbox" data-lightbox hidden role="dialog" aria-modal="true">
      <div class="lightbox-bar"><p data-lightbox-caption></p><button class="btn btn-ghost" type="button" data-lightbox-close>Закрыть просмотр</button></div>
      <div class="lightbox-stage"><img alt="" /></div>
      <div class="lightbox-bar">
        <button class="btn btn-ghost" type="button" data-lightbox-prev>Предыдущее фото</button>
        <button class="btn btn-ghost" type="button" data-lightbox-next>Следующее фото</button>
      </div>
    </div>
  </div>
    </div></section>
    <section class="section" id="pedigree" style="background:var(--ivory-deep)"><div class="container-wide">
      <p class="eyebrow">Линии</p><h2>Родословная</h2>
      <div class="pedigree-mobile">
    <details open><summary><span class="eyebrow">Пари</span><strong>Bellami-Elan Parelyada</strong></summary><div class="pedigree-card">
      <small>Пари</small>
      <strong>Bellami-Elan Parelyada</strong>
      <p class="caption">Беллами-Елан Парельяда</p>
      <p class="caption">Юный интернациональный чемпион</p>
      <p class="pedigree-titles">JGrCH.RUS, JCH.RKF, JCH.RUS, BJCH.RUS, CISJ Winner, RUS BJW, JSHCH RUS, JSHCH RG, JCH GRGP, JCH.HCC, GJCH.ARM, JCH.ARM, JCH.HRV, RKF BW</p>
      
      <p class="caption">RKF 7350728 · рыжий · клеймо BLQ 194</p>
    </div></details>
    <details><summary><span class="eyebrow">Отец</span><strong>Guardangel Gavroche</strong></summary><div class="pedigree-card">
      <small>Отец</small>
      <strong>Guardangel Gavroche</strong>
      <p class="caption">Гардэнжэл Гавроче</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 5335035 · рыжий</p>
    </div><div class="pedigree-card">
      <small>Отец отца</small>
      <strong>Scandvik Original Inside</strong>
      <p class="caption">Скандвик Оригинал Инсайд</p>
      
      
      <p class="caption">C.I.B. · GCH.RUS · CH.RUS · CH.BLR · JCH.RUS · CH.RKF · BCH.RUS · MW19</p>
      <p class="caption">RKF 4490838 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Отец отца отца</small>
      <strong>Bronwyn Chocolate Chip</strong>
      
      
      
      <p class="caption">C.I.B. · CH.RUS · CH.BLR · CH.CZE · JCH.RUS</p>
      <p class="caption">RKF 3559287 · AKC RN24934601 · чёрно-подпалый</p>
    </div><div class="pedigree-card is-compact">
      <small>Мать отца отца</small>
      <strong>Elantiz Lady Gwyneth</strong>
      
      
      
      <p class="caption">CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 3328072 · KCR AP00458202 · рыжий</p>
    </div><div class="pedigree-card">
      <small>Мать отца</small>
      <strong>Guardangel Ulana</strong>
      <p class="caption">Гардэнжэл Улана</p>
      
      
      <p class="caption">CH.RUS · JCH.RUS · CH.RKF</p>
      <p class="caption">RKF 3871652 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Отец матери отца</small>
      <strong>Ragus Devils Double</strong>
      
      
      
      <p class="caption">WJW · CH.RUS · JCH.RUS · CH.RKF · BEST-DOG-13</p>
      <p class="caption">RKF 3328780 · KCR AP01964102 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Мать матери отца</small>
      <strong>Going To Win</strong>
      
      
      
      <p class="caption">JCH.RUS</p>
      <p class="caption">RKF 2386454 · чёрно-подпалый</p>
    </div></details>
    <details><summary><span class="eyebrow">Мать</span><strong>Bellami-Elan Zara</strong></summary><div class="pedigree-card">
      <small>Мать</small>
      <strong>Bellami-Elan Zara</strong>
      <p class="caption">Беллами-Елан Зара</p>
      
      
      <p class="caption">CH.RUS · CH.RKF · BT</p>
      <p class="caption">RKF 6738632 · рыжий</p>
    </div><div class="pedigree-card">
      <small>Отец матери</small>
      <strong>Scandvik Let It Be</strong>
      <p class="caption">Скандвик Лет Ит Би</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RKF · JCH.RUS</p>
      <p class="caption">RKF 6411824 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Отец отца матери</small>
      <strong>Scandvik Harley Davidson</strong>
      <p class="caption">Скандвик Харлей Дэвидсон</p>
      
      
      <p class="caption">GCH.RUS · JGCH.RUS · CH.RUS · JCH.RUS · CH.RKF · BCH.RUS · BJCH.RUS</p>
      <p class="caption">RKF 5867554 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Мать отца матери</small>
      <strong>Red Pumpkin Di Sutri</strong>
      
      
      
      
      <p class="caption">RKF 3536245 · ROI 13/31223 · рыжий</p>
    </div><div class="pedigree-card">
      <small>Мать матери</small>
      <strong>Bellami-Elan Unita</strong>
      <p class="caption">Беллами-Елан Унита</p>
      
      
      
      <p class="caption">RKF 5681690 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Отец матери матери</small>
      <strong>Guardangel Gavroche</strong>
      <p class="caption">Гардэнжэл Гавроче</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 5335035 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Мать матери матери</small>
      <strong>Seventy Seven Zara</strong>
      <p class="caption">Севенти Севен Зара</p>
      
      
      <p class="caption">CH.RUS · JCH.RUS · CH.RKF</p>
      <p class="caption">RKF 2907770 · рыжий</p>
    </div></details>
  </div>
  <div class="pedigree-desktop">
    <div class="pedigree-tree">
      <div class="pedigree-col"><div class="pedigree-card">
      <small>Пари</small>
      <strong>Bellami-Elan Parelyada</strong>
      <p class="caption">Беллами-Елан Парельяда</p>
      <p class="caption">Юный интернациональный чемпион</p>
      <p class="pedigree-titles">JGrCH.RUS, JCH.RKF, JCH.RUS, BJCH.RUS, CISJ Winner, RUS BJW, JSHCH RUS, JSHCH RG, JCH GRGP, JCH.HCC, GJCH.ARM, JCH.ARM, JCH.HRV, RKF BW</p>
      
      <p class="caption">RKF 7350728 · рыжий · клеймо BLQ 194</p>
    </div></div>
      <div class="pedigree-col"><div class="pedigree-card">
      <small>Отец</small>
      <strong>Guardangel Gavroche</strong>
      <p class="caption">Гардэнжэл Гавроче</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 5335035 · рыжий</p>
    </div><div class="pedigree-card">
      <small>Мать</small>
      <strong>Bellami-Elan Zara</strong>
      <p class="caption">Беллами-Елан Зара</p>
      
      
      <p class="caption">CH.RUS · CH.RKF · BT</p>
      <p class="caption">RKF 6738632 · рыжий</p>
    </div></div>
      <div class="pedigree-col"><div class="pedigree-card">
      <small>Отец отца</small>
      <strong>Scandvik Original Inside</strong>
      <p class="caption">Скандвик Оригинал Инсайд</p>
      
      
      <p class="caption">C.I.B. · GCH.RUS · CH.RUS · CH.BLR · JCH.RUS · CH.RKF · BCH.RUS · MW19</p>
      <p class="caption">RKF 4490838 · рыжий</p>
    </div><div class="pedigree-card">
      <small>Мать отца</small>
      <strong>Guardangel Ulana</strong>
      <p class="caption">Гардэнжэл Улана</p>
      
      
      <p class="caption">CH.RUS · JCH.RUS · CH.RKF</p>
      <p class="caption">RKF 3871652 · рыжий</p>
    </div><div class="pedigree-card">
      <small>Отец матери</small>
      <strong>Scandvik Let It Be</strong>
      <p class="caption">Скандвик Лет Ит Би</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RKF · JCH.RUS</p>
      <p class="caption">RKF 6411824 · рыжий</p>
    </div><div class="pedigree-card">
      <small>Мать матери</small>
      <strong>Bellami-Elan Unita</strong>
      <p class="caption">Беллами-Елан Унита</p>
      
      
      
      <p class="caption">RKF 5681690 · рыжий</p>
    </div></div>
      <div class="pedigree-col pedigree-col--gg"><div class="pedigree-card is-compact">
      <small>Отец отца отца</small>
      <strong>Bronwyn Chocolate Chip</strong>
      
      
      
      <p class="caption">C.I.B. · CH.RUS · CH.BLR · CH.CZE · JCH.RUS</p>
      <p class="caption">RKF 3559287 · AKC RN24934601 · чёрно-подпалый</p>
    </div><div class="pedigree-card is-compact">
      <small>Мать отца отца</small>
      <strong>Elantiz Lady Gwyneth</strong>
      
      
      
      <p class="caption">CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 3328072 · KCR AP00458202 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Отец матери отца</small>
      <strong>Ragus Devils Double</strong>
      
      
      
      <p class="caption">WJW · CH.RUS · JCH.RUS · CH.RKF · BEST-DOG-13</p>
      <p class="caption">RKF 3328780 · KCR AP01964102 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Мать матери отца</small>
      <strong>Going To Win</strong>
      
      
      
      <p class="caption">JCH.RUS</p>
      <p class="caption">RKF 2386454 · чёрно-подпалый</p>
    </div><div class="pedigree-card is-compact">
      <small>Отец отца матери</small>
      <strong>Scandvik Harley Davidson</strong>
      <p class="caption">Скандвик Харлей Дэвидсон</p>
      
      
      <p class="caption">GCH.RUS · JGCH.RUS · CH.RUS · JCH.RUS · CH.RKF · BCH.RUS · BJCH.RUS</p>
      <p class="caption">RKF 5867554 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Мать отца матери</small>
      <strong>Red Pumpkin Di Sutri</strong>
      
      
      
      
      <p class="caption">RKF 3536245 · ROI 13/31223 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Отец матери матери</small>
      <strong>Guardangel Gavroche</strong>
      <p class="caption">Гардэнжэл Гавроче</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 5335035 · рыжий</p>
    </div><div class="pedigree-card is-compact">
      <small>Мать матери матери</small>
      <strong>Seventy Seven Zara</strong>
      <p class="caption">Севенти Севен Зара</p>
      
      
      <p class="caption">CH.RUS · JCH.RUS · CH.RKF</p>
      <p class="caption">RKF 2907770 · рыжий</p>
    </div></div>
    </div>
  </div>
    </div></section>
    <section class="section" id="puppies"><div class="container">
        <p class="eyebrow">2027</p><h2>Планируемый помёт</h2>
        <span class="status">Планирование</span>
        <h3 style="margin-top:.8rem">Bellami-Elan Parelyada × партнёр будет объявлен</h3>
        <p>Планируется на 2027 год</p>
        <p class="lede">Партнёр пока не объявлен. Когда вязка будет подтверждена, информация появится здесь, а те, кто оставил заявку, узнают первыми.</p>
        <div class="btn-row"><a class="btn btn-primary" href="#contacts">Написать мне</a></div>
    </div></section>
    <section class="section" id="breed"><div class="container">
        <p class="eyebrow">Порода</p>
        <h2>Подходит ли вам Norwich Terrier?</h2>
        <p class="lede">Если вы рассматриваете щенка, сначала стоит понять, подходит ли вам сама порода — живой терьер в компактном формате.</p>
        <div class="pillars pillars--fit">
          <article class="pillar"><h3>Активный компаньон</h3><p>Норвич хорошо подходит человеку с динамичным ритмом, если рядом есть долгие прогулки, поездки и интерес к совместной жизни — не только «выгул по нужде».</p></article>
          <article class="pillar"><h3>Настоящий терьер</h3><p>Компактный размер не делает его декоративной карманной собакой. Это внимательный, самостоятельный и любознательный терьер.</p></article>
          <article class="pillar"><h3>Социальный и ориентированный на человека</h3><p>Породе обычно важно быть рядом: общение, понятные правила и контакт с владельцем. Долгое одиночество даётся тяжелее, чем короткие отлучки после приучения.</p></article>
          <article class="pillar"><h3>Прогулки, воспитание, нагрузка</h3><p>Уму и телу нужна ежедневная работа. Без прогулок, социализации и последовательных границ дома норвич редко бывает спокойным компаньоном.</p></article>
        </div>
    </div></section>
    <section class="section" id="gallery"><div class="container-wide">
      <p class="eyebrow">Свет</p><h2>Галерея</h2>
      <div data-gallery>
      <div class="gallery-grid gallery-grid--compact">
        <button type="button" class="gallery-item portrait hero-shot" data-caption="Пари — норвич-терьер"><img loading="lazy" data-original="${IMG["pari-hero.jpg"]}" src="${previewFor(IMG["pari-hero.jpg"])}" alt="Пари — норвич-терьер" /></button><button type="button" class="gallery-item square" data-caption="Портрет Пари"><img loading="lazy" data-original="${IMG["pari-portrait-01.jpg"]}" src="${previewFor(IMG["pari-portrait-01.jpg"])}" alt="Портрет Пари" /></button><button type="button" class="gallery-item portrait" data-caption="Пари в лесу"><img loading="lazy" data-original="${IMG["pari-live-log.jpg"]}" src="${previewFor(IMG["pari-live-log.jpg"])}" alt="Пари идёт по бревну в лесу" /></button><button type="button" class="gallery-item portrait" data-caption="Пари с розетками"><img loading="lazy" data-original="${IMG["pari-live-awards.jpg"]}" src="${previewFor(IMG["pari-live-awards.jpg"])}" alt="Пари среди выставочных розеток" /></button><button type="button" class="gallery-item landscape" data-caption="Пари на подиуме CACIB FCI Минск"><img loading="lazy" data-original="${IMG["pari-show-minsk-podium.jpg"]}" src="${previewFor(IMG["pari-show-minsk-podium.jpg"])}" alt="Пари на подиуме CACIB FCI Минск" /></button>
      </div>
      <div class="lightbox" data-lightbox hidden role="dialog" aria-modal="true">
        <div class="lightbox-bar"><p data-lightbox-caption></p><button class="btn btn-ghost" type="button" data-lightbox-close>Закрыть просмотр</button></div>
        <div class="lightbox-stage"><img alt="" /></div>
        <div class="lightbox-bar">
          <button class="btn btn-ghost" type="button" data-lightbox-prev>Предыдущее фото</button>
          <button class="btn btn-ghost" type="button" data-lightbox-next>Следующее фото</button>
        </div>
      </div>
      </div>
    </div></section>
    ${contactsHtml("ru")} 
    <section class="section"><div class="container">
      <h2>Следить за историей Пари</h2>
      <p class="lede">Мы уже в <a href="https://t.me/norwichinfo" target="_blank" rel="noopener">Telegram</a> и <a href="https://vk.ru/norwichinfo" target="_blank" rel="noopener">VK</a>.</p>
      
    </div></section>
  </main>
  ${footerHtml("ru")}
  
`;
