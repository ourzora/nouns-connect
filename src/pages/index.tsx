import Layout from "../components/layout";
import { Splash } from "../components/Splash";
import dynamic from "next/dynamic";

const SplashImageScatter = dynamic(() => import('../components/SplashImageScatter'), {
  ssr: false,
})

const Index = () => {
  return (
    <Layout title="NounsConnect | Home">
      <Splash />
      <SplashImageScatter />
    </Layout>
  );
};

export default Index;
