import { queryOptions } from "@tanstack/react-query";
import { http } from "~/shared/utils/http";
import { getToken } from "~/shared/utils/session";
import type { User } from "~/shared/utils/session";

export const userQueryOption = queryOptions({
  queryKey: ["user"],
  queryFn: async () => {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await http.get("auth/me").json<User>();
      return res;
    } catch {
      return null;
    }
  },
});
