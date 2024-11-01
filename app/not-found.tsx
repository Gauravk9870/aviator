import { AlertTriangle, Home } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="max-w-md w-full px-6 py-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <div className="flex flex-col items-center text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Oops! Page not found        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
        The page you are looking for might have been removed, 
        had its name changed, or is temporarily unavailable.        </p>
        <div className="space-y-4 w-full">
        
        <Button asChild>
            <Link href="/" className="inline-flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Go back home
            </Link>
          </Button>
        </div>
       
      </div>
    </div>
  </div>
  )
}