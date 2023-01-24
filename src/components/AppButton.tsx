export const AppButton = ({
  children,
  inverted = false,
  className,
  ...props
}: any) => {
  const TagName = ('href' in props) ? 'a' : 'button';
  return (
    <TagName
      {...props}
      className={`py-3 px-4 ${
        inverted ? "hover:bg-gray-100 bg-white" : "bg-black hover:bg-gray-900 text-white"
      } rounded font-pt transition-colors text-md font-bold ${className}`}
    >
      {children}
    </TagName>
  );
};
