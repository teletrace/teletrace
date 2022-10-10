import { Box } from "@mui/material";

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
    <>
      <Head title={title} description={description} />

      <Box
        component="main"
        padding={2}
        sx={{
          position: "absolute",
          top: "60px",
          height: "calc(100% - 60px)",
          width: "100%",
        }}
      >
        {children}
      </Box>
    </>
  );
};
