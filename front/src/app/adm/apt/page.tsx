"use client";

import AdminAptFetcher from "@/components/AdmAptFetcher";

export default function AdminAptPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">관리자 페이지</h1>

      <AdminAptFetcher />
    </div>
  );
}
