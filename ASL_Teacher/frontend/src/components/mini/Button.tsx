interface Props {
  text?: string;
  imageOne?: string;
  imageTwo?: string;
  altOne?: string;
  altTwo?: string;
  color?: string;
  width?: string;
  height?: string;
}

function Button({
  text, 
  imageOne, imageTwo, 
  altOne, altTwo, 
  color='#F6D052', 
  width="50px", height="50px"
} : Props) {
  const className = `bg-[${color}] flex items-center justify-center rounded-2xl w-[${width}] h-[${height}]`;
  const spanClassName = `w-[${width}] text-3xl`;
  return (
    <button className={className}>
      {(text && <span className={spanClassName}>{text}</span>)}
      {(imageOne && (
        <img src={imageOne} alt={altOne} className="h-full w-full"/>
      ))}
      {(imageTwo && (
        <img src={imageTwo} alt={altTwo} className="h-full w-full"/>
      ))}
    </button>
  );
}

export default Button;