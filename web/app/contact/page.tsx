import Link from "next/link";
import { InquiryForm } from "./InquiryForm";

export default function ContactPage({
  searchParams,
}: {
  searchParams: { productId?: string; productName?: string };
}) {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">联系我们 / 询盘</h1>
          <p className="mt-2 text-gray-600">填写下方表单，我们会尽快与您联系。</p>
          <Link href="/" className="mt-2 inline-block text-blue-600 hover:underline">返回首页</Link>
        </header>
        <InquiryForm
          defaultProductId={searchParams.productId ? parseInt(searchParams.productId, 10) : undefined}
          defaultProductName={searchParams.productName ? decodeURIComponent(searchParams.productName) : undefined}
        />
      </div>
    </main>
  );
}
