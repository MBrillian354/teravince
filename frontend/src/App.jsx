import { useState } from 'react'

function App() {

  return (
      <div className="flex flex-row items-center justify-center gap-16 min-h-screen bg-white">
        <div className="flex flex-col gap-2">
          <h1 className='text-3xl font-montserrat font-bold'>HEADING</h1>
          <h2 className='text-2xl font-montserrat font-semibold'>SUB HEADING</h2>
          <p className='text-base font-public-sans'>Body Text</p>
        </div>

        <div className="flex flex-col min-w-xs border p-4 rounded-lg">
          <div className='bg-background rounded-t-lg min-h-28'></div>
          <div className='bg-primary min-h-16'></div>
          <div className='bg-danger min-h-16'></div>
          <div className='bg-secondary min-h-16'></div>
        </div>
      </div>
  )
}

export default App
