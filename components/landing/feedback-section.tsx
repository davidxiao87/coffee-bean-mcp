import Image from "next/image";

export function FeedbackSection() {
  return (
    <section className="relative overflow-hidden bg-[#603809] py-16 sm:py-24">
      <Image
        src="/images/landing/subscribe-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="relative z-10 mx-auto max-w-[1366px] px-6 sm:px-12 lg:px-[93px]">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="font-playfair text-[36px] font-bold leading-tight text-[#603809] sm:text-[48px] md:text-[54px]">
            来自顾客的真实评价
          </h2>
          <p className="font-playfair mx-auto mt-6 max-w-[760px] text-base leading-[34px] text-[#603809]/80 sm:text-lg md:text-[20px]">
            我们的顾客对我们的咖啡赞不绝口
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-[980px] border border-[rgba(249,192,106,0.42)] bg-[#fff9f1] px-6 pb-10 pt-20 sm:px-10 sm:pb-14 sm:pt-24">
          <p className="font-playfair mx-auto max-w-[780px] text-center text-base leading-[36px] text-[#707070] sm:text-lg md:text-[18px]">
            自从第一次来到豆映咖啡，我就被这里的咖啡香气深深吸引。每一杯咖啡都能感受到咖啡师用心调配的温度。无论是清晨的唤醒，还是午后的小憩，这里都是我最爱的去处。朋友聚会、独自办公，我都会选择这里——它已经成为我生活里不可或缺的一部分。
          </p>
        </div>
      </div>
    </section>
  );
}