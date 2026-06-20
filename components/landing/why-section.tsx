import Image from "next/image";

type Reason = {
  title: string;
  desc: string;
  icon: string;
  highlight?: boolean;
};

const REASONS: Reason[] = [
  { title: "优质咖啡豆", desc: "精选优质咖啡豆，香气浓郁", icon: "/images/landing/beans-icon.png", highlight: true },
  { title: "高品质保障", desc: "严格品控，品质始终如一", icon: "/images/landing/badge-icon.png" },
  { title: "非凡口感", desc: "从未体验过的咖啡风味", icon: "/images/landing/cup-icon.png" },
  { title: "价格实惠", desc: "好咖啡，不必花大价钱", icon: "/images/landing/price-icon.png" },
];

export function WhySection() {
  return (
    <section className="relative overflow-hidden bg-[#fffefc] py-16 sm:py-24">
      <div className="mx-auto max-w-[1366px] px-6 sm:px-12 lg:px-[93px]">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="font-playfair text-[36px] font-bold leading-tight text-[#603809] sm:text-[48px] md:text-[54px]">
            我们有何不同？
          </h2>
          <p className="font-playfair mx-auto mt-6 max-w-[760px] text-base leading-[34px] text-[#707070] sm:text-lg md:text-[20px]">
            我们做的不仅是咖啡，更是为你点亮一整天的美好心情！
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r) => (
            <article
              key={r.title}
              className={`flex h-[284px] flex-col items-center px-6 pt-12 text-center ${
                r.highlight ? "bg-[#ffeed8]" : "border border-[rgba(249,192,106,0.42)] bg-[#fff9f1]"
              }`}
            >
              <div className="relative size-[88px]">
                <Image src={r.icon} alt="" fill className="object-contain" />
              </div>
              <h3 className="font-playfair mt-6 text-[24px] font-bold text-[#603809] sm:text-[28px]">
                {r.title}
              </h3>
              <p className="font-playfair mt-3 text-base leading-[28px] text-[#707070] sm:text-[20px]">
                {r.desc}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="font-playfair mx-auto max-w-[760px] text-base leading-[34px] text-[#707070] sm:text-lg md:text-[20px]">
            美好的灵感，从一杯好咖啡开始，让我们助你开启每一天
          </p>
          <p className="font-playfair mt-3 text-[26px] font-bold text-[#603809] sm:text-[30px]">
            今天就开始体验吧。
          </p>
          <button
            type="button"
            className="font-playfair mt-8 inline-flex h-12 w-[134px] items-center justify-center rounded-full bg-[#f9c06a] text-base font-bold text-[#1e1e1e] shadow-[0_6px_12px_0_rgba(249,192,106,0.22)] transition-transform hover:scale-105"
          >
            加入我们
          </button>
        </div>
      </div>
    </section>
  );
}