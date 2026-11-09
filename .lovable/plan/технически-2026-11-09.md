Добавить список титулов Пари под строкой «Юный интернациональный чемпион красоты FCI (C.I.B.-J)» на первом экране — в русской и английской версиях.

Текст (одинаковый для RU/EN, через точку-разделитель):
CH.SchWZ · CH.SVN · JGrCH.RUS · JCH.RKF · JCH.INT · JCH.RUS · BJCH.RUS · CISJ Winner · RUS BJW · JSHCH RUS · JSHCH RG · JCH GRGP · JCH.HCC · GJCH.ARM · JCH.ARM · JCH.BLR · JCH.HRV · RKF BW · BYJW

Вид: мелкая строка в стиле подписи (как у титулов родителей), переносится по словам на телефоне, не ломает первый экран.

## Технически
- `src/landing/content.ru.ts` и `content.en.ts`: после `<p class="hero-rank">` добавить `<p class="caption hero-titles">…</p>`.
- `src/landing/landing.css`: небольшой стиль `.hero-titles` (отступ, межстрочный интервал), scoped под `.landing`.
- Проверить desktop/mobile скриншотом.
