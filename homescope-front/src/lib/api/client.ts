import createClient from "openapi-fetch";
import type { paths } from "@/lib/types/api/v1/schema";

export const client = createClient<paths>({
  baseUrl: "http://localhost:8090",
});
