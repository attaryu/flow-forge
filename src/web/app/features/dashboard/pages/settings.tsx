import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userQueryOption } from "~/features/auth/hooks/api/use-user";
import { setSession, getUser } from "~/shared/utils/session";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface OrganizationInfo {
  id: string;
  name: string;
}

interface SettingsData {
  user: UserProfile;
  organization: OrganizationInfo;
}

interface FormValues {
  name: string;
  email: string;
  organizationName: string;
}

export default function Settings() {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load active user and organization details
  const { data: user, isLoading, isError } = useQuery(userQueryOption);

  // Setup mock organization data
  const organization: OrganizationInfo = {
    id: "org-ff-7a2e-4b9c",
    name: user ? `${user.name}'s Workspace` : "My Workspace",
  };

  // Setup form using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    values: user
      ? {
          name: user.name,
          email: user.email,
          organizationName: organization.name,
        }
      : undefined,
  });

  // Settings update mutation (mocked client-side since API update doesn't exist)
  const updateSettingsMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      // Simulate API lag
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (!user) throw new Error("User session not found");

      const updatedUser = {
        ...user,
        name: values.name,
        email: values.email,
      };

      return { success: true, user: updatedUser };
    },
    onSuccess: (data) => {
      // Persist updated user details in session (localStorage) and sync Query Cache
      const token = localStorage.getItem("flow-forge-access-token") || "";
      setSession(token, data.user);
      setSuccessMsg("Settings updated successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
    },
  });

  const onSubmit = (values: FormValues) => {
    setSuccessMsg(null);
    updateSettingsMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-sm text-destructive">
        Failed to load settings. Please refresh the page and try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings, organization details, and platform preferences.
        </p>
      </div>
      <Separator />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile & Organization Settings</CardTitle>
            <CardDescription>
              Update your personal profiles and workspace organization details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {updateSettingsMutation.isError && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {updateSettingsMutation.error instanceof Error
                  ? updateSettingsMutation.error.message
                  : "An error occurred while updating settings."}
              </div>
            )}
            {successMsg && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                {successMsg}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" {...register("name", { required: "Name is required" })} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input id="organizationName" type="text"
                {...register("organizationName", { required: "Organization name is required" })} />
              {errors.organizationName && (
                <p className="text-xs text-destructive">{errors.organizationName.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="org-id">Organization ID</Label>
              <Input id="org-id" type="text" value={organization.id}
                className="font-mono text-xs bg-muted" disabled />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-between">
            <p className="text-xs text-muted-foreground">
              Profile details are kept up-to-date across all active organization memberships.
            </p>
            <Button type="submit" disabled={updateSettingsMutation.isPending || !isDirty} className="cursor-pointer">
              {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
