import { redirect } from "react-router";
import { getToken } from "~/shared/utils/session";

export function clientLoader() {
  const token = getToken();
  if (token) {
    return redirect("/dashboard");
  }
  return redirect("/login");
}

export default function Home() {
  return null;
}
