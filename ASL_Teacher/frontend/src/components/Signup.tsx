import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signQuestLogo from "../assets/signQuestWhite.png";
import TextInput from "./mini/TextInput";

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleState<T extends string>(setter : React.Dispatch<React.SetStateAction<T>>) {
    return (event : React.ChangeEvent<HTMLInputElement>) => {
      return setter(event.target.value as T);
    }
  }

  function handleSubmit() {
    navigate('/');
  }

  return (
    <div className="h-full grid place-items-center bg-gradient-to-t from-[#1C3F5C] to-[#081520] p-[20px]">
      <div className="h-full flex items-center w-full max-w-[1200px]">
        <figure className="flex-1 grid relative">
          <img src={signQuestLogo} alt='logo' className="size-110 place-self-center"/>
          <figcaption className="
              absolute text-white w-4/5 text-4xl bottom-10 left-1/2 transform: -translate-x-1/2 text-center
            "
          >
            Learn to sign. Seamlesssly
          </figcaption>
        </figure>
        <div className="flex-1">
          <form className="
              bg-white pt-10 flex flex-col w-[600px] h-[700px] place-self-center 
              rounded-2xl border-[#0258A9] border-[3px] pr-20 pl-20
            "
          >
            <h1 className="text-4xl font-bold text-center">Sign up</h1>
            <div className="flex gap-[20px]">
              <TextInput label="firstName" type="text" value={firstName} onValue={handleState(setFirstName)}/>
              <TextInput label="lastName" type="text" value={lastName} onValue={handleState(setLastName)}/>
            </div>
            <div className="flex gap-[20px]">
              <TextInput label="username" type="text" value={username} onValue={handleState(setUsername)}/>
              <TextInput label="email" type="email" value={email} onValue={handleState(setEmail)}/>
            </div>
            <div>
              <TextInput label="password" type="password" value={password} onValue={handleState(setPassword)}/>
              <TextInput label="confirmPassword" type="password" value={confirmPassword} onValue={handleState(setConfirmPassword)}/>
            </div>
            <button type='submit' onClick={handleSubmit} className="
                bg-[#204666] rounded-xl w-2/5 self-center text-white font-bold text-lg pt-[5px] pb-[5px] m-[30px]
              "
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;