'use client'

import { useState, useEffect } from 'react'
import { ClipboardCopy, HelpCircle, X, Sparkles, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react'

type ScriptOption = 'carousel' | 'long-form' | 'short-form' | 'vsl'

interface FormData {
  title: string
  type: string
  targetAudience: string
  tone: string
  duration: string
  keyPoints: string
  callToAction: string
}

export default function VideoScriptGenerator() {
  const [option, setOption] = useState<ScriptOption>('long-form')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [wordCount] = useState(0)

  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: '',
    targetAudience: '',
    tone: '',
    duration: '',
    keyPoints: '',
    callToAction: '',
  })

  const [promptResult, setPromptResult] = useState('')

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 10))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isGenerating])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRunPrompt = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setPromptResult('Your generated script will appear here...')
      setIsGenerating(false)
      setProgress(0)
    }, 5000)
  }

  const handleCreateNew = () => {
    setFormData({
      title: '',
      type: '',
      targetAudience: '',
      tone: '',
      duration: '',
      keyPoints: '',
      callToAction: '',
    })
    setPromptResult('')
    setOption('long-form')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promptResult)
  }

  const options: { label: string; value: ScriptOption }[] = [
    { label: 'Carousel Content', value: 'carousel' },
    { label: 'Long Form Content', value: 'long-form' },
    { label: 'Short Form Content', value: 'short-form' },
    { label: 'VSL Script', value: 'vsl' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-black p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header with Glassmorphism */}
        <div className="mb-8 rounded-2xl bg-white bg-opacity-10 p-8 backdrop-blur-lg">
          <div className="relative inline-block">
            <h1 className="bg-gradient-to-r from-orange-400 to-orange-200 bg-clip-text text-5xl font-bold text-transparent">
              Video Script Generator
            </h1>
            <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-orange-400 to-orange-200"></div>
          </div>
        </div>

        {/* Main Container with Glassmorphism */}
        <div className="relative rounded-2xl bg-white bg-opacity-10 p-8 shadow-2xl backdrop-blur-lg">
          {/* Help Icon */}
          <div className="absolute right-4 top-4 z-50">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowHelpModal(true)}
              className="group relative transition-transform hover:scale-110"
            >
              <div className="rounded-full bg-orange-400 bg-opacity-20 p-2 backdrop-blur-sm">
                <HelpCircle className="h-6 w-6 text-orange-400" />
              </div>
              {showTooltip && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-lg bg-black bg-opacity-80 p-2 text-center text-sm text-white backdrop-blur-sm">
                  Need help?
                  <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-black bg-opacity-80"></div>
                </div>
              )}
            </button>
          </div>

          {/* Option Dropdown with Enhanced Styling */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-white text-opacity-80">Script Type:</label>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="group flex w-full items-center justify-between rounded-xl border border-white border-opacity-20 bg-black bg-opacity-40 px-6 py-3 text-white backdrop-blur-sm transition-all hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-400" />
                  {options.find(opt => opt.value === option)?.label}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-orange-400 transition-transform duration-200 ${
                    showDropdown ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {showDropdown && (
                <div className="absolute z-40 mt-2 w-full rounded-xl border border-white border-opacity-20 bg-black bg-opacity-90 py-2 backdrop-blur-lg">
                  {options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setOption(opt.value)
                        setShowDropdown(false)
                      }}
                      className="flex w-full items-center gap-2 px-6 py-3 text-left text-white transition-colors hover:bg-orange-400 hover:bg-opacity-20"
                    >
                      <Sparkles className="h-4 w-4 text-orange-400" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Form Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            {Object.entries(formData).map(([field, value]) => (
              <div key={field} className="group relative">
                <label
                  htmlFor={field}
                  className="mb-2 block text-sm font-medium capitalize text-white text-opacity-80"
                >
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {field === 'keyPoints' ? (
                  <textarea
                    id={field}
                    value={value}
                    onChange={e => handleInputChange(field as keyof FormData, e.target.value)}
                    className="h-32 w-full rounded-xl border border-white border-opacity-20 bg-black bg-opacity-40 px-4 py-3 text-white placeholder-white placeholder-opacity-40 backdrop-blur-sm transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                  />
                ) : (
                  <input
                    id={field}
                    type="text"
                    value={value}
                    onChange={e => handleInputChange(field as keyof FormData, e.target.value)}
                    className="w-full rounded-xl border border-white border-opacity-20 bg-black bg-opacity-40 px-4 py-3 text-white placeholder-white placeholder-opacity-40 backdrop-blur-sm transition-all focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                  />
                )}
                <div className="absolute right-4 top-10 hidden text-sm text-white text-opacity-60 group-focus-within:block">
                  {field === 'keyPoints' ? `${wordCount}/500 words` : ''}
                </div>
              </div>
            ))}
          </div>

          {/* Run Prompt Button with Progress */}
          <div className="mb-8 flex justify-center">
            <button
              onClick={handleRunPrompt}
              disabled={isGenerating}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-orange-400 to-orange-300 px-12 py-4 font-medium text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Script
                  </>
                )}
              </span>
              {isGenerating && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-20 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          </div>

          {/* Prompt Result with Enhanced Styling */}
          <div className="relative rounded-xl border border-white border-opacity-20 bg-black bg-opacity-40 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Generated Script</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="rounded-lg p-2 text-white text-opacity-60 transition-colors hover:bg-white hover:bg-opacity-10 focus:outline-none"
                >
                  <ClipboardCopy className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="min-h-[200px] rounded-lg border border-white border-opacity-20 bg-black bg-opacity-20 p-4 text-white text-opacity-80">
              {promptResult || 'Your generated script will appear here...'}
            </div>
            {!promptResult && (
              <div className="mt-4 flex items-center gap-2 text-sm text-white text-opacity-60">
                <AlertCircle className="h-4 w-4" />
                Fill in the form above and click &quot;Generate Script&quot; to create your video script
              </div>
            )}
          </div>

          {/* Create New Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCreateNew}
              className="rounded-lg border border-orange-400 px-6 py-2 text-orange-400 transition-all hover:bg-orange-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            >
              Create New Script
            </button>
          </div>
        </div>
      </div>

      {/* Help Modal with Enhanced Styling */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white border-opacity-20 bg-black bg-opacity-90 p-8 backdrop-blur-lg">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-white text-opacity-60 transition-colors hover:bg-white hover:bg-opacity-10"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="mb-6 text-2xl font-bold text-white">How to Use Video Script Generator</h2>
            <div className="space-y-4 text-white text-opacity-80">
              <p>Follow these steps to generate your perfect video script:</p>
              <ol className="list-decimal space-y-4 pl-4">
                <li>
                  <strong className="text-orange-400">Select Script Type:</strong> Choose between Carousel,
                  Long Form, Short Form, or VSL Script based on your content needs
                </li>
                <li>
                  <strong className="text-orange-400">Fill in Details:</strong>
                  <ul className="mt-2 list-disc pl-4 text-white text-opacity-60">
                    <li>Video Title - The main topic or subject of your video</li>
                    <li>Video Type - The style or format (educational, promotional, etc.)</li>
                    <li>Target Audience - Who your content is aimed at</li>
                    <li>Tone - The style of communication (professional, casual, etc.)</li>
                    <li>Duration - Estimated length of the video</li>
                    <li>Key Points - Main messages or topics to cover</li>
                    <li>Call to Action - What you want viewers to do after watching</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-orange-400">Generate Script:</strong> Click the &quot;Generate
                  Script&quot; button and wait for your customized script
                </li>
                <li>
                  <strong className="text-orange-400">Review & Copy:</strong> Use the copy button to
                  save your script to clipboard
                </li>
              </ol>
              <div className="mt-6 rounded-lg bg-orange-400 bg-opacity-20 p-4">
                <p className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-orange-400" />
                  Pro tip: Be specific with your key points and target audience for better results
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

