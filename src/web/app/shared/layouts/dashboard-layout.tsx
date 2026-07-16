import { redirect, Outlet } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppSidebar } from "~/components/app-sidebar";
import { queryClient } from "~/shared/utils/query-client";
import { userQueryOption } from "~/features/auth/hooks/api/use-user";
import { organizationsQueryOption } from "~/features/organizations/hooks/api/use-organizations";
import { getActiveOrgId, setActiveOrgId } from "~/shared/utils/active-org";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export async function clientLoader() {
  try {
    const user = await queryClient.ensureQueryData(userQueryOption);
    if (!user) {
      return redirect("/login");
    }
    return { user };
  } catch {
    return redirect("/login");
  }
}

export default function DashboardLayout() {
  const { data: user } = useQuery(userQueryOption);
  const { data: orgs = [], isLoading: orgsLoading } = useQuery(organizationsQueryOption);
  const queryClientInstance = useQueryClient();
  const activeOrgId = getActiveOrgId();

  if (!user) return null;

  const showOrgModal = !activeOrgId && !orgsLoading && orgs.length > 0;

  const handleSelectOrg = (orgId: string) => {
    setActiveOrgId(orgId);
    queryClientInstance.clear();
    window.location.reload();
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Flow Forge
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>

      <Dialog open={showOrgModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[425px]" interactOutsideBehavior="close">
          <DialogHeader>
            <DialogTitle>Select Organization</DialogTitle>
            <DialogDescription>
              Please select an organization to proceed to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            {orgs.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelectOrg(org.id)}
                className="flex flex-col w-full text-left p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span className="font-semibold text-sm">{org.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{org.role}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
