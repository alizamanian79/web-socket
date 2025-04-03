import React, { useState, useEffect } from 'react';
import useWebSocket from "../../../component/useWebSocket";
import { useRouter } from 'next/router';

export default function Chatroom() {
  const router = useRouter();
  const { slug, name } = router.query; // Access both "slug" and "name" from the query string

  const [pageSlug, setPageSlug] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  const {
    messages,
    message,
    roomId,
    user,
    setMessage,
    sendMessage,
    setRoomId,
    setUser
  } = useWebSocket();



  // Function to copy the text to clipboard
const handleCopy = () => {
  const textToCopy = `${process.env.NEXT_PUBLIC_API_CLIENT}/?roomId=${roomId}`;
  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  alert("Link copied successfully");
};

  // Set initial values for roomId, user, and userName when the component mounts
  useEffect(() => {
    if (slug && name) {
      setPageSlug(slug as string);  // Update pageSlug
      setUserName(name as string);  // Update userName
      setRoomId(`${slug}`);  // Set the roomId dynamically
      setUser(name as string);  // Set the user dynamically (based on the name)
    }
  }, [slug, name, setRoomId, setUser]); // Run when slug or name changes

  return (
    <div className="w-[100%] h-[100vh] py-2 px-4 shadow-lg flex flex-col justify-center bg-[white] text-black" >
      <h2 className="text-xl font-bold mb-2 text-right text-[black]">{userName}</h2>
      <h4 className='text-l font-bold mb-2 text-right text-[white]' onClick={()=>{handleCopy()}}>
<button className='  text-[#13136f] mb-2 cursor-pointer'>کپی لینک اتاق برای دوستان</button>

      </h4>

      <div className="h-[60%] md:h-[80%] overflow-y-auto border p-2 "  style={{direction:"ltr"}}>
        {messages.map((msg, index) => (
          <div key={index} className="p-1 text-right">
            <strong>{msg.sender}: </strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="mt-2 flex" style={{direction:"rtl"}}>
        <input
          type="text"
          className=" outline-none bg-[#f7f7f7] flex-1  pr-2 rounded-md text-right text-black placeholder:text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="پیام خود را بنویسید ..."
        />
        <button
          className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={sendMessage}
        >
          ارسال
        </button>
      </div>
    </div>
  );
}
