'use client'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/user.models'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const router = useRouter()

  const { toast } = useToast()

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue, toast])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data?.messages || [])
      if (refresh) {
        toast({
          title: 'Refreshed',
          description: 'Showing new messages',
          variant: 'default',
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsSwitchLoading(false)
      setIsLoading(false)
    }
  }, [setIsLoading, setMessages, toast])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchMessages, fetchAcceptMessage])

  const handleSwitchChange = async () => {
    try {
      await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: 'Success',
        description: 'Messages accepted',
        variant: 'default',
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
      })
    }
  }

  if (!session || !session.user) {
    return (
      <div className='flex items-center justify-center mt-10'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </div>
    )
  }

  const { username } = session?.user

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: 'Copied',
      description: 'Profile link copied to clipboard',
      variant: 'default',
    })
  }

  if (!session || !session.user) {
    return (
      <div>Not logged in</div>
    )
  }

  return (
    <div className='bg-slate-900 min-h-screen p-10'>
      <h1 className='text-4xl font-bold mb-4 text-white font-mono'>
        User Dashboard
      </h1>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2 text-white'>
          Copy Your Unique link
        </h2>{' '}
        <div className='flex items-center my-5'>
          <input
            type="text"
            value={profileUrl}
            disabled
            className='w-full mr-2 bg-neutral-100 rounded-lg px-4 py-2'
          />
          <Button className='bg-slate-200 hover:bg-slate-300 text-black font-semibold font-mono text-lg' onClick={copyToClipboard} >
          <Image
            src="/file-copy-fill.svg"
            width={25}
            height={25}
            alt="Copy Logo"
          />
          </Button>
        </div>
      </div>

      <div className='mb-4 flex items-center'>
        <Switch
          className='bg-white'
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className='ml-2 text-white'>
          Accept messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />
      <Button
        className='mt-4'
        variant="outline"
        onClick={(e) => {
          e.preventDefault()
          fetchMessages(true)
        }}
      >
        {
          isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <RefreshCw className='h-4 w-4' />
          )
        }
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className='text-gray-500'>No messages yet</p>
        )}
      </div>

    </div>
  )
}

export default Page