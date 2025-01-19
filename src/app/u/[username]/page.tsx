'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { Separator } from '@radix-ui/react-separator';
import { useCompletion } from 'ai/react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useState } from 'react';
export default function Page() {
  const params = useParams();

  const username = params.username;

  const { completion, complete } = useCompletion({
    api: '/api/suggest-messages',
  });

  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if(!message) return;

    const response = await axios.post<ApiResponse>('/api/send-message', {
      username,
      content: message
    });

    if (response.data.success) {
      setMessage('');
    }
  }

  return (
    <div>
      <div className='text-center bg-slate-900'>
        <h1 className='p-5 text-3xl font-bold font-mono text-white'>Mystery Message</h1>
      </div>
      <div className='mx-10 mt-3'>
        <h2 className='p-2 text-lg font-semibold font-mono'>Send anonymous message to @{username}</h2>
        <input
          className='bg-slate-100 h-32 px-4 w-full rounded-lg py-2 text-xl font-semibold border-2 text-slate-900'
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Enter your message'
        />
      </div>
      <div className='m-6 text-center'>
        <button
         onClick={handleSend}
         className='bg-black text-white px-4 py-2 rounded-lg'>Send it</button>
      </div>
      <Separator className='my-10 h-1 bg-gray-300 w-full'/>
      <div className='mx-10 mt-3'>
        <button
          onClick={async () => {
            await complete('Why is the sky blue?');
          }}
          className='font-semibold text-white border-2 border-slate-400 bg-slate-900 px-4 py-2 rounded-lg'
        >Suggest Messages</button> 
        <div className='mt-10 flex flex-col gap-2'>
          {completion && completion.split('||').map((message, index) => (
            <div
             key={index} 
             onClick={() => setMessage(message)}
             className='border-slate-600 bg-slate-100 font-semibold border-2 px-4 py-2 rounded-lg'>{message}</div>
          ))}
        </div>      
      </div>

     
    </div>
  );
}