import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, ChevronsUpDown, Check } from "lucide-react";
import { organizationsQueryOption } from "../hooks/api/use-organizations";
import { getActiveOrgId, setActiveOrgId } from "~/shared/utils/active-org";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";

export function OrgSwitcher() {
  const queryClient = useQueryClient();
  const { data: orgs = [] } = useQuery(organizationsQueryOption);
  const activeOrgId = getActiveOrgId();
  const activeOrg = orgs.find((o) => o.id === activeOrgId);

  // Auto-select first org if none is active
  React.useEffect(() => {
    if (orgs.length > 0 && !activeOrgId) {
      setActiveOrgId(orgs[0].id);
      queryClient.invalidateQueries();
      window.location.reload();
    }
  }, [orgs, activeOrgId, queryClient]);

  const handleSwitch = (orgId: string) => {
    if (orgId === activeOrgId) return;
    setActiveOrgId(orgId);
    queryClient.clear();
    window.location.href = "/dashboard";
  };

  if (orgs.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="font-semibold truncate">No Organization</span>
              <span className="text-xs truncate text-muted-foreground">Ask owner to invite you</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="font-semibold truncate">
                  {activeOrg?.name || "Select Organization"}
                </span>
                <span className="text-xs truncate text-muted-foreground flex items-center gap-1.5 capitalize">
                  {activeOrg?.role || "Member"}
                  {activeOrg && (
                    <Badge variant="outline" className="h-4 px-1 text-[10px] uppercase font-bold py-0">
                      {activeOrg.role}
                    </Badge>
                  )}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--trigger-width] min-w-56 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {orgs.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSwitch(org.id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{org.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">{org.role}</span>
                </div>
                {org.id === activeOrgId && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
