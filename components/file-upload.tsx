"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"
import { useState, useRef } from "react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  onUseDemoFile: () => void
  fileName: string | null
}

export function FileUpload({ onFileChange, onUseDemoFile, fileName }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onFileChange(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0] || null
    onFileChange(file)
  }

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="bg-gray-100 p-4 rounded-full">
            <Upload className="h-8 w-8 text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Upload your CSV report file</h3>
            <p className="text-sm text-gray-500 mt-1">Drag and drop or click to browse</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Select File
            </Button>
            <Button variant="outline" onClick={onUseDemoFile} className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Use Demo File
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileSelect} />
          </div>
        </div>
      </div>

      {fileName && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckIcon className="h-5 w-5 text-green-500" />
          <span className="text-green-800 text-sm">{fileName}</span>
        </div>
      )}
    </div>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
