export type SitePhoto = {
  id: string;
  slot: string;
  url: string;
  caption: string | null;
  alt: string | null;
  sort_order: number;
};

export type SiteLitter = {
  id: string;
  name: string;
  planned_date: string | null;
  status: string;
  headline_ru: string | null;
  body_ru: string | null;
  headline_en: string | null;
  body_en: string | null;
  timing_label_ru: string | null;
  timing_label_en: string | null;
  is_published: boolean;
};

export type SiteOverrides = {
  content: Record<string, string>;
  photos: SitePhoto[];
  litter: SiteLitter | null;
};

export const CONTENT_FIELDS = [
  { key: "hero_eyebrow", label: "Главный экран · надпись сверху" },
  { key: "hero_rank", label: "Главный экран · звание" },
  { key: "hero_lede", label: "Главный экран · описание" },
  { key: "hero_note", label: "Главный экран · подпись под описанием" },
  { key: "about_title", label: "О собаке · заголовок" },
  { key: "about_text", label: "О собаке · текст (абзацы через пустую строку)", multiline: true },
  { key: "contacts_title", label: "Контакты · заголовок" },
  { key: "contacts_text", label: "Контакты · текст", multiline: true },
] as const;

export const PHOTO_SLOTS = [
  { slot: "hero", label: "Главный экран", multiple: false },
  { slot: "about", label: "Блок «Знакомство»", multiple: false },
  { slot: "show_career", label: "Блок «Выставочная карьера»", multiple: false },
  { slot: "contacts", label: "Блок «Контакты»", multiple: false },
  { slot: "gallery", label: "Галерея", multiple: true },
  { slot: "diploma", label: "Дипломы", multiple: true },
] as const;

const STATUS_LABEL: Record<string, { ru: string; en: string }> = {
  planning: { ru: "Планируется", en: "Planning" },
  expected: { ru: "Ожидается", en: "Expected" },
  born: { ru: "Щенки родились", en: "Puppies born" },
  reserved: { ru: "Все зарезервированы", en: "All reserved" },
};

export const LITTER_STATUSES = [
  { value: "planning", label: "Планируется" },
  { value: "expected", label: "Ожидается" },
  { value: "born", label: "Щенки родились" },
  { value: "reserved", label: "Все зарезервированы" },
];

function setText(root: HTMLElement, selector: string, value: string) {
  const el = root.querySelector(selector);
  if (el && value.trim()) el.textContent = value;
}

function setImage(root: HTMLElement, selector: string, url: string | undefined) {
  if (!url) return;
  const el = root.querySelector<HTMLImageElement>(selector);
  if (el) el.src = url;
}

const GALLERY_SHAPES = ["portrait hero-shot", "square", "portrait", "portrait", "landscape"];

export function applyOverrides(
  root: HTMLElement,
  overrides: SiteOverrides | null,
  locale: "ru" | "en",
) {
  if (!overrides) return;
  const c = overrides.content;

  setText(root, ".hero-copy .eyebrow", c["hero_eyebrow"] ?? "");
  setText(root, ".hero-rank", c["hero_rank"] ?? "");
  setText(root, ".hero-copy .lede", c["hero_lede"] ?? "");
  setText(root, ".hero-note", c["hero_note"] ?? "");
  setText(root, "#about h2", c["about_title"] ?? "");
  setText(root, "#contacts h2", c["contacts_title"] ?? "");
  setText(root, "#contacts .lede", c["contacts_text"] ?? "");

  const aboutText = (c["about_text"] ?? "").trim();
  const meet = root.querySelector("#about .meet-copy");
  if (meet && aboutText) {
    meet.querySelectorAll("p:not(.eyebrow)").forEach((p) => p.remove());
    aboutText
      .split(/\n{2,}/)
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => {
        const p = document.createElement("p");
        p.textContent = part;
        meet.appendChild(p);
      });
  }

  const bySlot = new Map<string, SitePhoto[]>();
  overrides.photos.forEach((photo) => {
    const list = bySlot.get(photo.slot) ?? [];
    list.push(photo);
    bySlot.set(photo.slot, list);
  });
  const single = (slot: string) => bySlot.get(slot)?.[0]?.url;

  setImage(root, ".hero-media img", single("hero"));
  setImage(root, "#about .media-frame img", single("about"));
  setImage(root, ".show-career-photo img", single("show_career"));
  setImage(root, "#contacts .media-frame img", single("contacts"));

  const gallery = bySlot.get("gallery") ?? [];
  const grid = root.querySelector(".gallery-grid");
  if (grid && gallery.length > 0) {
    grid.innerHTML = gallery
      .map((photo, index) => {
        const caption = photo.caption ?? "";
        const alt = photo.alt ?? caption;
        const shape = GALLERY_SHAPES[index % GALLERY_SHAPES.length];
        return `<button type="button" class="gallery-item ${shape}" data-caption="${escapeAttr(caption)}"><img src="${escapeAttr(photo.url)}" alt="${escapeAttr(alt)}" loading="lazy" /></button>`;
      })
      .join("");
  }

  const diplomas = bySlot.get("diploma") ?? [];
  const row = root.querySelector(".diploma-row");
  if (row && diplomas.length > 0) {
    row.innerHTML = diplomas
      .map((photo) => {
        const caption = photo.caption ?? "";
        return `<button type="button" class="diploma-card" data-caption="${escapeAttr(caption)}"><span class="diploma-frame"><img src="${escapeAttr(photo.url)}" alt="${escapeAttr(photo.alt ?? caption)}" loading="lazy" /></span><span class="diploma-label">${escapeHtml(caption)}</span></button>`;
      })
      .join("");
  }

  const litter = overrides.litter;
  const section = root.querySelector("#puppies");
  if (litter && litter.is_published && section) {
    const headline = (locale === "en" ? litter.headline_en : litter.headline_ru) ?? litter.name;
    const body = (locale === "en" ? litter.body_en : litter.body_ru) ?? "";
    const timing = (locale === "en" ? litter.timing_label_en : litter.timing_label_ru) ?? "";
    const status = STATUS_LABEL[litter.status]?.[locale] ?? litter.status;
    const year = litter.planned_date ? litter.planned_date.slice(0, 4) : "";

    if (year) setText(section as HTMLElement, ".eyebrow", year);
    setText(section as HTMLElement, ".status", status);
    const h3 = section.querySelector("h3");
    if (h3 && headline) h3.textContent = headline;
    const paragraphs = section.querySelectorAll("p:not(.eyebrow)");
    const timingP = paragraphs[0];
    if (timingP && timing) timingP.textContent = timing;
    const lede = section.querySelector("p.lede");
    if (lede && body) lede.textContent = body;
  }
}

function escapeAttr(value: string) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
