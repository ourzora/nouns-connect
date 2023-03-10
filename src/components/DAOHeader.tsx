import { useWCConnectionStore } from "../stores/connection";
import { useDAOImage } from "../hooks/useDAOImage";
import { CHAIN_ID } from "../utils/constants";
import { NounsBuildLink } from "./NounsBuildLink";

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
      <h1 className="md:text-6xl text-4xl text-center mt-14 md:mt-0">
        {showConnection && !connectedTo && <>Let’s connect </>}
        {url && (
          <img
            className="mx-2 w-16 h-16 rounded-lg inline-block"
            src={url}
            alt={dao.name}
          />
        )}{" "}
        {dao.name}
        <NounsBuildLink dao={dao} />
      </h1>
      {showConnection && (
        <p
          className="mt-2 mb-6 font-pt md:text-xl text-md font-pt"
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
