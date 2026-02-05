import createClient from "openapi-fetch";
import type { paths } from "@/lib/types/api/v1/schema";

export const client = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

client.use({
  onRequest({ request }) {
    if (request.url.includes("/admin")) {
      request.headers.set("x-admin-key", process.env.NEXT_PUBLIC_ADMIN_KEY!);
    }
  },
});
