import { redirect } from "react-router";
import { http } from "~/shared/utils/http";
import { clearSession } from "~/shared/utils/session";

export async function clientAction() {
  try {
    await http.post("auth/logout").json();
  } catch {
    // Ignore error, we want to clear local session anyway
  }
  clearSession();
  return redirect("/login");
}

export default function LogoutPlaceholder() {
  return null;
}
