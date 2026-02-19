"use client"

import { useState } from "react"
import { Upload, X, File, FileText } from "lucide-react"
import { useApplicationForm } from "@/hooks/use-application-form"
import { Button } from "@/components/ui/button"

const REQUIRED_DOCUMENTS = [
  { id: "birth-certificate", name: "Birth Certificate", required: true },
  { id: "aadhaar", name: "Aadhaar Card", required: true },
  { id: "report-card", name: "Previous School Report Card", required: false },
  { id: "transfer-certificate", name: "Transfer Certificate/Character Certificate", required: false },
  { id: "medical-report", name: "Medical/Health Report", required: false },
  { id: "bonafide", name: "Bonafide Certificate", required: false },
  { id: "income-certificate", name: "Income Certificate", required: false },
  { id: "caste-certificate", name: "Caste Certificate (if applicable)", required: false },
]

export function DocumentUpload() {
  const { state, addDocument, removeDocument, setCurrentStep } = useApplicationForm()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFiles = (files: FileList) => {
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const docId = `doc-${Date.now()}-${i}`
      addDocument({
        id: docId,
        name: file.name,
        type: file.type,
        size: file.size,
        file: file,
      })
    }
    setUploading(false)
  }

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) {
      return <FileText className="w-4 h-4 text-red-500" />
    }
    return <File className="w-4 h-4 text-blue-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const uploadedDocIds = state.documents.map((d) => d.id)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
        <p className="text-gray-600">Please upload the required documents for your child</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REQUIRED_DOCUMENTS.map((doc) => (
          <div key={doc.id} className="border rounded-lg p-3 flex items-start justify-between bg-gray-50">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                <File className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                {doc.required && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                    Required
                  </span>
                )}
              </div>
            </div>
            {uploadedDocIds.includes(doc.id) && (
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                Uploaded
              </span>
            )}
          </div>
        ))}
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to upload</p>
        <p className="text-sm text-gray-600 mb-4">Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB each)</p>
        <input
          type="file"
          id="file-upload"
          onChange={handleChange}
          disabled={uploading}
          multiple
          className="hidden"
          accept=".pdf, .jpg, .jpeg, .png, .doc, .docx"
        />
        <label htmlFor="file-upload">
          <Button asChild disabled={uploading} className="bg-blue-600 hover:bg-blue-700">
            <span>{uploading ? "Uploading..." : "Select Files"}</span>
          </Button>
        </label>
      </div>

      {state.documents.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Uploaded Documents ({state.documents.length})</h3>
          <div className="space-y-2">
            {state.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Remove document"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3 pt-6">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          Previous
        </Button>
        <Button onClick={() => setCurrentStep(3)} className="bg-blue-600 hover:bg-blue-700">
          Next: Select Schools
        </Button>
      </div>
    </div>
  )
}
