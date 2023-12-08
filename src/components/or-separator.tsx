import React from 'react'
import { Separator } from './ui/separator'
import { cn } from '@/lib/utils'

interface OrSeperatorProps {
  className?: string
}

const OrSeparator: React.FC<OrSeperatorProps> = ({
  className
}) => {
  return (
    <div className={cn('flex flex-col relative', className)}>
      <Separator/>
      <span className='absolute top-[-13px] left-1/2 -translate-x-1/2 px-1 bg-background'>or</span>
    </div>
  )
}

export default OrSeparator
