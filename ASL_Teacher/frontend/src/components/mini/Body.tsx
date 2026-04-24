interface Props {
  children? : React.ReactNode;
  tailwind? : string;
}

function Body({children, tailwind} : Props) {
  if (tailwind === undefined)
    tailwind = "";
  const className = "h-[calc(100vh-var(--header-size))] p-[30px] pt-[50px] " + tailwind;

  return (
    <div
      className={className}
      style={{ background: 'linear-gradient(to top, var(--bg-from), var(--bg-to))' }}
    >
      {children}
    </div>
  );
}

export default Body;