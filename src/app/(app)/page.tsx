'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import { Card, CardContent } from "@/components/ui/card"

const Home = () => {
  return (
    <main className='flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12 bg-slate-900'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold font-mono text-neutral-100'>
          Dive into the world of Anonymous Conversation!
        </h1>
        <p className='text-lg md:text-2xl mt-5 font-serif text-gray-200'>
          Explore Mystery Message -  Where your identity remains a secret
        </p>
      </section>
      <Carousel 
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-xs">
        <CarouselContent>
          {Array.from(messages).map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col aspect-square items-center justify-between p-6">
                    <span className="text-xl font-semibold">{message.title}</span>
                    <span className="text-3xl font-semibold">{message.content}</span>
                    <span className="text-sm font-semibold">{message.received}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  )
}

export default Home