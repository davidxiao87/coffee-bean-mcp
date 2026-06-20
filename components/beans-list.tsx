"use client";

import { useEffect, useMemo, useState } from "react";

import { BeanCard } from "@/components/beans/bean-card";

type Bean = {
  id: string;
  name: string;
  flavor_profile: string;
  origin: string;
  tags: string[] | null;
  image_url: string;
};

type LoadingState = "idle" | "loading" | "success" | "error";

async function fetchLikedBeanIds(beanIds: string[]): Promise<Set<string>> {
  if (beanIds.length === 0) return new Set();

  const results = await Promise.all(
    beanIds.map(async (id) => {
      try {
        const res = await fetch(
          `/api/likes/mine?bean_id=${encodeURIComponent(id)}`,
          { method: "GET" },
        );
        if (!res.ok) return null;
        const body = (await res.json()) as { data?: { liked?: boolean } };
        return { id, liked: Boolean(body.data?.liked) };
      } catch {
        return null;
      }
    }),
  );

  return new Set(
    results
      .filter((r): r is { id: string; liked: boolean } => r != null && r.liked)
      .map((r) => r.id),
  );
}

export function BeansList({ refreshKey }: { refreshKey?: number } = {}) {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<LoadingState>("idle");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBeans() {
      try {
        setState("loading");
        const response = await fetch("/api/beans", {
          signal: controller.signal,
        });

        const contentType = response.headers.get("content-type") ?? "";
        const isJson = contentType.includes("application/json");

        if (!response.ok || !isJson) {
          const fallbackMessage = "获取咖啡豆数据失败，请稍后再试。";
          if (isJson) {
            const body = (await response.json()) as { error?: string };
            throw new Error(body.error ?? fallbackMessage);
          }
          throw new Error(fallbackMessage);
        }

        const body = (await response.json()) as { data?: Bean[] };
        const list = body.data ?? [];
        setBeans(list);
        setError(null);
        setState("success");

        if (!controller.signal.aborted) {
          const ids = await fetchLikedBeanIds(list.map((b) => b.id));
          if (!controller.signal.aborted) {
            setLikedIds(ids);
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("[BeansList] fetch error", err);
        setError(
          err instanceof Error
            ? err.message
            : "加载咖啡豆数据时出现问题，请稍后重试。",
        );
        setBeans([]);
        setState("error");
      }
    }

    void loadBeans();

    return () => controller.abort();
  }, [refreshKey]);

  const isLoading = state === "loading" || state === "idle";
  const isError = state === "error";
  const hasBeans = beans.length > 0;

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex animate-pulse flex-col gap-6 rounded-3xl border border-[#F0D7B7] bg-[#FFF9F1]/70 p-6 sm:flex-row"
            >
              <div className="h-48 w-full rounded-2xl bg-[#F3DCC0] sm:h-40 sm:w-40" />
              <div className="flex flex-1 flex-col gap-4">
                <div className="h-6 w-1/2 rounded bg-[#F0D7B7]" />
                <div className="h-4 w-full rounded bg-[#F0D7B7]" />
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 rounded-full bg-[#F0D7B7]" />
                  <div className="h-6 w-12 rounded-full bg-[#F0D7B7]" />
                  <div className="h-6 w-14 rounded-full bg-[#F0D7B7]" />
                </div>
                <div className="mt-auto h-10 w-32 rounded-2xl bg-[#F0D7B7]" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="rounded-2xl border border-[#E8CFAF] bg-[#FFF2E0] px-6 py-10 text-center text-[#8A5A28] shadow-sm">
          {error ?? "加载咖啡豆数据时出现问题，请稍后重试。"}
        </div>
      );
    }

    if (!hasBeans) {
      return (
        <div className="rounded-2xl border border-dashed border-[#E5C99F] bg-[#FFF5E8] px-6 py-14 text-center text-[#8A5A28]">
          暂无咖啡豆数据
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {beans.map((bean) => (
          <BeanCard
            key={bean.id}
            bean={bean}
            initiallyLiked={likedIds.has(bean.id)}
          />
        ))}
      </div>
    );
  }, [beans, error, hasBeans, isError, isLoading, likedIds]);

  return content;
}
