import type { ReactNode } from "react";

export const DefinitionListItem = ({
  name,
  children,
  title,
}: {
  name: React.ReactNode;
  title?: string;
  children: ReactNode;
}) => (
  <>
    <dt
      title={title}
      className="title-title font-bold block m-0 p-0 text-left capitalize"
    >
      {name}
    </dt>
    <dd className="block p-0 m-0 mb-2 text-left p-3 break-words">{children}</dd>
  </>
);
