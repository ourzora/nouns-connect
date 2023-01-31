import Logo from "./Logo";

export const MadePossibleLogo = () => (
  <div className="flex mt-8 items-center text-2xl text-gray-700 justify-center font-pt font-bold">
    <div className="text-xl">Made possible by:</div>
    <Logo size={120} />
  </div>
);
