import { Route, Routes } from "react-router-dom";

import { Layout } from "@/components/Layout";
import { AppProviders } from "@/providers/app";

export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="*" element={<h1>404 Page not found</h1>} />
        <Route path="/" element={<Layout />}>
          <Route index element={<h1>Homepage</h1>} />
          <Route path="traces" element={<h1>Traces</h1>} />
        </Route>
      </Routes>
    </AppProviders>
  );
}
