'use client'
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(
            verifySchema
        ),
        defaultValues: {
            username: '',
            code: '',
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast({
                title: response.data.success ? 'Success' : 'Error',
                description: response.data.message || 'Error occured while verifying code',
            })
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = (axiosError.response?.data as { message: string }).message || 'Something went wrong'
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }


    return (
        <div className='flex justify-center items-center min-h-screen bg-slate-900'>
            <div className="w-full max-w-md p-8 space-y-8 bg-neutral-200 rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight lg:text-5xl mb-6">
                        Verify your account
                    </h1>
                    <p className="mb-4">
                        Mystery awaits your code
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="code" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting} className='flex items-center'>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    'Verify'
                                )
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount