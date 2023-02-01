import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDAOStore } from "../stores/dao";

const WC = () => {
  const { dao } = useDAOStore();
  const { push, isReady, query } = useRouter();

  useEffect(() => {
    if (isReady && dao && query) {
      push(`/daos/${dao.collectionAddress}?uri=${query.uri}`);
    }
  }, [isReady, dao, query]);
  return <>loading...</>;
};

export default WC;
