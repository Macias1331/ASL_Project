import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signQuestLogo from "../assets/signQuestWhite.png";
import TextInput from "./mini/TextInput";
import accountIcon from "../assets/account.svg";
import lockIcon from "../assets/lock.svg";
import twitter from "../assets/twitter-original.svg";
import google from "../assets/google-original.svg";
import facebook from "../assets/facebook-original.svg";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleUsername(event : React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  function handlePassword(event : React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handleSubmit() {
    navigate('/menu');
  } 

  // !!! Need backend !!!
  // function handleTwitter() {
  //   console.log('Oauth of twitter!!!');
  // }

  // function handleGoogle() {
  //   console.log('Oauth of google!!!');
  // }

  // function handleFacebook() {
  //   console.log('Oauth of facebook!!!');
  // }

  function handleSignup() {
    navigate('/signup');
  }

  // !!! global store for colors !!!
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
              bg-white pt-10 flex flex-col  w-[500px] h-[700px] place-self-center 
              rounded-2xl border-[#0258A9] border-[3px] pr-20 pl-20
            "
          >
            <h1 className="text-4xl font-bold text-center">Login</h1>
            <TextInput label="username" type="text" value={username} onValue={handleUsername} symbol={accountIcon} />
            <TextInput label="password" type="password" value={password} onValue={handlePassword} symbol={lockIcon} />
            <a className="text-end">Forgot password?</a>
            <button type='submit' onClick={handleSubmit} className="
                bg-[#204666] rounded-xl w-2/5 self-center text-white font-bold text-lg pt-[5px] pb-[5px] m-[30px]
              "
            >
              LOGIN
            </button>
            <p className="text-center">Or Log In Using</p>
            <div className="flex justify-center mt-[10px] gap-[10px]">
              <button className="w-[50px] bg-[#204666] p-[10px] rounded-full ">
                <img className="invert" src={twitter} alt='twitter'/>
              </button>
              <button className="w-[50px] bg-[#204666] p-[10px] rounded-full ">
                <img src={google} alt='twitter'/>
              </button>
              <button className="w-[50px] bg-[#204666] p-[10px] rounded-full ">
                <img src={facebook} alt='twitter'/>
              </button>
            </div>
            <button type='button' onClick={handleSignup} className="
                bg-[#F6D052] rounded-xl w-2/5 self-center font-bold text-lg pt-[5px] pb-[5px] m-[75px]
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

export default Login;