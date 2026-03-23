import { Loader2Icon } from 'lucide-react'

const Loading = () => {
  return (
    <div className='flex h-screen items-center justify-center bg-gray-500 dark:bg-gray-900'>
        <Loader2Icon className='h-8 w-8 animate-spin text-green-500' size={48} />
    </div>
  )
}

export default Loading
