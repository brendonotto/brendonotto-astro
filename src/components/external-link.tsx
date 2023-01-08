import type { ReactNode } from "react";

type Props = {
  url: string;
  children?: ReactNode;
};

const ExternalLink = ({ url, children }: Props) => {
  return (
    <a
      className="font-medium border-b-2 border-transparent hover:border-blue-900"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

export default ExternalLink;
