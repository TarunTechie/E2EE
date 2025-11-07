"use client"
import { useState } from "react";
import api from "../utils/api";
import {generateKeyPair,generateExchangeKey,encryptData} from '@/utils/utils.js'
export default function Home() {
  const [msg, setMsg] = useState("")
  async function sendMsg()
  {
    const encryptedData = await encryptData(msg)
    const result=await api.post('/sendMsg',encryptedData)
  }

  async function handshake()
  {
    const publickey=await generateKeyPair() 
    const result = await api.post('/publicKey', { publicKey: publickey })
    const exchange = await generateExchangeKey(localStorage.getItem('private_key'), result.data.key)
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
          <h1 className="font-black text-center m-auto text-amber-200">ENTER THE MESSAGE YOU WANT TO SEND</h1>
        <input className="m-auto bg-yellow-200 px-5 py-2 text-black" onChange={(event) => { setMsg(event?.target.value) }} />
        <button className="m-auto p-2 bg-amber-200 text-black rounded-full"
        onClick={sendMsg}
        >Send Message</button>

        <button className="m-auto p-2 bg-amber-200  text-black rounded-full" onClick={handshake}>
          HandShake Button
        </button>
      </main>
    </div>
  );
}
