export const AppButton = ({
  children,
  inverted = false,
  className,
  ...props
}: any) => {
  return (
    <button
      {...props}
      className={`py-2 px-4 ${
        inverted ? "text-black bg-white" : "bg-black text-white"
      } rounded font-pt font-bold ${className}`}
    >
      {children}
    </button>
  );
};
