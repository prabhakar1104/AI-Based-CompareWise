import React from 'react'
import Header from './_components/Header'

function dashboard({children}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-1">
        <Header />
        {children}
      </main>
    </div>
  )
}

export default dashboard