import Logo from "./Logo";

const MadePossibleLogo = () => (
  <div className="flex mt-8 items-center text-2xl text-gray-700 justify-center font-pt font-bold">
    <div className="text-xl">Made possible by:</div>
    <div className="p-4">
      <Logo size={60} />
    </div>
  </div>
);

export default MadePossibleLogo;
