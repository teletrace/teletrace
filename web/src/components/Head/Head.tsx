import { Helmet } from "react-helmet-async";

export type HeadProps = {
  title?: string;
  description?: string;
};

export const Head = ({ title, description }: HeadProps) => {
  return (
    <Helmet title={title && `${title} | Lupa`} defaultTitle="Lupa">
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};
