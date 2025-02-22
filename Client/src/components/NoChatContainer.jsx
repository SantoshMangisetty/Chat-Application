import { MessageSquare } from 'lucide-react'
import React from 'react'

const NoChatContainer = () => {
  return (
    <div className='w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50'>
        <div className='max-w-md text-center space-y-6'>
            <div className='flex justify-center gap-4 mb-4'>
                <div className='relative'>
                    <div className='rounded-2xl size-16 bg-primary/10 flex items-center justify-center animate-bounce'>
                        <MessageSquare className='size-8 text-primary'/>
                    </div>
                </div>
            </div>

            <h2 className='text-2xl font-bold'>Welcome to Converse</h2>
            <p className='text-base-content/60'>
            Select a Conversation
            </p>
        </div>
    </div>
  )
}

export default NoChatContainer