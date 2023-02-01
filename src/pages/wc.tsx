import dynamic from "next/dynamic";

const WCConnectPage = dynamic(() => import("../components/WCConnectPage"), {
  ssr: false,
});

const WC = () => {
  return <WCConnectPage />;
};

export default WC;