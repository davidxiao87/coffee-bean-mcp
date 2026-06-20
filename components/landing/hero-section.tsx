import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative isolate h-[600px] w-full overflow-hidden sm:h-[720px] lg:h-[768px]">
      <Image
        src="/images/landing/coffee-bg.jpg"
        alt="咖啡背景"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(89.6773deg, rgb(30,30,30) 6.8798%, rgba(0,0,0,0) 87.445%)",
        }}
      />

      <div className="relative z-10 mx-auto flex h-full max-w-[1366px] flex-col justify-center px-6 text-white sm:px-12 lg:px-[93px]">
        <p className="font-clicker text-2xl leading-none sm:text-3xl md:text-[40px]">
          Bean Scene
        </p>

        <p className="font-playfair mt-4 text-base font-medium sm:text-lg md:text-[22px]">
          用一杯好咖啡，开启你美好的早晨
        </p>

        <h1 className="font-playfair mt-4 text-[44px] font-bold leading-[1.1] tracking-tight sm:text-[64px] md:text-[88px]">
          咖啡时光
        </h1>

        <p className="font-playfair mt-6 max-w-[520px] text-base leading-[34px] text-white/90 sm:text-lg md:text-[20px]">
          美好的一天，从一杯咖啡开始。我们精心挑选每一颗咖啡豆，只为给你带来最纯粹的风味体验，让你爱上每一口回甘。
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
          <button
            type="button"
            className="font-playfair inline-flex h-12 w-[134px] items-center justify-center rounded-full bg-[#f9c06a] text-base font-bold text-[#1e1e1e] shadow-[0_6px_12px_0_rgba(249,192,106,0.22)] transition-transform hover:scale-105"
          >
            立即下单
          </button>
          <button
            type="button"
            className="font-playfair inline-flex h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 text-base font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            了解更多 →
          </button>
        </div>
      </div>
    </section>
  );
}