import CreateEvent from '@/components/createEvent'
import React from 'react'

const test = () => {
  return (
    <>
    <CreateEvent isOpen={true} onClose={function (): void {
              throw new Error('Function not implemented.')
          } } onSave={function (eventData: { date: string; title: string; description: string; doc_id: string }): void {
              throw new Error('Function not implemented.')
          } } />
    </>
  )
}

export default test