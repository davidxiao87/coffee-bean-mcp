import Image from "next/image";

export function CtaSection() {
  return (
    <section className="relative isolate h-[460px] w-full overflow-hidden sm:h-[520px] lg:h-[574px]">
      <Image
        src="/images/landing/subscribe-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#603809] opacity-80" />

      <div className="relative z-10 mx-auto grid h-full max-w-[1366px] grid-cols-1 items-center gap-8 px-6 text-white sm:px-12 lg:grid-cols-2 lg:px-[93px]">
        <div className="max-w-[560px]">
          <h2 className="font-playfair text-[36px] font-bold leading-tight sm:text-[46px] md:text-[54px]">
            开启属于你的
            <br />
            美好清晨
          </h2>
          <p className="font-playfair mt-6 text-base leading-[34px] sm:text-lg md:text-[20px]">
            我们为你准备了一次难得的机会，让咖啡带你遇见更好的生活。
          </p>
          <button
            type="button"
            className="font-playfair mt-10 inline-flex h-12 w-[134px] items-center justify-center rounded-full bg-[#f9c06a] text-base font-bold text-[#1e1e1e] shadow-[0_6px_12px_0_rgba(249,192,106,0.22)] transition-transform hover:scale-105"
          >
            立即下单
          </button>
        </div>

        <div className="relative mx-auto hidden h-[460px] w-full max-w-[500px] lg:block">
          <div className="absolute right-0 top-1/2 h-[440px] w-[440px] -translate-y-1/2">
            <Image src="/images/landing/bean-spread.png" alt="" fill className="object-contain" />
          </div>
          <div className="absolute right-12 top-1/2 h-[300px] w-[300px] -translate-y-1/2 shadow-[0_10px_12px_0_rgba(0,0,0,0.34)]">
            <Image src="/images/landing/cup-hero.png" alt="" fill className="object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}