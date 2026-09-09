type Cleanup = () => void;

/**
 * Interactive behaviour of the landing page (menu, gallery lightbox, show
 * filters, enquiry form). Ported from the original site.js.
 */
export function initLanding(
  root: HTMLElement,
  options: {
    onSubmit: (values: Record<string, string>) => Promise<{ ok: boolean; message?: string }>;
  },
): Cleanup {
  const cleanups: Cleanup[] = [];
  const on = <K extends keyof HTMLElementEventMap>(
    target: EventTarget | null | undefined,
    type: K | string,
    handler: EventListenerOrEventListenerObject,
    opts?: AddEventListenerOptions,
  ) => {
    if (!target) return;
    target.addEventListener(type, handler, opts);
    cleanups.push(() => target.removeEventListener(type, handler, opts));
  };

  const header = root.querySelector(".site-header");
  const toggle = root.querySelector<HTMLButtonElement>(".menu-toggle");
  const menu = root.querySelector<HTMLElement>("#mobile-menu");
  const closeBtn = root.querySelector("[data-close-menu]");

  function setOpen(open: boolean) {
    if (!menu || !toggle) return;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  }

  if (header && header.classList.contains("is-hero")) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    on(window, "scroll", onScroll, { passive: true });
  }

  on(toggle, "click", () => setOpen(Boolean(menu?.hidden)));
  on(closeBtn, "click", () => setOpen(false));
  on(document, "keydown", (event) => {
    if ((event as KeyboardEvent).key === "Escape") setOpen(false);
  });
  menu?.querySelectorAll('a[href^="#"]').forEach((link) => {
    on(link, "click", () => setOpen(false));
  });

  root.querySelectorAll<HTMLElement>("[data-gallery]").forEach((gallery) => {
    const items = [...gallery.querySelectorAll<HTMLElement>(".gallery-item, .diploma-card")];
    const scope = gallery.closest("section") || gallery;
    const filters = scope.querySelectorAll<HTMLElement>("[data-filter]");
    const lightbox =
      gallery.querySelector<HTMLElement>("[data-lightbox]") ||
      scope.querySelector<HTMLElement>("[data-lightbox]");
    const stage = lightbox?.querySelector("img") ?? null;
    const caption = lightbox?.querySelector("[data-lightbox-caption]") ?? null;
    let visible = items;
    let index = 0;

    function show(i: number) {
      visible = items.filter((item) => item.style.display !== "none");
      if (!visible.length) return;
      index = (i + visible.length) % visible.length;
      const item = visible[index];
      const img = item?.querySelector("img");
      if (stage && img) {
        stage.src = img.src;
        stage.alt = img.alt;
      }
      if (caption) caption.textContent = item?.dataset["caption"] || img?.alt || "";
      if (lightbox) lightbox.hidden = false;
    }

    filters.forEach((button) => {
      on(button, "click", () => {
        const value = button.dataset["filter"];
        filters.forEach((el) => el.setAttribute("aria-pressed", String(el === button)));
        items.forEach((item) => {
          item.style.display =
            value === "all" || item.dataset["category"] === value ? "" : "none";
        });
      });
    });

    items.forEach((item, i) => on(item, "click", () => show(i)));
    on(lightbox?.querySelector("[data-lightbox-close]"), "click", () => {
      if (lightbox) lightbox.hidden = true;
    });
    on(lightbox?.querySelector("[data-lightbox-prev]"), "click", () => show(index - 1));
    on(lightbox?.querySelector("[data-lightbox-next]"), "click", () => show(index + 1));
    on(document, "keydown", (event) => {
      const key = (event as KeyboardEvent).key;
      if (!lightbox || lightbox.hidden) return;
      if (key === "Escape") lightbox.hidden = true;
      if (key === "ArrowLeft") show(index - 1);
      if (key === "ArrowRight") show(index + 1);
    });
  });

  const showFilters = root.querySelector<HTMLElement>("[data-show-filters]");
  if (showFilters) {
    const cards = [...root.querySelectorAll<HTMLElement>("[data-show-list] .show-card")];
    const empty = root.querySelector<HTMLElement>("[data-show-empty]");
    const year = showFilters.querySelector<HTMLSelectElement>("[data-filter-year]");
    const country = showFilters.querySelector<HTMLSelectElement>("[data-filter-country]");
    const klass = showFilters.querySelector<HTMLSelectElement>("[data-filter-class]");
    const apply = () => {
      let shown = 0;
      cards.forEach((card) => {
        const okYear = !year || year.value === "all" || card.dataset["year"] === year.value;
        const okCountry =
          !country || country.value === "all" || card.dataset["country"] === country.value;
        const okClass = !klass || klass.value === "all" || card.dataset["class"] === klass.value;
        const ok = okYear && okCountry && okClass;
        card.hidden = !ok;
        if (ok) shown += 1;
      });
      if (empty) empty.hidden = shown > 0;
    };
    [year, country, klass].forEach((el) => on(el, "change", apply));
  }

  const form = root.querySelector<HTMLFormElement>("[data-enquiry-form]");
  if (form) {
    const alertBox = form.querySelector<HTMLElement>("[data-form-alert]");
    const panel = root.querySelector<HTMLElement>("[data-success]");

    on(form, "submit", (event) => {
      event.preventDefault();
      const required = form.dataset["required"] || "Required";
      const invalidEmail = form.dataset["invalidEmail"] || "Invalid email";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let ok = true;
      form.querySelectorAll(".field").forEach((field) => field.classList.remove("is-invalid"));
      const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
      const consentEl = form.querySelector<HTMLInputElement>("[name=consent]");
      const checks: Array<[string, boolean, string]> = [
        ["name", !String(data["name"] || "").trim(), required],
        ["place", !String(data["place"] || "").trim(), required],
        ["email", !String(data["email"] || "").trim(), required],
        [
          "email",
          Boolean(data["email"]) && !emailPattern.test(String(data["email"])),
          invalidEmail,
        ],
        ["preferredContact", !data["preferredContact"], required],
        ["timing", !data["timing"], required],
        ["purpose", !data["purpose"], required],
        ["experience", !data["experience"], required],
        ["whyNorwich", !String(data["whyNorwich"] || "").trim(), required],
        ["consent", !consentEl?.checked, required],
      ];
      checks.forEach(([name, fail, message]) => {
        if (!fail) return;
        ok = false;
        const field = form.querySelector(`[name="${name}"]`)?.closest(".field");
        if (field) {
          field.classList.add("is-invalid");
          const err = field.querySelector(".error");
          if (err) err.textContent = message;
        }
      });
      if (!ok) {
        if (alertBox) alertBox.hidden = false;
        return;
      }
      if (alertBox) alertBox.hidden = true;

      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (button) button.disabled = true;

      void options
        .onSubmit({ ...data, consent: consentEl?.checked ? "1" : "" })
        .then((result) => {
          if (result.ok) {
            form.hidden = true;
            if (panel) panel.hidden = false;
            root.querySelector("#puppy-application")?.scrollIntoView();
            return;
          }
          if (button) button.disabled = false;
          if (alertBox) {
            alertBox.hidden = false;
            alertBox.textContent =
              result.message ||
              form.dataset["sendError"] ||
              "Не удалось отправить. Напишите на contact@norwichterrier.info";
          }
        })
        .catch(() => {
          if (button) button.disabled = false;
          if (alertBox) {
            alertBox.hidden = false;
            alertBox.textContent =
              form.dataset["sendError"] ||
              "Не удалось отправить. Напишите на contact@norwichterrier.info";
          }
        });
    });
  }

  return () => {
    cleanups.forEach((fn) => fn());
    document.body.classList.remove("nav-open");
  };
}
