import { Helmet } from "react-helmet-async";

export type HeadProps = {
  title?: string;
  description?: string;
};

/** Head component allows setting page title and description declaratively */
export const Head = ({ title = "", description = "" }: HeadProps = {}) => {
  return (
    <Helmet title={title ? `${title} | Lupa` : undefined} defaultTitle="Lupa">
      <meta name="description" content={description} />
    </Helmet>
  );
};
