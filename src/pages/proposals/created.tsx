import request from "graphql-request";
import { useRouter } from "next/router";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";

import { BorderFrame } from "../../components/BorderFrame";
import { CheckIcon } from "../../components/CheckIcon";
import Layout from "../../components/layout";
import { PageFrameSize } from "../../components/PageFrameSize";
import { PrettyAddress } from "../../components/PrettyAddress";
import { RenderRequest } from "../../components/RenderRequest";
import { ProposalByIdQuery } from "../../config/daos-query";
import { GetDaoServerSide } from "../../fetchers/get-dao";
import { useDAOImage } from "../../hooks/useDAOImage";
import { CHAIN_ID, ZORA_API_URL } from "../../utils/constants";

const MadePossibleLogo = dynamic(
  () => import("../../components/MadePossibleLogo"),
  {
    ssr: false,
  }
);

function Created({ dao }: { dao: any }) {
  const { url } = useDAOImage({ collectionAddress: dao.collectionAddress });
  const { query, isReady } = useRouter();

  const { data: proposalData } = useSWR(
    isReady ? ["proposalById", query.id] : undefined,
    ([_, proposalId]) =>
      request(ZORA_API_URL, ProposalByIdQuery, {
        chain: CHAIN_ID === 1 ? "MAINNET" : "GOERLI",
        proposalId,
      }),
    {
      shouldRetryOnError: true,
      errorRetryCount: 1000,
      refreshInterval: 8000,
    }
  );

  const nounsProposal = useMemo(() => {
    if (!proposalData) {
      return undefined;
    }
    return proposalData.nouns.nounsProposal;
  }, [proposalData]);

  const [proposalTitle, proposalDescription] = useMemo(() => {
    if (nounsProposal) {
      const results = nounsProposal.description.split("&&", 2);
      if (results.length === 2) {
        return [results[0], results[1]];
      }
      return [nounsProposal.description, undefined];
    }
    return [undefined, undefined];
  }, [nounsProposal]);

  const renderedRequests = useMemo(() => {
    if (!nounsProposal) {
      return [];
    }
    return nounsProposal.calldatas.map((calldata, indx) => (
      <div key={indx} className="border-2 rounded-lg py-6 px-6 my-4 w-full">
        <RenderRequest
          showDeleteButtonInline={false}
          indx={indx}
          defaultCollapsed={true}
          transaction={{
            data: {
              id: indx,
              gas: "",
              to: nounsProposal.targets[indx],
              calldata: calldata,
              value: nounsProposal.values[indx],
            },
            wallet: {
              icon: undefined,
              name: "",
            },
          }}
        />
      </div>
    ));
  }, [nounsProposal]);

  return (
    <Layout title="Nouns Connect | Proposal Created">
      <PageFrameSize>
        <h1 className="justify-center leading-10 text-center text-4xl flex mb-4">
          <CheckIcon />
          <div className="my-2 ml-4">Proposal Submitted</div>
        </h1>
        <BorderFrame>
          <div className="flex w-full justify-start justify-start items-center mb-8">
            <div
              className="bg-cover w-16 h-16 rounded-lg"
              style={{ backgroundImage: `url(${url})` }}
            />
            <h3 className="font-londrina text-4xl ml-4">
              {dao.name}{" "}
              <a
                title="View on nouns.build"
                target="_blank"
                className="text-gray-600 text-xl hover:color-black transition-color"
                href={`https://${
                  CHAIN_ID === 5 ? "testnet." : ""
                }nouns.build/dao/${dao.collectionAddress}`}
              >
                ↗
              </a>
            </h3>
          </div>
          <div className="w-full border-bottom-gray-500 " />
          {nounsProposal ? (
            <>
              <div className="flex font-bold flex-grow items-center mb-2 space-x-8 justify-start w-full">
                <span className="text-2xl text-gray-400">
                  {nounsProposal.proposalNumber}
                </span>
                <h3 className="text-2xl">
                  {proposalTitle}{" "}
                  <a
                    title="View on nouns.build"
                    target="_blank"
                    className="text-gray-600 hover:color-black transition-color"
                    href={`https://${
                      CHAIN_ID === 5 ? "testnet." : ""
                    }nouns.build/dao/${dao.collectionAddress}/vote/${
                      nounsProposal.proposalId
                    }`}
                  >
                    ↗
                  </a>
                </h3>
                <div className="text-right flex-grow flex justify-end">
                  <div className="capitalize rounded text-lg p-2 text-center bg-gray-100 px-4 text-slate-600">
                    {nounsProposal.status.toLowerCase()}
                  </div>
                </div>
              </div>
              {renderedRequests}
              <div className="flex w-full font-bold text-lg mt-4 justify-between">
                <div className="text-gray-400 ">Proposed by:</div>
                <div>
                  <PrettyAddress address={nounsProposal.proposer} />
                </div>
              </div>
            </>
          ) : (
            <h3 className="font-londrina text-xl font-pt">
              Loading... this may take a minute.
            </h3>
          )}
        </BorderFrame>
        <MadePossibleLogo />
      </PageFrameSize>
    </Layout>
  );
}

export const getServerSideProps = GetDaoServerSide;

export default Created;
