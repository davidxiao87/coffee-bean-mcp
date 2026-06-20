import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const NAME_MAX = 80;
const FLAVOR_MAX = 500;
const ORIGIN_MAX = 80;
const IMAGE_URL_MAX = 2048;
const TAG_MAX_LEN = 30;
const TAG_MAX_COUNT = 10;

type CreateBeanBody = {
  name?: unknown;
  flavor_profile?: unknown;
  origin?: unknown;
  tags?: unknown;
  image_url?: unknown;
};

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function normalizeTags(input: unknown): string[] | null {
  if (input == null) return null;
  if (!Array.isArray(input)) return null;
  const cleaned = input
    .map((t) => (typeof t === "string" ? t.trim() : ""))
    .filter((t) => t.length > 0);
  if (cleaned.length === 0) return null;
  return Array.from(new Set(cleaned));
}

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("beans")
      .select(
        "id, name, flavor_profile, origin, tags, image_url, created_at",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET /api/beans] Supabase error:", error);
      return NextResponse.json(
        { error: "获取咖啡豆数据失败，请稍后再试。" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("[GET /api/beans] Unexpected error:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: CreateBeanBody;
  try {
    body = (await request.json()) as CreateBeanBody;
  } catch {
    return NextResponse.json(
      { error: "请求体不是合法的 JSON。" },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "请求体格式不正确。" },
      { status: 400 },
    );
  }

  const name = isString(body.name) ? body.name.trim() : "";
  const flavor_profile = isString(body.flavor_profile)
    ? body.flavor_profile.trim()
    : "";
  const origin = isString(body.origin) ? body.origin.trim() : "";
  const image_url = isString(body.image_url) ? body.image_url.trim() : "";
  const tags = normalizeTags(body.tags);

  const fieldErrors: Record<string, string> = {};

  if (!name) fieldErrors.name = "请填写咖啡名称";
  else if (name.length > NAME_MAX) fieldErrors.name = `咖啡名称不能超过 ${NAME_MAX} 个字符`;

  if (!flavor_profile) fieldErrors.flavor_profile = "请填写口味描述";
  else if (flavor_profile.length > FLAVOR_MAX)
    fieldErrors.flavor_profile = `口味描述不能超过 ${FLAVOR_MAX} 个字符`;

  if (!origin) fieldErrors.origin = "请填写产地";
  else if (origin.length > ORIGIN_MAX) fieldErrors.origin = `产地不能超过 ${ORIGIN_MAX} 个字符`;

  if (!image_url) fieldErrors.image_url = "请填写图片 URL";
  else if (image_url.length > IMAGE_URL_MAX)
    fieldErrors.image_url = `图片 URL 不能超过 ${IMAGE_URL_MAX} 个字符`;
  else {
    try {
      const parsed = new URL(image_url);
      if (!/^https?:$/.test(parsed.protocol)) {
        fieldErrors.image_url = "图片 URL 必须以 http:// 或 https:// 开头";
      }
    } catch {
      fieldErrors.image_url = "请填写合法的图片 URL";
    }
  }

  if (tags == null) {
    fieldErrors.tags = "请至少添加一个标签";
  } else if (tags.length > TAG_MAX_COUNT) {
    fieldErrors.tags = `标签最多 ${TAG_MAX_COUNT} 个`;
  } else if (tags.some((t) => t.length > TAG_MAX_LEN)) {
    fieldErrors.tags = `每个标签不能超过 ${TAG_MAX_LEN} 个字符`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "提交内容不完整或不合法，请检查后重试。", fieldErrors },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "请先登录后再添加咖啡豆。" },
        { status: 401 },
      );
    }

    const serviceClient = createServiceRoleClient();
    const { data, error } = await serviceClient
      .from("beans")
      .insert({
        name,
        flavor_profile,
        origin,
        tags: tags ?? [],
        image_url,
      })
      .select(
        "id, name, flavor_profile, origin, tags, image_url, created_at",
      )
      .single();

    if (error) {
      console.error("[POST /api/beans] Supabase error:", error);
      return NextResponse.json(
        { error: "保存咖啡豆失败，请稍后再试。" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/beans] Unexpected error:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}