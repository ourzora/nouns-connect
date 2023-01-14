import Link from "next/link";

export const DAOItem = ({
  address,
  name,
  cover,
}: {
  address: string;
  name: string;
  cover: string;
}) => (
  <div>
    <img src={cover} />
    <div
      className="cursor-pointer shadow-sm m-2 hover:shadow-md text-2xl"
      key={address}
    >
      <Link className="p-6 inline-block" href={`/daos/${address}`}>
        {name}
      </Link>
    </div>
  </div>
);
