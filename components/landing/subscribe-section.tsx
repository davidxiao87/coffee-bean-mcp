export function SubscribeSection() {
  return (
    <section className="relative overflow-hidden bg-[#603809] py-16 text-white sm:py-24">
      <div className="mx-auto max-w-[1366px] px-6 text-center sm:px-12 lg:px-[93px]">
        <h2 className="font-playfair text-[32px] font-bold leading-tight sm:text-[44px] md:text-[54px]">
          订阅获取最新资讯
        </h2>
        <p className="font-playfair mx-auto mt-6 max-w-[760px] text-base leading-[34px] sm:text-lg md:text-[20px]">
          不要错过我们的最新消息、咖啡技巧和专属优惠
        </p>

        <form className="mx-auto mt-10 flex max-w-[780px] flex-col items-stretch gap-0 sm:flex-row">
          <input
            type="email"
            placeholder="请输入你的邮箱"
            className="font-playfair h-[66px] flex-1 rounded-[4px] border border-[rgba(249,192,106,0.42)] bg-[#fff9f1] px-6 text-base text-[rgba(0,0,0,0.34)] placeholder:text-[rgba(0,0,0,0.34)] focus:outline-none sm:rounded-r-none"
          />
          <button
            type="submit"
            className="font-playfair h-[66px] w-full shrink-0 rounded-[4px] bg-[#f9c06a] text-[22px] font-bold text-[#603809] shadow-[0_6px_12px_0_rgba(249,192,106,0.22)] transition-transform hover:scale-[1.02] sm:w-[137px] sm:rounded-l-none"
          >
            订阅
          </button>
        </form>
      </div>
    </section>
  );
}