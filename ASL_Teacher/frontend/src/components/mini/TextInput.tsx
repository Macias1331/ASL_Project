import type React from "react";

interface Props {
  label : string;
  symbol? : string;
  isRequired? : boolean;
  minLength? : number;
  maxLength? : number;
  value : string;
  type : string;
  onValue : (event : React.ChangeEvent<HTMLInputElement>) => void;
}

function TextInput(
  { 
    label, 
    symbol, 
    isRequired=true, 
    minLength=8, 
    maxLength=24, 
    value="",
    type,
    onValue
  } : Props
) {

  return (
    <div className="mt-[40px] flex-1">
      <label htmlFor={label} className="text-xl">{label.charAt(0).toUpperCase() + label.slice(1)}</label>
      <div className={`bg-[#F6D052] flex rounded-sm mt-[5px] h-[40px]`}>
        {(symbol !== undefined) ?
          <img src={symbol} alt={label} className="size-9"/> : null
        }
        <input
          className="flex-1 text-ml"
          type={type}
          id={label}
          name={label}
          required={isRequired}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={`Type your ` + label}
          value={value}
          onChange={onValue}
        />
      </div>
    </div>
  );
}

export default TextInput;