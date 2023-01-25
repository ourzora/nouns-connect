import { useWCConnectionStore } from "../stores/connection";
import { useDAOImage } from "../hooks/useDAOImage";

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
