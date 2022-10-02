import { Container } from "@mui/material";

import { Head } from "@/components/Head";

type MainLayoutProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
};

export const MainLayout = ({
  children,
  title,
  description,
}: MainLayoutProps) => {
  return (
    <Container maxWidth="lg">
      <Head title={title} description={description} />
      {children}
    </Container>
  );
};
