import React from 'react'
import { Loader2 } from "lucide-react";
const loading = () => {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
    <div className=" bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
      <p className="mt-4 font-medium text-gray-700">
        Loading page...
      </p>
    </div>
  </div>
  )
}

export default loading