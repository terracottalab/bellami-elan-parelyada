import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import {
  addSitePhoto,
  deleteSitePhoto,
  getSiteSettings,
  updateSitePhoto,
} from "@/lib/admin.functions";
import { PHOTO_SLOTS } from "@/landing/overrides";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/photos")({
  component: PhotosPage,
});

type Slot = (typeof PHOTO_SLOTS)[number]["slot"];

function PhotosPage() {
  const queryClient = useQueryClient();
  const fetchSettings = useServerFn(getSiteSettings);
  const addPhoto = useServerFn(addSitePhoto);
  const patchPhoto = useServerFn(updateSitePhoto);
  const removePhoto = useServerFn(deleteSitePhoto);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "site"],
    queryFn: () => fetchSettings(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "site"] });

  const remove = useMutation({
    mutationFn: (id: string) => removePhoto({ data: { id } }),
    onSuccess: () => void invalidate(),
  });
  const patch = useMutation({
    mutationFn: (input: { id: string; caption?: string; sort_order?: number }) =>
      patchPhoto({ data: input }),
    onSuccess: () => void invalidate(),
  });

  async function upload(slot: Slot, file: File, replace: boolean) {
    setBusy(slot);
    setMessage(null);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${slot}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw new Error(uploadError.message);
      await addPhoto({
        data: {
          slot,
          url: `/api/public/media/${path}`,
          caption: file.name.replace(/\.[^.]+$/, "").slice(0, 200),
          replace,
        },
      });
      await invalidate();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Загружаем…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;

  const photos = data?.photos ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Фотографии сайта</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Пока фото не загружено, на сайте остаётся нынешний снимок.
        </p>
        {message ? <p className="mt-2 text-sm text-destructive">{message}</p> : null}
      </div>

      {PHOTO_SLOTS.map((slot) => {
        const list = photos
          .filter((photo) => photo.slot === slot.slot)
          .sort((a, b) => a.sort_order - b.sort_order);
        return (
          <section key={slot.slot} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-base font-semibold text-foreground">{slot.label}</h2>
              <label className="ml-auto cursor-pointer rounded-md border border-input px-3 py-1.5 text-sm">
                {busy === slot.slot
                  ? "Загружаем…"
                  : slot.multiple
                    ? "Добавить фото"
                    : "Заменить фото"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) void upload(slot.slot, file, !slot.multiple);
                  }}
                />
              </label>
            </div>

            {list.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">Используется исходное фото сайта.</p>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((photo, index) => (
                  <li key={photo.id} className="space-y-2 rounded-lg border border-border p-3">
                    <img
                      src={photo.url}
                      alt={photo.alt ?? ""}
                      className="h-40 w-full rounded-md object-cover"
                    />
                    <input
                      defaultValue={photo.caption ?? ""}
                      placeholder="Подпись"
                      onBlur={(e) =>
                        e.target.value !== (photo.caption ?? "") &&
                        patch.mutate({ id: photo.id, caption: e.target.value })
                      }
                      className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                    />
                    <div className="flex items-center gap-2 text-sm">
                      {slot.multiple ? (
                        <>
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => {
                              const prev = list[index - 1];
                              if (!prev) return;
                              patch.mutate({ id: photo.id, sort_order: prev.sort_order });
                              patch.mutate({ id: prev.id, sort_order: photo.sort_order });
                            }}
                            className="rounded-md border border-input px-2 py-1 disabled:opacity-40"
                          >
                            Выше
                          </button>
                          <button
                            type="button"
                            disabled={index === list.length - 1}
                            onClick={() => {
                              const next = list[index + 1];
                              if (!next) return;
                              patch.mutate({ id: photo.id, sort_order: next.sort_order });
                              patch.mutate({ id: next.id, sort_order: photo.sort_order });
                            }}
                            className="rounded-md border border-input px-2 py-1 disabled:opacity-40"
                          >
                            Ниже
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => remove.mutate(photo.id)}
                        className="ml-auto text-destructive hover:underline"
                      >
                        Удалить
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
