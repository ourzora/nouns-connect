import Link from "next/link";
import { DAOItem } from "../components/DAOItem";
import Layout from "../components/layout";
import { YourDAOs } from "../components/YourDAOs";
import { DAOS } from "../config/daos";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1 className="font-bold text-4xl sm:text-3xl">DAOConnect</h1>
    <p className="my-16 text-center text-4xl">
      Connect your Nouns DAO to DApps
    </p>

    <YourDAOs />

    <section className="relative mt-6" id="search">
      <input
        className="w-full text-gray-800 p-3 pl-11 border-2 rounded-lg text-md focus:outline-none"
        autoFocus={true}
        placeholder="Search..."
        id="search"
        autoCorrect="off"
        autoCapitalize="none"
      />
      <button
        type="submit"
        style={{ marginTop: "16px", marginLeft: "18px" }}
        className="absolute left-0 top-0"
      >
        <svg
          className="text-gray-400 h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 56.966 56.966"
          width="512px"
          height="512px"
        >
          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
        </svg>
      </button>
    </section>
    <section id="all-daos">
      <h1>All DAOs</h1>
      {DAOS.map((dao) => (
        <DAOItem name={dao.name} address={dao.token} description="" />
      ))}
    </section>
  </Layout>
);

export default IndexPage;
