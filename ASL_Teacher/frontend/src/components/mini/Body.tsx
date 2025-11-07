interface Props {
  children? : React.ReactNode;
  tailwind? : string;
}

function Body({children, tailwind} : Props) {
  if (tailwind === undefined)
    tailwind = "";
  const className = "h-[calc(100vh-var(--header-size))] bg-gradient-to-t from-[#1C3F5C] to-[#081520] p-[30px] pt-[50px] " 
                    + tailwind;

  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default Body;