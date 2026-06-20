import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const beanId = url.searchParams.get("bean_id");

  if (!beanId) {
    return NextResponse.json(
      { error: "请通过查询参数提供 bean_id。" },
      { status: 400 },
    );
  }

  if (!isUuid(beanId)) {
    return NextResponse.json(
      { error: "bean_id 格式不合法，请使用 UUID。" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "请先登录后再查询点赞状态。" },
        { status: 401 },
      );
    }

    const userId = userData.user.id;

    const serviceClient = createServiceRoleClient();
    const { data, error } = await serviceClient
      .from("likes")
      .select("id, created_at")
      .eq("user_id", userId)
      .eq("bean_id", beanId)
      .maybeSingle();

    if (error) {
      console.error("[GET /api/likes/mine] Supabase error:", error);
      return NextResponse.json(
        { error: "查询点赞状态失败，请稍后再试。" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      data: {
        bean_id: beanId,
        liked: Boolean(data),
        liked_at: data?.created_at ?? null,
      },
    });
  } catch (error) {
    console.error("[GET /api/likes/mine] Unexpected error:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}