"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Bean = {
  id: string;
  name: string;
  flavor_profile: string;
  origin: string;
  tags: string[] | null;
  image_url: string;
};

type LikeStatus = "idle" | "liked" | "unliked" | "loading" | "error";

async function parseError(
  response: Response,
  fallback: string,
): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) return body.error;
    } catch {
      // fall through
    }
  }
  return fallback;
}

type BeanCardProps = {
  bean: Bean;
  initiallyLiked: boolean;
};

export function BeanCard({ bean, initiallyLiked }: BeanCardProps) {
  const [liked, setLiked] = useState(initiallyLiked);
  const [status, setStatus] = useState<LikeStatus>(initiallyLiked ? "liked" : "unliked");
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    setLiked(initiallyLiked);
    setStatus(initiallyLiked ? "liked" : "unliked");
    setError(null);
  }, [bean.id, initiallyLiked]);

  async function handleToggle() {
    if (status === "loading") return;

    const nextLiked = !liked;
    setLiked(nextLiked);
    setStatus("loading");
    setError(null);
    setNeedsLogin(false);

    try {
      const response = nextLiked
        ? await fetch("/api/likes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bean_id: bean.id }),
          })
        : await fetch(`/api/likes?bean_id=${encodeURIComponent(bean.id)}`, {
            method: "DELETE",
          });

      if (response.status === 401) {
        setLiked(!nextLiked);
        setStatus("unliked");
        setNeedsLogin(true);
        return;
      }

      if (!response.ok) {
        const message = await parseError(
          response,
          nextLiked ? "点赞失败，请稍后再试。" : "取消点赞失败，请稍后再试。",
        );
        setLiked(!nextLiked);
        setStatus("error");
        setError(message);
        return;
      }

      setStatus(nextLiked ? "liked" : "unliked");
    } catch (err) {
      console.error("[BeanCard] like toggle error", err);
      setLiked(!nextLiked);
      setStatus("error");
      setError("网络异常，请稍后重试。");
    }
  }

  const isLiked = liked;
  const isLoading = status === "loading";
  const buttonLabel = isLiked ? "取消喜欢" : "喜欢这杯咖啡豆";

  return (
    <article className="group relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-[#F0D7B7] bg-[#FFF9F1] p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:flex-row">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={handleToggle}
        disabled={isLoading}
        aria-pressed={isLiked}
        aria-label={isLiked ? `取消喜欢 ${bean.name}` : `喜欢 ${bean.name}`}
        title={buttonLabel}
        className={`absolute right-4 top-4 z-10 size-10 rounded-full border transition-all ${
          isLiked
            ? "border-[#E2A07A] bg-[#FFE7D6] text-[#B85B2C] hover:bg-[#FFD7BD]"
            : "border-[#E5C99F] bg-white/80 text-[#A46A2E] hover:bg-white"
        } ${isLoading ? "cursor-wait opacity-70" : ""}`}
      >
        <Heart
          className={`size-5 transition-transform ${
            isLiked ? "scale-110 fill-current" : ""
          } ${isLoading ? "animate-pulse" : ""}`}
        />
      </Button>

      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-[#F3DCC0] sm:h-40 sm:w-40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bean.image_url}
          alt={`${bean.name} 咖啡豆`}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 pr-12 sm:pr-14">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-[#5C3A12]">{bean.name}</h2>
          <p className="text-sm leading-relaxed text-[#7C6040]">
            {bean.flavor_profile}
          </p>
        </div>

        {bean.tags && bean.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {bean.tags.map((tag) => (
              <Badge
                key={tag}
                className="rounded-full bg-[#F5DABD] px-3 py-1 text-xs font-medium text-[#6C451A] hover:bg-[#EAC9A4]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-1">
          <div className="flex items-center gap-4 rounded-2xl bg-[#FDF3E3] px-4 py-3 text-sm text-[#7C5530]">
            <span className="font-medium text-[#A46A2E]">产地</span>
            <span className="font-semibold text-[#5C3A12]">{bean.origin}</span>
          </div>

          {needsLogin ? (
            <p
              className="px-1 text-xs text-[#B85B2C]"
              role="status"
              aria-live="polite"
            >
              请先登录后再为咖啡豆点赞。
            </p>
          ) : error ? (
            <p
              className="px-1 text-xs text-red-500"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
