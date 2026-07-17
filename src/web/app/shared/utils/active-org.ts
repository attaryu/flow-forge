export const ACTIVE_ORG_KEY = "flow-forge-active-org";

export function getActiveOrgId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_ORG_KEY);
}

export function setActiveOrgId(orgId: string) {
  localStorage.setItem(ACTIVE_ORG_KEY, orgId);
}

export function clearActiveOrgId() {
  localStorage.removeItem(ACTIVE_ORG_KEY);
}
