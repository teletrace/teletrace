import Layout from "@/components/Layout/";
import { AppProviders } from "@/providers/app";

export function App() {
  return (
    <AppProviders>
      <Layout />
    </AppProviders>
  );
}
