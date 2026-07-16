import { useQuery } from "@tanstack/react-query";
import { organizationsQueryOption } from "~/features/organizations/hooks/api/use-organizations";
import { getActiveOrgId } from "~/shared/utils/active-org";
import type { Organization } from "../types";

export function useActiveOrg() {
  const { data: orgs = [] } = useQuery(organizationsQueryOption) as { data?: Organization[] };
  const activeOrgId = getActiveOrgId();
  const activeOrg = orgs.find((o: Organization) => o.id === activeOrgId);

  return {
    activeOrg,
    role: activeOrg?.role || "viewer",
    isOwner: activeOrg?.role === "owner",
    isEditor: activeOrg?.role === "editor" || activeOrg?.role === "owner",
    isViewer: activeOrg?.role === "viewer",
    isLoading: !activeOrg && orgs.length === 0,
  };
}
