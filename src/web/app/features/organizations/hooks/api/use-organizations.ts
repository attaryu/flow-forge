import { queryOptions } from "@tanstack/react-query";
import { http } from "~/shared/utils/http";
import { getToken } from "~/shared/utils/session";
import type { Organization } from "../../types";

export const organizationsQueryOption = queryOptions({
  queryKey: ["organizations"],
  queryFn: async () => {
    const token = getToken();
    if (!token) return [];
    try {
      const res = await http.get("organizations").json<Organization[]>();
      return res;
    } catch {
      return [];
    }
  },
});
