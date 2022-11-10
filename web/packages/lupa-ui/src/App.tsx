import { Layout } from "@/components/Layout";
import { AppProviders } from "@/providers/app";
import { AppRoutes } from "@/routes";

export function App() {
  return (
    <AppProviders>
      <Layout>
        <AppRoutes />
      </Layout>
    </AppProviders>
  );
}
