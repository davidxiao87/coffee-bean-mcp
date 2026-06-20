import { Facebook, MessageCircle, BookOpen, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const COMPANY = ["服务流程", "服务条款", "价格说明", "常见问题"];
const ABOUT = ["菜单", "特色推荐", "新闻博客", "帮助支持"];

const SOCIALS = [
  { Icon: Facebook, label: "微博", hover: "hover:bg-[#E6162D] hover:border-[#E6162D]" },
  { Icon: MessageCircle, label: "微信", hover: "hover:bg-[#07C160] hover:border-[#07C160]" },
  { Icon: BookOpen, label: "小红书", hover: "hover:bg-[#FF2442] hover:border-[#FF2442]" },
  { Icon: Music2, label: "抖音", hover: "hover:bg-[#000000] hover:border-white" },
];

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#442808] text-white">
      <Image
        src="/images/landing/footer-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover opacity-80 mix-blend-overlay"
      />
      <div className="relative z-10 mx-auto max-w-[1366px] px-6 py-16 sm:px-12 lg:px-[93px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block leading-tight">
              <span className="font-playfair block text-2xl font-bold sm:text-[28px]">
                豆映咖啡
              </span>
              <span className="font-clicker mt-1 block text-xl text-[#f9c06a] sm:text-[24px]">
                Bean Scene
              </span>
            </Link>
            <p className="font-playfair mt-6 max-w-[380px] text-sm leading-[22px] text-white/85">
              豆映咖啡致力于为你提供高品质的手工调制咖啡，每一颗豆子都经过精心挑选，每一杯都倾注咖啡师的心血。让咖啡融入生活，让生活充满香气。
            </p>
            <div className="mt-8 flex items-center gap-3">
              {SOCIALS.map(({ Icon, label, hover }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  title={label}
                  className={`group flex size-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition-all duration-200 hover:scale-110 hover:text-white hover:shadow-lg ${hover}`}
                >
                  <Icon className="size-5 transition-transform group-hover:scale-110" strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-[24px] font-bold sm:text-[26px]">关于我们</h3>
            <ul className="font-playfair mt-8 space-y-3 text-[18px] text-white/90">
              {ABOUT.map((a) => (
                <li key={a}>
                  <Link href="#" className="hover:underline">{a}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-[24px] font-bold sm:text-[26px]">公司</h3>
            <ul className="font-playfair mt-8 space-y-3 text-[18px] text-white/90">
              {COMPANY.map((c) => (
                <li key={c}>
                  <Link href="#" className="hover:underline">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-playfair text-[24px] font-bold sm:text-[26px]">联系我们</h3>
            <div className="font-playfair mt-8 space-y-3 text-[18px] text-white/90">
              <p>
                上海市黄浦区南京东路 100 号咖啡大厦 8 层
              </p>
              <p>+86 21-8888-8888</p>
              <p>hello@douyingcoffee.com</p>
              <p>www.douyingcoffee.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-center text-sm text-white/70">
          © {new Date().getFullYear()} 豆映咖啡. 保留所有权利.
        </div>
      </div>
    </footer>
  );
}