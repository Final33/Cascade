"use client"

import { Logo } from "@/components/Logo"

export const TopNav = () => {
  return (
    <header className="sticky top-4 z-50 mx-4">
      <div className="rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 h-20 shadow-sm">
        <nav className="flex h-full items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            {/* Left section with logo and primary navigation */}
            <div className="flex items-center gap-8">
              {/* Primary Navigation */}
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm font-medium">My Classes:</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm font-medium"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    AP Calculus
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full text-sm font-medium"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    AP Physics
                  </Button>
                </div>
              </div>
            </div>

            {/* Right section with actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <MessageSquare className="h-4 w-4 text-gray-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <Settings className="h-4 w-4 text-gray-700" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <LogOut className="h-4 w-4 text-gray-700" />
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
} 