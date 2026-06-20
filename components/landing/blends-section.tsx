import Image from "next/image";

type Blend = {
  name: string;
  ratio: string;
  price: string;
  image: string;
};

const BLENDS: Blend[] = [
  { name: "卡布奇诺", ratio: "咖啡 50% | 牛奶 50%", price: "¥58", image: "/images/landing/coffee-1.jpg" },
  { name: "拿铁", ratio: "咖啡 50% | 牛奶 50%", price: "¥58", image: "/images/landing/coffee-2.jpg" },
  { name: "玛奇朵", ratio: "咖啡 50% | 牛奶 50%", price: "¥58", image: "/images/landing/coffee-3.jpg" },
  { name: "浓缩咖啡", ratio: "咖啡 50% | 牛奶 50%", price: "¥58", image: "/images/landing/coffee-4.jpg" },
];

export function BlendsSection() {
  return (
    <section className="relative overflow-hidden bg-[#fffefc] py-16 sm:py-24">
      <div className="pointer-events-none absolute -left-[120px] top-1/2 hidden h-[260px] w-[260px] -translate-y-1/2 opacity-50 lg:block">
        <Image src="/images/landing/coffee-blast.png" alt="" fill className="object-contain" />
      </div>
      <div className="pointer-events-none absolute -right-[100px] top-12 hidden h-[260px] w-[260px] opacity-50 lg:block">
        <Image
          src="/images/landing/coffee-blast.png"
          alt=""
          fill
          className="object-contain"
          style={{ transform: "rotate(180deg)" }}
        />
      </div>

      <div className="mx-auto max-w-[1366px] px-6 sm:px-12 lg:px-[93px]">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="font-playfair text-[36px] font-bold leading-tight text-[#603809] sm:text-[48px] md:text-[54px]">
            品味咖啡的多种风格
          </h2>
          <p className="font-playfair mx-auto mt-6 max-w-[760px] text-base leading-[34px] text-[#707070] sm:text-lg md:text-[20px]">
            和我们一起探索咖啡的万千风味，总有一杯值得你细细品味
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BLENDS.map((b) => (
            <article
              key={b.name}
              className="flex h-[364px] flex-col overflow-hidden rounded-[4px] border border-[rgba(249,192,106,0.42)] bg-[#fff9f1]"
            >
              <div className="relative h-[222px] w-full">
                <Image src={b.image} alt={b.name} fill sizes="(max-width: 1024px) 50vw, 280px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col items-center px-4 pt-7 text-center">
                <h3 className="font-playfair text-[22px] font-bold text-[#603809]">
                  {b.name}
                </h3>
                <p className="font-playfair mt-2 text-base text-[#1e1e1e]">
                  {b.ratio}
                </p>
                <p className="font-playfair mt-1 text-[18px] font-bold text-[#603809]">
                  {b.price}
                </p>
                <button
                  type="button"
                  className="font-playfair mt-auto mb-6 inline-flex h-12 w-[134px] items-center justify-center rounded-full bg-[#f9c06a] text-base font-bold text-[#1e1e1e] shadow-[0_6px_12px_0_rgba(249,192,106,0.22)] transition-transform hover:scale-105"
                >
                  立即下单
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}