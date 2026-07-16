import { useQuery } from "@tanstack/react-query";
import { organizationsQueryOption } from "../api/use-organizations";
import { getActiveOrgId } from "~/shared/utils/active-org";

export function useActiveOrg() {
  const { data: orgs = [] } = useQuery(organizationsQueryOption);
  const activeOrgId = getActiveOrgId();
  const activeOrg = orgs.find((o) => o.id === activeOrgId);

  return {
    activeOrg,
    role: activeOrg?.role || "viewer",
    isOwner: activeOrg?.role === "owner",
    isEditor: activeOrg?.role === "editor" || activeOrg?.role === "owner",
    isViewer: activeOrg?.role === "viewer",
    isLoading: !activeOrg && orgs.length === 0,
  };
}
