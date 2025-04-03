// WebSocketChat.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";



const WebSocketChat = () => {

const router = useRouter();
const {roomId} = router.query;
const [title, setTitle] = useState("Welcome to My Web Socket ! please choose which one you want")
const [mode, setMode] = useState<any>(undefined);
const [name, setName] = useState<string | undefined>(undefined)
const [status, setStatus] = useState<any>(undefined)
const [id, setId] = useState<any>(roomId || "")

  const [randomNumber, setRandomNumber] = useState<any>(undefined);

  const generateRandomNumber = () => {
    const randomNum = Math.floor(Math.random() * 1000000); // generates a number between 0 and 1
    setRandomNumber(`${randomNum}`);
    return randomNum
  };

const handleJoin = ()=>{
   
  switch (status) {
    case "joinRoom":
       if (!id || !name) {
    alert("لطفاً تمامی فیلدها را پر کنید.");
    return;
  }
      router.push(`/chatroom/${roomId?roomId:id}?name=${name}`)
      break;

      case "createRoom":
         if (!name) {
    alert("لطفاً تمامی فیلدها را پر کنید.");
    return;
  }
       router.push(`/chatroom/${randomNumber}?name=${name}`)
      break;
  
    default:
      break;
  }
}


useEffect(() => {
  if (roomId !== undefined) {
    setTitle("Enter your name: ");
    setStatus("joinRoom");
    setMode("getName");
  }
}, [roomId]); // This will run every time roomId changes


  return (
    <div className="flex justify-center items-center w-[100%] h-[100vh] bg-[white] flex-col">
      {mode === undefined && (
        <>

          <div className="w-[100%] md:w-[50%] h-[auto] flex flex-wrap justify-center items-center">
    <h1 className="w-[95%] mb-[4rem] text-center text-black font-bold">{title}</h1>

    <div className="flex w-[95%] justify-between">
    <button className="w-[47%] h-[150px] bg-[#ffffff] shadow-2xl text-[black] rounded-2xl  cursor-pointer" onClick={()=>{
        setTitle( "Write your name : ")
      setMode("getName")
      var room =generateRandomNumber()
      setId(room)

      setStatus("createRoom")

   } }>Create chatroom</button>
   
    <button className="w-[47%] h-[150px] bg-[#ffffff] shadow-2xl text-[black] rounded-2xl  cursor-pointer" onClick={()=>{
      setTitle("Filling the requirements")
      setMode("getName")
      setStatus("joinRoom")
// router.push("/chatroom?roomId=")}
    }}>Join chatroom</button>
    </div>
    
    </div>
      </>)}

         {mode === "getName" && (
        <>
           <div className="w-[100%] md:w-[50%] h-[auto] flex flex-col justify-center items-center">
           <h1 className="w-[90%] my-[2rem] text-center text-black">{title}</h1>
          {roomId || id ? <></>:<>
          
          <input required className="w-[50%] rounded-[2px] bg-[#f1f1f1] text-black p-[5px] h-[55px] outline-none" type="name" name="" placeholder="Room id here ..." value={id} onChange={(e)=>setId(e.target.value)} id="" /> 
         <br />
          </>}
          <input required className="w-[50%] rounded-[2px] bg-[#f1f1f1] text-black p-[5px] h-[55px] outline-none" type="name" name="" placeholder="first name here ..." value={name} onChange={(e)=>setName(e.target.value)} id="" />
         
         <div className="flex justify-between w-[50%]">
       <button className="mt-[1rem] w-[47%] bg-blue-600 text-white h-[48px] rounded-2xl cursor-pointer" onClick={handleJoin}>Join</button>
                    <button className="mt-[1rem] w-[47%] bg-red-500 text-white h-[48px] rounded-2xl cursor-pointer" onClick={()=>{
                      setTitle("Welcome to My Web Socket ! please choose which one you want")
                      setMode(undefined)
                      setId(undefined)
                      router.push(`${process.env.NEXT_PUBLIC_API_CLIENT}/`)}}>back</button>
         </div>

     
   
          </div>
        </>)}
  <p className="text-[13px] mt-[4rem] text-black">Created By Ali Zamanian</p>
    </div>
  );
};

export default WebSocketChat;
