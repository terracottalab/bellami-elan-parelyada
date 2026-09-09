import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { getSiteSettings, saveSiteContent } from "@/lib/admin.functions";
import { CONTENT_FIELDS } from "@/landing/overrides";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentPage,
});

type Values = Record<string, string>;

function ContentPage() {
  const queryClient = useQueryClient();
  const fetchSettings = useServerFn(getSiteSettings);
  const save = useServerFn(saveSiteContent);
  const [locale, setLocale] = useState<"ru" | "en">("ru");
  const [values, setValues] = useState<{ ru: Values; en: Values }>({ ru: {}, en: {} });
  const [saved, setSaved] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "site"],
    queryFn: () => fetchSettings(),
  });

  useEffect(() => {
    if (!data) return;
    const next: { ru: Values; en: Values } = { ru: {}, en: {} };
    data.content.forEach((row) => {
      if (row.locale === "en") next.en[row.key] = row.value;
      else next.ru[row.key] = row.value;
    });
    setValues(next);
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          items: (["ru", "en"] as const).flatMap((loc) =>
            CONTENT_FIELDS.map((field) => ({
              locale: loc,
              key: field.key,
              value: values[loc][field.key] ?? "",
            })),
          ),
        },
      }),
    onSuccess: () => {
      setSaved(true);
      void queryClient.invalidateQueries({ queryKey: ["admin", "site"] });
      setTimeout(() => setSaved(false), 2500);
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Загружаем…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Тексты сайта</h1>
        <div className="flex gap-1 rounded-md border border-input p-1 text-sm">
          {(["ru", "en"] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocale(loc)}
              className={`rounded px-3 py-1 ${
                locale === loc ? "bg-accent text-accent-foreground" : "text-muted-foreground"
              }`}
            >
              {loc === "ru" ? "Русский" : "English"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="ml-auto rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60"
        >
          Сохранить
        </button>
        {saved ? <span className="text-sm text-muted-foreground">Сохранено</span> : null}
      </div>

      <p className="text-sm text-muted-foreground">
        Пустое поле означает, что на сайте останется текущий текст.
      </p>

      <div className="space-y-4">
        {CONTENT_FIELDS.map((field) => (
          <label key={field.key} className="block space-y-1 text-sm">
            <span className="text-muted-foreground">{field.label}</span>
            {"multiline" in field && field.multiline ? (
              <textarea
                rows={6}
                value={values[locale][field.key] ?? ""}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [locale]: { ...values[locale], [field.key]: e.target.value },
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            ) : (
              <input
                value={values[locale][field.key] ?? ""}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [locale]: { ...values[locale], [field.key]: e.target.value },
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
