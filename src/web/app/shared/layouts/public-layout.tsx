import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <div className="min-h-svh bg-background">
      <Outlet />
    </div>
  );
}
