import a0 from "@/assets/pari-hero.jpg.asset.json";
import a1 from "@/assets/pari-portrait-01.jpg.asset.json";
import a2 from "@/assets/pari-show-career.jpg.asset.json";
import a3 from "@/assets/diploma-jch-arm.jpg.asset.json";
import a4 from "@/assets/diploma-jgrch-arm.jpg.asset.json";
import a5 from "@/assets/diploma-jch-hrv.jpg.asset.json";
import a6 from "@/assets/diploma-jch-rus.jpg.asset.json";
import a7 from "@/assets/diploma-jgrch-rus.jpg.asset.json";
import a8 from "@/assets/diploma-jshch-rus.jpg.asset.json";
import a9 from "@/assets/diploma-cisj-winner.jpg.asset.json";
import a10 from "@/assets/pari-live-log.jpg.asset.json";
import a11 from "@/assets/pari-live-awards.jpg.asset.json";
import a12 from "@/assets/pari-show-minsk-podium.jpg.asset.json";

const IMG: Record<string, string> = {
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

export const title = "Bellami-Elan Parelyada — Norwich Terrier Pari";
export const description = "Bellami-Elan Parelyada (Pari) — Norwich Terrier, Junior International Champion.";
export const bodyHtml = `
  <a class="skip-link" href="#content">Skip to content</a>
  <div class="site-chrome">
  <header class="site-header is-solid">
    <div class="header-inner">
      <a class="wordmark" href="#top">Bellami-Elan Parelyada</a>
      <nav class="desktop-nav" aria-label="Primary"><a href="#about">Pari</a><a href="#shows">Shows</a><a href="#breed">The Breed</a><a href="#puppies">Planned Litter</a><a href="#gallery">Gallery</a><a href="#contacts">Contact</a></nav>
      <div class="header-tools">
        <div class="lang-switch" aria-label="Language">
          <a href="/"  hreflang="ru">RU</a>
          <span aria-hidden="true">|</span>
          <a href="/en" aria-current="true" hreflang="en">EN</a>
        </div>
        <a class="btn btn-primary header-cta" href="#puppy-application">Puppy Enquiry</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span></button>
      </div>
    </div>
  </header>
    <nav id="mobile-menu" class="mobile-nav" hidden aria-label="Menu">
      <div class="mobile-nav-top">
        <p class="caption" style="margin:0">Site sections</p>
        <button class="btn btn-line" type="button" data-close-menu>Close</button>
      </div>
      <a href="#about">Pari</a><a href="#shows">Shows</a><a href="#breed">The Breed</a><a href="#puppies">Planned Litter</a><a href="#gallery">Gallery</a><a href="#contacts">Contact</a>
      <a class="btn btn-primary" href="#puppy-application">Puppy Enquiry</a>
    </nav>
  </div>
  <main id="content">
    
    
    <section class="hero">
      <div class="hero-media"><img src="${IMG["pari-hero.jpg"]}" alt="Norwich Terrier Bellami-Elan Parelyada (Pari)" /></div>
      <div class="hero-copy">
        <p class="eyebrow">Norwich Terrier</p>
        <h1 class="hero-name"><span class="hero-name-line">Bellami-Elan</span><span class="hero-name-script">Parelyada</span></h1>
        <p class="hero-rank">Junior International Champion</p>
        <p class="hero-titles">JGrCH.RUS, JCH.RKF, JCH.RUS, BJCH.RUS, CISJ Winner, RUS BJW, JSHCH RUS, JSHCH RG, JCH GRGP, JCH.HCC, GJCH.ARM, JCH.ARM, JCH.HRV, RKF BW</p>
        <p class="lede">Show career. International bloodlines. Future breeding programme.</p>
        <p class="hero-note">Future plans · 2027</p>
        <div class="btn-row">
          <a class="btn btn-primary" href="#puppies">Planned Litter</a>
          <a class="btn btn-line" href="#about">Meet Pari</a>
        </div>
      </div>
    </section>
    <section class="section meet-section" id="about"><div class="container-wide split split-top split-fit">
      <div class="media-frame split-fit-photo"><img src="${IMG["pari-portrait-01.jpg"]}" alt="Norwich Terrier Bellami-Elan Parelyada (Pari)" /></div>
      <div class="meet-copy">
        <p class="eyebrow">Meet Pari</p>
        <h2>A little terrier with the character of a much larger dog</h2>
        <p>The Norwich Terrier is compact, but a true terrier: intelligent, companionable, curious and energetic. She likes to be close to people, share their life, walk, travel and discover new things. With enough activity and clear rules she is a comfortable companion — lively outdoors and calm at home.</p>
        <p>That is the dog I was looking for. The breed was a deliberate choice: before the puppy arrived I read a great deal about Norwich and knew the character I wanted. The decision to take Bellami-Elan Parelyada — Pari — came almost at once.</p>
        <p>Pari has turned out exactly as I imagined: intelligent, open, observant and very social. From an early age we worked on socialisation, walked, travelled and got used to new places. Today she adapts easily to trips and remains a very comfortable dog in everyday life.</p>
        <p>For me Pari is first of all character, not titles. It is the combination of temperament, breed type, pedigree and independent evaluations that makes her the foundation of a future breeding programme.</p>
      </div>
    </div></section>
    <section class="section" id="shows"><div class="container-wide split show-career-split">
      <div class="show-career-copy">
        <p class="eyebrow">The ring</p>
        <h2>Show career</h2>
        <p>Pari began in the baby class and moved through puppy and junior, competing at national and international shows. In her first show period she earned the main junior titles in Russia and her first high evaluations from European judges.</p>
        <p>For us shows are not only titles, but an independent assessment of type, anatomy, movement, coat and temperament.</p>
        <p>European judges have repeatedly noted her breed type, proportions, balance, head, topline, coat texture, free movement and temperament. They have also noted that she is still young and continues to develop physically.</p>
        <dl class="facts show-summary">
          <div class="fact"><dt>Classes</dt><dd>Baby · Puppy · Junior</dd></div>
          <div class="fact"><dt>Geography</dt><dd>Russia · Armenia · Croatia · Italy</dd></div>
          <div class="fact fact--wide"><dt>Key results</dt><dd>BISP-1 · BISP-3 · BISJ-1 · BISJ-2 · BIG-1 · BIG-2 · BIG-3 · BIS-2 · Best of Breed</dd></div>
        </dl>
        <div class="btn-row show-career-cta">
          <a class="btn btn-line" href="https://norwichterrier.info/en/shows.html">All show results →</a>
        </div>
        <p class="caption">The full list of shows, evaluations, judges and certificates is available on the main website.</p>
      </div>
      <div class="media-frame show-career-photo"><img src="${IMG["pari-show-career.jpg"]}" alt="Bellami-Elan Parelyada at a dog show" /></div>
    </div></section>
    <section class="section"><div class="container-wide">
      <p class="eyebrow">Why Pari</p><h2>Foundation of a future programme</h2>
      <div class="pillars pillars--flush">
        <article class="pillar"><h3>Show career</h3><p>The ring is how type is tested. Results will be updated here as they are confirmed, without invented wins. Titles include Junior Champion of Armenia, Junior Grand Champion of Armenia, Croatian Junior Champion and Russian Junior Champion.</p></article>
        <article class="pillar"><h3>Pedigree</h3><p>The pedigree can be viewed in the <a href="#pedigree">Bloodlines / Pedigree</a> section.</p></article>
        <article class="pillar"><h3>Temperament</h3><p>A Norwich should remain a living working small dog — comfortable in a family and readable in the ring.</p></article>
        <article class="pillar"><h3>Health</h3><p>Tests will be published after they exist. No certificates invented in advance.</p></article>
        <article class="pillar"><h3>International strategy</h3><p>Partners will be considered for type and diversity of bloodlines, not for nearest convenience.</p></article>
      </div>
      <div class="diploma-block" data-gallery>
    <div class="diploma-row"><button type="button" class="diploma-card" data-caption="Junior Champion of Armenia"><span class="diploma-frame"><img src="${IMG["diploma-jch-arm.jpg"]}" alt="Junior Champion of Armenia" /></span><span class="diploma-label">Junior Champion of Armenia</span></button><button type="button" class="diploma-card" data-caption="Junior Grand Champion of Armenia"><span class="diploma-frame"><img src="${IMG["diploma-jgrch-arm.jpg"]}" alt="Junior Grand Champion of Armenia" /></span><span class="diploma-label">Junior Grand Champion of Armenia</span></button><button type="button" class="diploma-card" data-caption="Croatian Junior Champion"><span class="diploma-frame"><img src="${IMG["diploma-jch-hrv.jpg"]}" alt="Croatian Junior Champion" /></span><span class="diploma-label">Croatian Junior Champion</span></button><button type="button" class="diploma-card" data-caption="Russian Junior Champion"><span class="diploma-frame"><img src="${IMG["diploma-jch-rus.jpg"]}" alt="Russian Junior Champion" /></span><span class="diploma-label">Russian Junior Champion</span></button><button type="button" class="diploma-card" data-caption="Russian Junior Grand Champion"><span class="diploma-frame"><img src="${IMG["diploma-jgrch-rus.jpg"]}" alt="Russian Junior Grand Champion" /></span><span class="diploma-label">Russian Junior Grand Champion</span></button><button type="button" class="diploma-card" data-caption="Russian Junior Show Champion"><span class="diploma-frame"><img src="${IMG["diploma-jshch-rus.jpg"]}" alt="Russian Junior Show Champion" /></span><span class="diploma-label">Russian Junior Show Champion</span></button><button type="button" class="diploma-card" data-caption="CIS Junior Winner"><span class="diploma-frame"><img src="${IMG["diploma-cisj-winner.jpg"]}" alt="CIS Junior Winner" /></span><span class="diploma-label">CIS Junior Winner</span></button></div>
    <div class="lightbox" data-lightbox hidden role="dialog" aria-modal="true">
      <div class="lightbox-bar"><p data-lightbox-caption></p><button class="btn btn-ghost" type="button" data-lightbox-close>Close viewer</button></div>
      <div class="lightbox-stage"><img alt="" /></div>
      <div class="lightbox-bar">
        <button class="btn btn-ghost" type="button" data-lightbox-prev>Previous image</button>
        <button class="btn btn-ghost" type="button" data-lightbox-next>Next image</button>
      </div>
    </div>
  </div>
    </div></section>
    <section class="section" id="pedigree" style="background:var(--ivory-deep)"><div class="container-wide">
      <p class="eyebrow">Bloodlines</p><h2>Pedigree</h2>
      <div class="pedigree-mobile">
    <details open><summary><span class="eyebrow">Dog</span><strong>Bellami-Elan Parelyada</strong></summary><div class="pedigree-card">
      <small>Dog</small>
      <strong>Bellami-Elan Parelyada</strong>
      <p class="caption">Беллами-Елан Парельяда</p>
      <p class="caption">Junior International Champion</p>
      <p class="pedigree-titles">JGrCH.RUS, JCH.RKF, JCH.RUS, BJCH.RUS, CISJ Winner, RUS BJW, JSHCH RUS, JSHCH RG, JCH GRGP, JCH.HCC, GJCH.ARM, JCH.ARM, JCH.HRV, RKF BW</p>
      
      <p class="caption">RKF 7350728 · red · tattoo BLQ 194</p>
    </div></details>
    <details><summary><span class="eyebrow">Sire</span><strong>Guardangel Gavroche</strong></summary><div class="pedigree-card">
      <small>Sire</small>
      <strong>Guardangel Gavroche</strong>
      <p class="caption">Гардэнжэл Гавроче</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 5335035 · red</p>
    </div><div class="pedigree-card">
      <small>Sire’s sire</small>
      <strong>Scandvik Original Inside</strong>
      <p class="caption">Скандвик Оригинал Инсайд</p>
      
      
      <p class="caption">C.I.B. · GCH.RUS · CH.RUS · CH.BLR · JCH.RUS · CH.RKF · BCH.RUS · MW19</p>
      <p class="caption">RKF 4490838 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Sire of sire’s sire</small>
      <strong>Bronwyn Chocolate Chip</strong>
      
      
      
      <p class="caption">C.I.B. · CH.RUS · CH.BLR · CH.CZE · JCH.RUS</p>
      <p class="caption">RKF 3559287 · AKC RN24934601 · black & tan</p>
    </div><div class="pedigree-card is-compact">
      <small>Dam of sire’s sire</small>
      <strong>Elantiz Lady Gwyneth</strong>
      
      
      
      <p class="caption">CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 3328072 · KCR AP00458202 · red</p>
    </div><div class="pedigree-card">
      <small>Sire’s dam</small>
      <strong>Guardangel Ulana</strong>
      <p class="caption">Гардэнжэл Улана</p>
      
      
      <p class="caption">CH.RUS · JCH.RUS · CH.RKF</p>
      <p class="caption">RKF 3871652 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Sire of sire’s dam</small>
      <strong>Ragus Devils Double</strong>
      
      
      
      <p class="caption">WJW · CH.RUS · JCH.RUS · CH.RKF · BEST-DOG-13</p>
      <p class="caption">RKF 3328780 · KCR AP01964102 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Dam of sire’s dam</small>
      <strong>Going To Win</strong>
      
      
      
      <p class="caption">JCH.RUS</p>
      <p class="caption">RKF 2386454 · black & tan</p>
    </div></details>
    <details><summary><span class="eyebrow">Dam</span><strong>Bellami-Elan Zara</strong></summary><div class="pedigree-card">
      <small>Dam</small>
      <strong>Bellami-Elan Zara</strong>
      <p class="caption">Беллами-Елан Зара</p>
      
      
      <p class="caption">CH.RUS · CH.RKF · BT</p>
      <p class="caption">RKF 6738632 · red</p>
    </div><div class="pedigree-card">
      <small>Dam’s sire</small>
      <strong>Scandvik Let It Be</strong>
      <p class="caption">Скандвик Лет Ит Би</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RKF · JCH.RUS</p>
      <p class="caption">RKF 6411824 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Sire of dam’s sire</small>
      <strong>Scandvik Harley Davidson</strong>
      <p class="caption">Скандвик Харлей Дэвидсон</p>
      
      
      <p class="caption">GCH.RUS · JGCH.RUS · CH.RUS · JCH.RUS · CH.RKF · BCH.RUS · BJCH.RUS</p>
      <p class="caption">RKF 5867554 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Dam of dam’s sire</small>
      <strong>Red Pumpkin Di Sutri</strong>
      
      
      
      
      <p class="caption">RKF 3536245 · ROI 13/31223 · red</p>
    </div><div class="pedigree-card">
      <small>Dam’s dam</small>
      <strong>Bellami-Elan Unita</strong>
      <p class="caption">Беллами-Елан Унита</p>
      
      
      
      <p class="caption">RKF 5681690 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Sire of dam’s dam</small>
      <strong>Guardangel Gavroche</strong>
      <p class="caption">Гардэнжэл Гавроче</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 5335035 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Dam of dam’s dam</small>
      <strong>Seventy Seven Zara</strong>
      <p class="caption">Севенти Севен Зара</p>
      
      
      <p class="caption">CH.RUS · JCH.RUS · CH.RKF</p>
      <p class="caption">RKF 2907770 · red</p>
    </div></details>
  </div>
  <div class="pedigree-desktop">
    <div class="pedigree-tree">
      <div class="pedigree-col"><div class="pedigree-card">
      <small>Dog</small>
      <strong>Bellami-Elan Parelyada</strong>
      <p class="caption">Беллами-Елан Парельяда</p>
      <p class="caption">Junior International Champion</p>
      <p class="pedigree-titles">JGrCH.RUS, JCH.RKF, JCH.RUS, BJCH.RUS, CISJ Winner, RUS BJW, JSHCH RUS, JSHCH RG, JCH GRGP, JCH.HCC, GJCH.ARM, JCH.ARM, JCH.HRV, RKF BW</p>
      
      <p class="caption">RKF 7350728 · red · tattoo BLQ 194</p>
    </div></div>
      <div class="pedigree-col"><div class="pedigree-card">
      <small>Sire</small>
      <strong>Guardangel Gavroche</strong>
      <p class="caption">Гардэнжэл Гавроче</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 5335035 · red</p>
    </div><div class="pedigree-card">
      <small>Dam</small>
      <strong>Bellami-Elan Zara</strong>
      <p class="caption">Беллами-Елан Зара</p>
      
      
      <p class="caption">CH.RUS · CH.RKF · BT</p>
      <p class="caption">RKF 6738632 · red</p>
    </div></div>
      <div class="pedigree-col"><div class="pedigree-card">
      <small>Sire’s sire</small>
      <strong>Scandvik Original Inside</strong>
      <p class="caption">Скандвик Оригинал Инсайд</p>
      
      
      <p class="caption">C.I.B. · GCH.RUS · CH.RUS · CH.BLR · JCH.RUS · CH.RKF · BCH.RUS · MW19</p>
      <p class="caption">RKF 4490838 · red</p>
    </div><div class="pedigree-card">
      <small>Sire’s dam</small>
      <strong>Guardangel Ulana</strong>
      <p class="caption">Гардэнжэл Улана</p>
      
      
      <p class="caption">CH.RUS · JCH.RUS · CH.RKF</p>
      <p class="caption">RKF 3871652 · red</p>
    </div><div class="pedigree-card">
      <small>Dam’s sire</small>
      <strong>Scandvik Let It Be</strong>
      <p class="caption">Скандвик Лет Ит Би</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RKF · JCH.RUS</p>
      <p class="caption">RKF 6411824 · red</p>
    </div><div class="pedigree-card">
      <small>Dam’s dam</small>
      <strong>Bellami-Elan Unita</strong>
      <p class="caption">Беллами-Елан Унита</p>
      
      
      
      <p class="caption">RKF 5681690 · red</p>
    </div></div>
      <div class="pedigree-col pedigree-col--gg"><div class="pedigree-card is-compact">
      <small>Sire of sire’s sire</small>
      <strong>Bronwyn Chocolate Chip</strong>
      
      
      
      <p class="caption">C.I.B. · CH.RUS · CH.BLR · CH.CZE · JCH.RUS</p>
      <p class="caption">RKF 3559287 · AKC RN24934601 · black & tan</p>
    </div><div class="pedigree-card is-compact">
      <small>Dam of sire’s sire</small>
      <strong>Elantiz Lady Gwyneth</strong>
      
      
      
      <p class="caption">CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 3328072 · KCR AP00458202 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Sire of sire’s dam</small>
      <strong>Ragus Devils Double</strong>
      
      
      
      <p class="caption">WJW · CH.RUS · JCH.RUS · CH.RKF · BEST-DOG-13</p>
      <p class="caption">RKF 3328780 · KCR AP01964102 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Dam of sire’s dam</small>
      <strong>Going To Win</strong>
      
      
      
      <p class="caption">JCH.RUS</p>
      <p class="caption">RKF 2386454 · black & tan</p>
    </div><div class="pedigree-card is-compact">
      <small>Sire of dam’s sire</small>
      <strong>Scandvik Harley Davidson</strong>
      <p class="caption">Скандвик Харлей Дэвидсон</p>
      
      
      <p class="caption">GCH.RUS · JGCH.RUS · CH.RUS · JCH.RUS · CH.RKF · BCH.RUS · BJCH.RUS</p>
      <p class="caption">RKF 5867554 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Dam of dam’s sire</small>
      <strong>Red Pumpkin Di Sutri</strong>
      
      
      
      
      <p class="caption">RKF 3536245 · ROI 13/31223 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Sire of dam’s dam</small>
      <strong>Guardangel Gavroche</strong>
      <p class="caption">Гардэнжэл Гавроче</p>
      
      
      <p class="caption">CH.RKF · CH.RUS · JCH.RUS</p>
      <p class="caption">RKF 5335035 · red</p>
    </div><div class="pedigree-card is-compact">
      <small>Dam of dam’s dam</small>
      <strong>Seventy Seven Zara</strong>
      <p class="caption">Севенти Севен Зара</p>
      
      
      <p class="caption">CH.RUS · JCH.RUS · CH.RKF</p>
      <p class="caption">RKF 2907770 · red</p>
    </div></div>
    </div>
  </div>
    </div></section>
    <section class="section" id="puppies"><div class="container">
        <p class="eyebrow">2027</p><h2>Planned litter</h2>
        <span class="status">Planning</span>
        <h3 style="margin-top:.8rem">Bellami-Elan Parelyada × To Be Announced</h3>
        <p>Planned for 2027</p>
        <p class="lede">The stud dog is not announced yet. Once the mating is confirmed, the details appear here and everyone who sent an enquiry hears first.</p>
        <div class="btn-row"><a class="btn btn-primary" href="#puppy-application">Send an enquiry</a></div>
    </div></section>
    <section class="section" id="breed"><div class="container">
        <p class="eyebrow">The breed</p>
        <h2>Is a Norwich Terrier right for you?</h2>
        <p class="lede">If you are considering a puppy, it is worth first understanding whether the breed itself suits you — a living terrier in a compact format.</p>
        <div class="pillars pillars--fit">
          <article class="pillar"><h3>An active companion</h3><p>A Norwich suits someone with a dynamic rhythm, if there are long walks, travel and a shared life — not only “a walk when needed”.</p></article>
          <article class="pillar"><h3>A true terrier</h3><p>A compact size does not make her an ornamental pocket dog. This is an attentive, independent and curious terrier.</p></article>
          <article class="pillar"><h3>Social and people-oriented</h3><p>The breed usually needs to be nearby: contact, clear rules and a bond with the owner. Long solitude is harder than short absences after training.</p></article>
          <article class="pillar"><h3>Walks, training, activity</h3><p>Mind and body need daily work. Without walks, socialisation and consistent boundaries at home a Norwich is rarely a calm companion.</p></article>
        </div>
    </div></section>
    <section class="section" id="gallery"><div class="container-wide">
      <p class="eyebrow">Light</p><h2>Gallery</h2>
      <div data-gallery>
      <div class="gallery-grid gallery-grid--compact">
        <button type="button" class="gallery-item portrait hero-shot" data-caption="Pari — Norwich Terrier"><img src="${IMG["pari-hero.jpg"]}" alt="Pari — Norwich Terrier" /></button><button type="button" class="gallery-item square" data-caption="Portrait of Pari"><img src="${IMG["pari-portrait-01.jpg"]}" alt="Portrait of Pari" /></button><button type="button" class="gallery-item portrait" data-caption="Pari in the forest"><img src="${IMG["pari-live-log.jpg"]}" alt="Pari walking along a log in the forest" /></button><button type="button" class="gallery-item portrait" data-caption="Pari with rosettes"><img src="${IMG["pari-live-awards.jpg"]}" alt="Pari among show rosettes" /></button><button type="button" class="gallery-item landscape" data-caption="Pari on the CACIB FCI Minsk podium"><img src="${IMG["pari-show-minsk-podium.jpg"]}" alt="Pari on the CACIB FCI Minsk podium" /></button>
      </div>
      <div class="lightbox" data-lightbox hidden role="dialog" aria-modal="true">
        <div class="lightbox-bar"><p data-lightbox-caption></p><button class="btn btn-ghost" type="button" data-lightbox-close>Close viewer</button></div>
        <div class="lightbox-stage"><img alt="" /></div>
        <div class="lightbox-bar">
          <button class="btn btn-ghost" type="button" data-lightbox-prev>Previous image</button>
          <button class="btn btn-ghost" type="button" data-lightbox-next>Next image</button>
        </div>
      </div>
      </div>
    </div></section>
    <section class="section enquiry-band" id="contacts"><div class="container-wide enquiry-split">
    <div class="media-frame" style="min-height:320px;aspect-ratio:4/3"><img src="${IMG["pari-portrait-01.jpg"]}" alt="Portrait of Pari" style="object-position:50% 40%" /></div>
    <div>
      <p class="eyebrow">2027</p>
      <h2>Interested in a future Pari puppy?</h2>
      <p class="lede">The breeding programme is being prepared in advance. A first litter is planned for 2027; a partner has not been announced. If a Norwich may be right for you, you can submit an enquiry — interest, not a reservation.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="#puppy-application">Puppy Enquiry</a>
        <a class="btn btn-ghost" href="#puppies">Planned Litter</a>
      </div>
    </div>
  </div>
  <div class="container enquiry-form" id="puppy-application">
    <h2>Puppy Enquiry</h2>
    <p class="caption" style="margin-top:0;margin-bottom:1.1rem"><a href="mailto:contact@norwichterrier.info">contact@norwichterrier.info</a></p>
    <form class="form" action="../enquiry.php" method="post" data-enquiry-form data-required="Required field" data-invalid-email="Please enter a valid email" data-send-error="Could not send. Write directly to contact@norwichterrier.info" novalidate>
    <p data-form-alert hidden class="error">Please fill in all required fields and tick the consent box below.</p>
    <input type="hidden" name="locale" value="en" />
    <input type="hidden" name="next" value="/en" />
    <p class="hp" aria-hidden="true"><label>Fax <input type="text" name="fax_leave_empty" tabindex="-1" autocomplete="off" /></label></p>
    <div class="field"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required /><span class="error"></span></div>
    <div class="field"><label for="place">Country / city</label><input id="place" name="place" required /><span class="error"></span></div>
    <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" inputmode="email" autocomplete="email" required /><span class="error"></span></div>
    <div class="field"><label for="preferredContact">Preferred contact</label><select id="preferredContact" name="preferredContact" required><option value="">Choose</option><option value="telegram">Telegram</option><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="instagram">Instagram</option><option value="other">Other</option></select><span class="error"></span></div>
    <div class="field"><label for="handle">Handle / phone (optional)</label><input id="handle" name="handle" /><span class="error"></span></div>
    <div class="field"><label for="timing">When are you considering a puppy?</label><select id="timing" name="timing" required><option value="">Choose</option><option value="next-litter">Next planned litter</option><option value="within-year">Within a year</option><option value="1-2-years">1–2 years</option><option value="researching">Still researching the breed</option></select><span class="error"></span></div>
    <div class="field"><label for="purpose">Purpose</label><select id="purpose" name="purpose" required><option value="">Choose</option><option value="companion">Family companion</option><option value="shows">Shows</option><option value="breeding">Breeding</option><option value="sports">Sport / activity</option><option value="unsure">Not sure yet</option></select><span class="error"></span></div>
    <div class="field"><label for="experience">Experience with dogs</label><select id="experience" name="experience" required><option value="">Choose</option><option value="first">First dog</option><option value="owned">Have owned dogs before</option><option value="terrier">Experience with terriers</option><option value="norwich">Experience with Norwich Terriers</option></select><span class="error"></span></div>
    <div class="field"><label for="whyNorwich">Why a Norwich Terrier?</label><textarea id="whyNorwich" name="whyNorwich" required></textarea><span class="error"></span></div>
    <div class="field"><label for="message">Additional message (optional)</label><textarea id="message" name="message"></textarea><span class="error"></span></div>
    <div class="field"><label class="consent"><input type="checkbox" name="consent" value="1" /><span>I agree to the processing of the data provided in order to receive a reply.</span></label><span class="error"></span></div>
    <button class="btn btn-primary" type="submit">Send enquiry</button>
    <p class="caption">A detailed questionnaire will appear closer to the litter. This is a short enquiry only.</p>
  </form>
  <div class="success-panel" data-success hidden>
    <h2>Enquiry sent</h2>
    <p>The message has gone to contact@norwichterrier.info. Maria will reply when she can. This is interest, not a puppy reservation.</p>
  </div>
  </div></section>
    <section class="section"><div class="container">
      <h2>Follow Pari’s journey</h2>
      <p class="lede">Telegram, Instagram, VK and Facebook links will appear when they are confirmed.</p>
      
    </div></section>
  </main>
  <footer class="site-footer">
    <div class="container-wide">
      <div class="footer-grid">
        <div>
          <p class="serif" style="font-size:1.6rem;margin-bottom:.4rem">Bellami-Elan Parelyada</p>
          <p>Norwich Terrier</p>
          <p class="caption" style="color:color-mix(in srgb, var(--ivory) 70%, transparent)">Norwich Terrier · Shows · Breeding programme</p>
        </div>
        <nav class="footer-nav"><a href="#about">Pari</a><a href="#shows">Shows</a><a href="#breed">The Breed</a><a href="#puppies">Planned Litter</a><a href="#gallery">Gallery</a><a href="#contacts">Contact</a></nav>
        <div>
          <a class="btn btn-ghost" href="#puppy-application">Puppy Enquiry</a>
          <div class="social-list" style="margin-top:1.4rem">
            <span class="muted">Telegram — Coming soon</span>
            <span class="muted">Instagram — Coming soon</span>
            <span class="muted">VK — Coming soon</span>
            <span class="muted">Facebook — Coming soon</span>
          </div>
          <p style="margin-top:1rem"><a href="/">RU</a> | <a href="/en">EN</a></p>
        </div>
      </div>
      <div class="footer-meta">
        <span>© 2026 Bellami-Elan Parelyada</span>
        <span><a href="/en/legal/privacy">Privacy</a> · <a href="/en/legal/terms">Terms</a> · <a href="/en/legal/offer">Public offer</a></span>
        
      </div>
    </div>
  </footer>
  
`;
