import { ArticleOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { ReactNode } from "react";

export type LinkButtonProps = {
  href: string;
  children: ReactNode;
};

export const LinkButton = ({ href, children }: LinkButtonProps) => (
  <Button
    href={href}
    target="_blank"
    variant="contained"
    startIcon={<ArticleOutlined />}
  >
    {children}
  </Button>
);
