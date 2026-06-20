import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

const NAV_LINKS = [
  { label: "首页", href: "/" },
  { label: "咖啡豆", href: "/beans" },
  { label: "关于我们", href: "#about" },
  { label: "联系我们", href: "#contact" },
];

export async function LandingNav() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1366px] items-center justify-between px-6 py-6 text-white sm:px-12 lg:px-[93px]">
        <Link
          href="/"
          className="font-playfair inline-block text-xl font-bold leading-none sm:text-[22px]"
        >
          豆映咖啡
          <span className="font-clicker ml-1 text-lg text-[#f9c06a] sm:text-[22px]">
            Bean Scene
          </span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-playfair transition-opacity hover:opacity-80"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          {user ? (
            <Link
              href="/beans"
              className="font-playfair text-sm font-medium underline underline-offset-4"
            >
              我的账户
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="font-playfair text-sm font-medium underline underline-offset-4"
            >
              登录
            </Link>
          )}
          <Link
            href={user ? "/beans" : "/auth/sign-up"}
            className="font-playfair inline-flex h-12 w-[100px] items-center justify-center rounded-full bg-[#f9c06a] text-sm font-semibold text-[#1e1e1e] shadow-[0_6px_12px_0_rgba(249,192,106,0.22)] transition-transform hover:scale-105"
          >
            注册
          </Link>
        </div>
      </div>
    </header>
  );
}