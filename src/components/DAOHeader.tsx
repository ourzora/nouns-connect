import { useWCConnectionStore } from "../stores/connection";
import useSWR from "swr";
import { CHAIN_ID, ZORA_API_URL } from "../utils/constants";
import { LastTokenQuery } from "../config/daos-query";
import request from "graphql-request";

export const DAOHeader = ({
  dao,
  showConnection = false,
}: {
  dao: any;
  showConnection?: boolean;
}) => {
  const { connectedTo, icon } = useWCConnectionStore();

  const { data: imageData } = useSWR(
    dao.collectionAddress,
    (collectionAddress) =>
      request(ZORA_API_URL, LastTokenQuery, {
        tokens: [{ address: collectionAddress, tokenId: "0" }],
        chain: CHAIN_ID === 1 ? "ETHEREUM" : "GOERLI",
      })
  );
  return (
    <>
      <h1 className="text-6xl text-center sm:text-4xl">
        {showConnection && !connectedTo && <>Let’s connect </>}
        {imageData && imageData.tokens.nodes.length && (
          <img
            className="mx-2 w-14 h-14 rounded-lg inline-block"
            src={imageData.tokens.nodes[0].token.image.mediaEncoding.poster}
            alt=""
          />
        )}{" "}
        {dao.name}
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
