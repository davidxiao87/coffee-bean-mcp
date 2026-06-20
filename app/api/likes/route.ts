import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

type LikeBody = {
  bean_id?: unknown;
};

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function parseBeanIdFromRequest(request: Request): {
  beanId: string | null;
  errorResponse: NextResponse | null;
} {
  const url = new URL(request.url);
  const queryId = url.searchParams.get("bean_id");
  if (isString(queryId) && queryId.trim().length > 0) {
    return { beanId: queryId.trim(), errorResponse: null };
  }
  return { beanId: null, errorResponse: null };
}

async function readBeanIdFromBody(request: Request): Promise<{
  beanId: string | null;
  errorResponse: NextResponse | null;
}> {
  let body: LikeBody;
  try {
    body = (await request.json()) as LikeBody;
  } catch {
    return {
      beanId: null,
      errorResponse: NextResponse.json(
        { error: "请求体不是合法的 JSON。" },
        { status: 400 },
      ),
    };
  }

  if (!body || typeof body !== "object") {
    return {
      beanId: null,
      errorResponse: NextResponse.json(
        { error: "请求体格式不正确。" },
        { status: 400 },
      ),
    };
  }

  if (!isString(body.bean_id)) {
    return {
      beanId: null,
      errorResponse: NextResponse.json(
        { error: "请提供 bean_id。" },
        { status: 400 },
      ),
    };
  }

  const beanId = body.bean_id.trim();
  if (!beanId) {
    return {
      beanId: null,
      errorResponse: NextResponse.json(
        { error: "bean_id 不能为空。" },
        { status: 400 },
      ),
    };
  }

  if (!isUuid(beanId)) {
    return {
      beanId: null,
      errorResponse: NextResponse.json(
        { error: "bean_id 格式不合法，请使用 UUID。" },
        { status: 400 },
      ),
    };
  }

  return { beanId, errorResponse: null };
}

async function resolveCurrentUserId(): Promise<{
  userId: string | null;
  errorResponse: NextResponse | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return {
        userId: null,
        errorResponse: NextResponse.json(
          { error: "请先登录后再操作点赞。" },
          { status: 401 },
        ),
      };
    }
    return { userId: data.user.id, errorResponse: null };
  } catch (error) {
    console.error("[likes] 获取登录用户失败:", error);
    return {
      userId: null,
      errorResponse: NextResponse.json(
        { error: "服务器开小差了，请稍后再试。" },
        { status: 500 },
      ),
    };
  }
}

async function ensureBeanExists(beanId: string): Promise<NextResponse | null> {
  try {
    const serviceClient = createServiceRoleClient();
    const { data, error } = await serviceClient
      .from("beans")
      .select("id")
      .eq("id", beanId)
      .maybeSingle();

    if (error) {
      console.error("[likes] 查询咖啡豆失败:", error);
      return NextResponse.json(
        { error: "查询咖啡豆失败，请稍后再试。" },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "找不到对应的咖啡豆，无法完成点赞操作。" },
        { status: 404 },
      );
    }

    return null;
  } catch (error) {
    console.error("[likes] 查询咖啡豆异常:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { beanId, errorResponse: bodyError } = await readBeanIdFromBody(request);
  if (bodyError) return bodyError;
  if (!beanId) {
    return NextResponse.json(
      { error: "请提供 bean_id。" },
      { status: 400 },
    );
  }

  const { userId, errorResponse: authError } = await resolveCurrentUserId();
  if (authError) return authError;
  if (!userId) {
    return NextResponse.json(
      { error: "请先登录后再操作点赞。" },
      { status: 401 },
    );
  }

  const beanMissing = await ensureBeanExists(beanId);
  if (beanMissing) return beanMissing;

  try {
    const serviceClient = createServiceRoleClient();
    const { data, error } = await serviceClient
      .from("likes")
      .insert({ user_id: userId, bean_id: beanId })
      .select("id, user_id, bean_id, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "你已经为这杯咖啡豆点过赞啦。" },
          { status: 409 },
        );
      }
      console.error("[POST /api/likes] Supabase error:", error);
      return NextResponse.json(
        { error: "点赞失败，请稍后再试。" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/likes] Unexpected error:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { beanId: queryBeanId } = parseBeanIdFromRequest(request);
  const { beanId: bodyBeanId, errorResponse: bodyError } =
    await readBeanIdFromBody(request);

  if (!queryBeanId && bodyError) return bodyError;

  const beanId = queryBeanId ?? bodyBeanId;
  if (!beanId) {
    return NextResponse.json(
      { error: "请提供 bean_id。" },
      { status: 400 },
    );
  }

  if (!isUuid(beanId)) {
    return NextResponse.json(
      { error: "bean_id 格式不合法，请使用 UUID。" },
      { status: 400 },
    );
  }

  const { userId, errorResponse: authError } = await resolveCurrentUserId();
  if (authError) return authError;
  if (!userId) {
    return NextResponse.json(
      { error: "请先登录后再操作点赞。" },
      { status: 401 },
    );
  }

  try {
    const serviceClient = createServiceRoleClient();
    const { data, error } = await serviceClient
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("bean_id", beanId)
      .select("id");

    if (error) {
      console.error("[DELETE /api/likes] Supabase error:", error);
      return NextResponse.json(
        { error: "取消点赞失败，请稍后再试。" },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "你还没有为这杯咖啡豆点赞。" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: { bean_id: beanId, removed: true } });
  } catch (error) {
    console.error("[DELETE /api/likes] Unexpected error:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { beanId } = parseBeanIdFromRequest(request);
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
    const serviceClient = createServiceRoleClient();
    const { count, error } = await serviceClient
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("bean_id", beanId);

    if (error) {
      console.error("[GET /api/likes] Supabase error:", error);
      return NextResponse.json(
        { error: "获取点赞数失败，请稍后再试。" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: { bean_id: beanId, count: count ?? 0 } });
  } catch (error) {
    console.error("[GET /api/likes] Unexpected error:", error);
    return NextResponse.json(
      { error: "服务器开小差了，请稍后再试。" },
      { status: 500 },
    );
  }
}