import { ethers } from "ethers";
import { RequestDataDecoder } from "./RequestDataDecoder";
import { RequestType } from "./RequestType";

export const RenderRequest = ({indx, request }: { request: RequestType, indx: number }) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Transaction #{indx+1} Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Proposal Transaction Information
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Value</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {ethers.utils.formatEther(request.value)} ether
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Recipient
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {request.to}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Data</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <RequestDataDecoder to={request.to} calldata={request.calldata} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
