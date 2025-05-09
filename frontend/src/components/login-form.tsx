import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'; // 从 react-router-dom 导入 Link
import type { LoginRequestDto} from "@/types"; // 假设你的类型定义
import { useApi } from "@/hooks/use-api";

// 你可能有一个 AuthContext 来管理全局用户状态
// import { useAuth } from '@/context/AuthContext'; // 示例

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState<LoginRequestDto>({
    email: '',
    password: '',
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  // const { login: contextLogin } = useAuth(); // 示例：从 AuthContext 获取登录方法
  const {login,isLoadingAuth} = useApi(); // 使用自定义的 useApi hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    try {
      // 使用封装好的 api.auth.login
      await login(formData);

      // 重定向到目标页面，例如聊天页或仪表盘
      navigate('/chat');

    } catch (error: any) {
      console.error("Login failed:", error);
      setApiError(error.message || "An unknown error occurred during login.");
    } 
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-4xl mx-auto", className)} {...props}>
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center mb-4">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>

              {/* API Error Display */}
              {apiError && (
                <div className="text-red-500 text-sm p-3 bg-red-100 border border-red-400 rounded">
                  {apiError}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoadingAuth}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link // 使用 Link 组件
                    to="/forgot-password" // 你需要为此创建一个路由和页面
                    className="ml-auto text-sm underline-offset-2 hover:underline hover:text-primary"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoadingAuth}
                />
              </div>
              <Button type="submit" className="w-full mt-2" disabled={isLoadingAuth}>
                {isLoadingAuth ? "Logging in..." : "Login"}
              </Button>
              {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              // 可以添加第三方登录选项，例如 Google, GitHub 等
              */}
              <div className="text-center text-sm mt-2">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="underline underline-offset-4 hover:text-primary">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/chat.svg" // 修正图片路径
              alt="Login background"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" // object-cover 通常更好
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <Link to="/terms">Terms of Service</Link>{" "}
        and <Link to="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  );
}