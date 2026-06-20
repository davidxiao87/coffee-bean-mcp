import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                注册成功，感谢加入！
              </CardTitle>
              <CardDescription>请查收邮箱完成验证</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                您已经完成注册。请前往邮箱点击验证链接后，再返回登录页面。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
