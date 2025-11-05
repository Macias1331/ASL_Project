import signQuestWhite from '../../assets/signQuestWhite.png';

function Header() {
  return (
    <div className="bg-[#121F32] h-[75px] flex justify-between pr-[20px]">
      <div className='flex items-center'>
        <img src={signQuestWhite} alt='logo' className="h-7/6"/>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" className="fill-[#EBEF0A] h-2/3">
          <title>coin-copper</title>
          <path d="M12 14H10V13H9V12H8V10H9V9H10V8H12V9H13V10H14V12H13V13H12ZM15 19H7V18H6V17H5V16H4V15H3V7H4V6H5V5H6V4H7V3H15V4H16V5H17V6H18V7H19V15H18V16H17V17H16V18H15ZM12 12V10H10V12ZM14 17V16H15V15H16V14H17V8H16V7H15V6H14V5H8V6H7V7H6V8H5V14H6V15H7V16H8V17Z" />
        </svg>
        <p className="text-white font-bold text-2xl">1738</p>
      </div>
      <div className='flex items-center gap-[20px]'>
        <svg aria-label='email-outline' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-white h-2/3">
          <title>email-outline</title>
          <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" />
        </svg>
        <svg aria-label='account-group' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-white h-2/3">
          <title>account-group</title>
          <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
        </svg>
        <svg aria-label='home' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-white h-2/3">
          <title>home</title>
          <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
        </svg>
        <svg aria-label='cog' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="fill-white h-2/3">
          <title>cog</title>
          <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
        </svg>
      </div>
    </div>
  );
}

export default Header;