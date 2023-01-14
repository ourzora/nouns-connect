export const AppButton = ({ children, className, ...props }: any) => {
  return (
    <button
      {...props}
      className={`bg-black py-2 px-4 text-white rounded font-pt font-bold ${className}`}
    >
      {children}
    </button>
  );
};
