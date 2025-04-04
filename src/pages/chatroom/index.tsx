import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoIosLink } from "react-icons/io";
const Chat = dynamic(() => import('@/components/Chat'), { ssr: false });

export default function ChatRoom() {
   
  const router = useRouter();
  const { room, name } = router.query;

const [isRoom, setisRoom] = useState(false)

  useEffect(() => {
    setisRoom(room==undefined ? false : true)
  }, [room , name])
  

    const handleCopy = async () => {
        let textToCopy=`${process.env.NEXT_PUBLIC_API_CLIENT}/?roomId=${room}`
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for insecure context
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      alert("Copied!");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const renderChatPage = ()=>{
    
    return(
        <div className='w-[100%] h-[100vh] flex'>
         <Chat id={room} name={name} />

         <div className='hidden w-[50%] md:flex flex-col justify-center items-center'>


        <button onClick={handleCopy}  className='w-[100px] mb-[3rem] h-[100px] bg-[white] shadow-2xl rounded-[50%] flex justify-center items-center
         text-[65px]'>  <IoIosLink onClick={handleCopy} /> </button>
      
        <button className='flex text-[20px] font-bold' onClick={handleCopy}>Share Room link to your friends </button>
         <p className='mt-[4px]'> Created By Ali Zamanian</p>  


         </div>


         </div>
    )
  }

    return (
        <>
        {/* <p>room : {room}</p>
         <p>userName : {name}</p> */}
         {isRoom == true ? renderChatPage() : ""}
        </>
    );
}
