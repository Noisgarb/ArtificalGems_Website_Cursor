import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold">后台登录</h1>
        <p className="mt-2 text-sm text-gray-600">人造宝石询盘型官网管理后台</p>
        <LoginForm />
      </div>
    </main>
  );
}
