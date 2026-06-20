import { Suspense } from "react";

import { TweetCard, TweetSkeleton } from "@/components/ui/tweet-card";

const TWEET_IDS = [
  "1976382199965602022",
  "1976437762950824362",
  "914134197413072898",
] as const;

export function CommunitySection() {
  return (
    <section
      id="community"
      className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12"
    >
      <header className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-sm uppercase tracking-[0.3em] text-[#B07A3B]">
          社区热议
        </span>
        <h2 className="text-3xl font-semibold text-[#5C3A12] sm:text-4xl">
          来自咖啡爱好者的真实分享
        </h2>
        <p className="max-w-2xl text-base text-[#6D5335] sm:text-lg">
          来自 X / Twitter 的最新热议，一起看看大家都在聊什么咖啡话题。
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {TWEET_IDS.map((id) => (
          <Suspense
            key={id}
            fallback={
              <TweetSkeleton className="border-[#F0D7B7] bg-[#FFF9F1]" />
            }
          >
            <TweetCard
              id={id}
              className="border-[#F0D7B7] bg-[#FFF9F1] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            />
          </Suspense>
        ))}
      </div>
    </section>
  );
}