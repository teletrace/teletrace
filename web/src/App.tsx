import { AppProviders } from "@/providers/app";
import { AppRoutes } from "@/routes";

export function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
