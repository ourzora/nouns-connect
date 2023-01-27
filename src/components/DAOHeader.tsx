import { useWCConnectionStore } from "../stores/connection";
import { useDAOImage } from "../hooks/useDAOImage";
import { CHAIN_ID } from "../utils/constants";

export const DAOHeader = ({
  dao,
  showConnection = false,
}: {
  dao: any;
  showConnection?: boolean;
}) => {
  const { connectedTo, icon } = useWCConnectionStore();

  const { url } = useDAOImage({ collectionAddress: dao.collectionAddress });

  return (
    <>
      <h1 className="text-6xl text-center sm:text-4xl">
        {showConnection && !connectedTo && <>Let’s connect </>}
        {url && (
          <img
            className="mx-2 w-14 h-14 rounded-lg inline-block"
            src={url}
            alt={dao.name}
          />
        )}{" "}
        {dao.name}
        <a
          title="View on nouns.build"
          target="_blank"
          className="pl-2 text-gray-600 text-xl hover:color-black transition-color"
          href={`https://${CHAIN_ID === 5 ? "testnet." : ""}nouns.build/dao/${
            dao.collectionAddress
          }`}
        >
          ↗
        </a>
      </h1>
      {showConnection && (
        <p
          className="mt-2 mb-6 font-pt text-xl font-regular"
          style={{ color: "#808080" }}
        >
          {connectedTo ? (
            <>
              is now connected to{" "}
              {icon && (
                <img
                  src={icon}
                  className="inline-block px-1"
                  width="30"
                  height="30"
                  alt=""
                />
              )}{" "}
              <span className="text-black">{connectedTo}</span>
            </>
          ) : (
            <>We’re now going to connect {dao.name} to your app of choice</>
          )}
        </p>
      )}
    </>
  );
};
