'use client';
import { FaLocationArrow } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { useEffect, useRef, useState } from 'react';
import {
  connect,
  disconnect,
  sendJoin,
  sendLeave,
  sendMessage,
  // sendTyping,
  // sendStopTyping,
} from '@/lib/chatSocket';
import { Interface } from 'readline';

const randomRoom = 'room' + Math.floor(Math.random() * 1000);;
const randomUser = 'User_' + Math.floor(Math.random() * 1000);

interface ChatInterface {
  id:any;
  name:any;
}
const Chat: React.FC<ChatInterface> = ({ id, name }) => {
  const [roomId, setroomId] = useState(id || randomRoom);
  const [username, setUsername] = useState(name || randomUser)
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
  connect(
    roomId,
    (msg) => {
      setMessages((prev) => [...prev, msg]);
    },
    () => {
      // Now safe to send messages
      sendJoin(roomId, username);
      
    }
  );

  return () => {
    sendLeave(roomId, username);
    disconnect();
  };
}, []);

  const handleSend = () => {
    if (input.trim() !== '') {
      sendMessage(roomId, { sender: username, content: input }, 'MESSAGE');
      setInput('');
    }
  };


  
    const handleCopy = async () => {
        let textToCopy=`${process.env.NEXT_PUBLIC_API_CLIENT}/?roomId=${id}`
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


  // const handleTyping = () => {
  //   sendTyping(roomId, username);
  //   if (typingTimeout.current) clearTimeout(typingTimeout.current);

  //   typingTimeout.current = setTimeout(() => {
  //     sendStopTyping(roomId, username);
  //   }, 1000);
  // };

  return (
    <div className="w-[100%] md:w-[50%] h-[100vh] flex flex-col p-0" style={{direction:"rtl"}}>

      <div className="bg-[#584cd6]  py-3 h-[100%] overflow-y-scroll relative">




        <div className="w-[100%] h-[50px] bg-[white] text-black md:hidden
         fixed top-0 flex justify-between items-center p-2">
          <div>
            <button onClick={()=>handleCopy()} className="p-[11px] border bg-white rounded-[50%] 
             flex justify-center items-center shadow-2xl">
              <IoIosLink />
            </button>
          </div>
          <div>
         Developed By Ali Zamanian 
            
          </div>
        </div>



        {messages.map((msg, i) => (
          <div key={i} className='w-[100%] flex flex-wrap p-1'>

          {msg.sender == name ? <>

          <div
           className={`${msg.type=="JOIN"?"text-center w-[100%] flex flex-col text-white" :
            " w-[100%] h-[80px] flex items-center "}`}>


            {/* <strong className={`text-white`}>{`${msg.type=="JOIN" ? "":`${msg.sender==name? "":msg.sender+":"}`}`}</strong>  */}
             <span className={`${msg.type=="JOIN"?"text-white":
              "text-[#313030] w-auto h-[auto] bg-[white] flex items-center py-3  px-3 rounded-tl-2xl rounded-br-2xl rounded-bl-2xl"}`}>{msg.content}</span>
        
        </div>
          
          </>
          
          
          :
          
          <>

          <div
           className={`${msg.type=="JOIN"?"text-center w-[100%] flex flex-col text-white" :
            " w-[100%] h-[80px] flex justify-end items-center "}`}>


            {/* <strong className={`text-white`}>{`${msg.type=="JOIN" ? "":`${msg.sender==name? "":msg.sender+":"}`}`}</strong>  */}
             <span className={`${msg.type=="JOIN"?"text-[white]":
              "text-[white] w-auto h-[auto] bg-[#7b71ec] flex items-center py-3  px-3 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"}`}>{msg.content}</span>
        
        </div>
          
          </>
          
             
        }


          </div>
        ))}
      </div>

      <div className='h-[auto] flex justify-between bg-[#584cd6] p-1 items-center' style={{direction:"ltr"}}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        // onKeyUp={handleTyping}
        // onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        className=" py-1 px-3 bg-[white] text-[12px]
         placeholder:text-[#9a9a9a] text-black w-[83%] md:w-[93%] h-[45px] outline-0 rounded-2xl"
        placeholder="Type a message..."
      />
      <button onClick={handleSend} className="bg-[#fdfef6] h-[45px] w-[45px] flex justify-center items-center
        rounded-[50%]">
        <FaLocationArrow className="text-[#5846d1] text-[19px]"/>
      </button>

      </div>
      
    </div>
  );
};

export default Chat;
