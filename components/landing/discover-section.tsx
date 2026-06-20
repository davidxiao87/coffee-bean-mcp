import Image from "next/image";

export function DiscoverSection() {
  return (
    <section className="relative overflow-hidden bg-[#fffefc] py-20 sm:py-28 lg:py-32">
      <div className="mx-auto grid max-w-[1366px] grid-cols-1 items-center gap-12 px-6 sm:px-12 lg:grid-cols-2 lg:px-[93px]">
        <div className="relative z-10 max-w-[585px]">
          <h2 className="font-playfair text-[40px] font-bold leading-tight text-[#603809] sm:text-[48px] md:text-[54px]">
            邂逅一杯最好的咖啡
          </h2>
          <p className="font-playfair mt-8 text-base leading-[34px] text-[#707070] sm:text-lg md:text-[20px]">
            豆映咖啡致力于为你提供高品质的咖啡，让你在繁忙的工作之余，唤醒一天的活力。喝一杯咖啡是好的，但喝一杯真正的好咖啡，是更棒的体验。我们相信，这里的咖啡一定会让你爱不释口。
          </p>
          <button
            type="button"
            className="font-playfair mt-10 inline-flex h-12 w-[134px] items-center justify-center rounded-full bg-[#f9c06a] text-base font-bold text-[#1e1e1e] shadow-[0_6px_12px_0_rgba(249,192,106,0.22)] transition-transform hover:scale-105"
          >
            了解更多
          </button>
        </div>

        <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
          <Image
            src="/images/landing/cup-flatlay.png"
            alt="咖啡杯与咖啡豆"
            width={680}
            height={476}
            className="relative z-10 mix-blend-multiply"
          />
          <div className="absolute -left-10 top-1/2 -z-0 h-[260px] w-[260px] -translate-y-1/2 opacity-60">
            <Image
              src="/images/landing/coffee-blast.png"
              alt=""
              fill
              className="object-contain"
              style={{ transform: "scaleY(-1)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}