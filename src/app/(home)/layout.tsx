"use client"

interface Props {
  children: React.ReactNode
}

function Layout({ children }: Props) {

  return (
    <main className="flex flex-col min-h-screen max-h-screen relative overflow-hidde">
      {/* Dark background gradient */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b " />


      {/* Content */}
      <div className="flex-1 flex flex-col px-4 -pb-4 relative z-10">
        {children}
      </div>
    </main>
  )
}

export default Layout
