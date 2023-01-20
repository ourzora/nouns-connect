import Link from "next/link";

export const DAOItem = ({
  address,
  name,
  cover,
  holdings,
}: {
  address: string;
  name: string;
  cover?: string;
  holdings?: number;
}) => (
  <div className="">
    <div
      className="cursor-pointer w-60 border rounded-lg shadow-sm m-2 hover:shadow-md"
      style={{borderColor: 'rgba(232, 232, 232, 1)'}}
      key={address}
    >
      <div className="w-full flex h-60 overflow-hidden">
        <img src={cover} alt="" className="flex-grow object-cover rounded-lg" />
      </div>
      <Link className="p-6 inline-block" href={`/daos/${address}`}>
        <span className="block text-2xl">{name}</span>
        <span
          className="block text-sm font-pt font-normal mt-2"
          style={{ color: "#808080" }}
        >
          You have {holdings.toString()} votes
        </span>
      </Link>
    </div>
  </div>
);
