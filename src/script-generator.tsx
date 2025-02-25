'use client'

import { useState, useEffect } from 'react'
import { ClipboardCopy, HelpCircle, X, Sparkles, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react'

type ScriptOption = 'carousel' | 'long-form' | 'short-form' | 'vsl'

interface FormData {
  title: string;
  type: string;
  targetAudience: string;
  tone: string;
  duration: string;
  keyPoints: string;
  callToAction: string;
}

export default function VideoScriptGenerator() {
  const [option, setOption] = useState<ScriptOption>('long-form');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [, setCharCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    type: '',
    targetAudience: '',
    tone: '',
    duration: '',
    callToAction: '',
    keyPoints: '',
  });

  const [promptResult, setPromptResult] = useState('');

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
      }, 500); // we should not exceed 1000
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Update character count for keyPoints
    if (field === 'keyPoints') {
      setCharCount(value.length); // Count characters
    }
  };

  const validateFormData = () => {
    return Object.values(formData).every((value) => value.trim() !== '');
  };

  const handleRunPrompt = async () => {
    if (!validateFormData()) {
      setError('Please fill in all fields before generating the script.');
      return;
    }

    console.log("Starting script generation...");
    setIsGenerating(true);
    setError(null);
    setPromptResult(''); // Clear the previous result
  
    try {
      // Use a relative path to ensure compatibility between development and production
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch('/api/getPoem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          title: formData.title,
          type: formData.type,
          targetAudience: formData.targetAudience,
          tone: formData.tone,
          duration: formData.duration,
          keyPoints: formData.keyPoints,
          callToAction: formData.callToAction,
          scriptOption: option,
        }),
      });
      clearTimeout(timeoutId);
  
      console.log('Fetch response:', response); // Log the fetch response
  
      if (!response.ok) {
        throw new Error(`Failed to generate script: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Response data:', data); // Logging response to verify
  
      // Set promptResult if content is available, otherwise show warning
      if (data && data.content) {
        console.log('Setting prompt result:', data.content);
        setPromptResult(data.content);
      } else {
        console.warn('Unexpected response format', data);
        setPromptResult('No content generated.');
      }
    } catch (err) {
      console.error('Error generating script:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please try again with a shorter script request.');
      } else if (err instanceof Error) {
        setError(`Failed to generate script: ${err.message}`);
      } else {
        setError('Failed to generate script: An unexpected error occurred.');
      }
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleCreateNew = () => {
    setFormData({
      title: '',
      type: '',
      targetAudience: '',
      tone: '',
      duration: '',
      callToAction: '',
      keyPoints: '',
    });
    setPromptResult('');
    setOption('long-form');
    setError(null);
  };

  const copyToClipboard = () => {
    if (promptResult) {
      navigator.clipboard.writeText(promptResult);
      setCopyMessage('Copied to clipboard!');
      
      setTimeout(() => {
        setCopyMessage('');
      }, 5000);
    }
  };

  const options: { label: string; value: ScriptOption }[] = [
    { label: 'Carousel Content', value: 'carousel' },
    { label: 'Long Form Content', value: 'long-form' },
    { label: 'Short Form Content', value: 'short-form' },
    { label: 'VSL Script', value: 'vsl' },
  ];

  return (

    <div className="min-h-screen p-6">
  <div className="mx-auto max-w-7xl">
    {/* Header with Help Icon */}
    <div className="mb-8 flex justify-center items-center rounded-2xl">
      <div className="relative inline-block">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7f8f8] pt-5">
          Video Script Generator
          <sup className="ml-2 text-sm">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowHelpModal(true)}
              className="transition-transform hover:scale-110"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-6 mt-2 w-40 rounded-lg background p-2 text-center text-sm text-white backdrop-blur-sm">
                Need help?
                <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 background"></div>
              </div>
            )}
          </sup>
        </h1>
      </div>
    </div>

    {/* Main Two-Column Layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Input Fields */}
      <div
        className="card p-7"
      >
        {/* Script Type Dropdown */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-medium text-white/80">Script Type</label>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="group flex w-full items-center justify-between rounded-xl border border-white/20 bg-[#141414] px-6 py-3 text-white backdrop-blur-sm transition-all hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#f7f8f8]/20"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#28a745]" />
                {options.find(opt => opt.value === option)?.label}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-[#28a745] transition-transform duration-200 ${
                  showDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>
            {showDropdown && (
              <div className="absolute z-40 mt-2 w-full rounded-xl border border-white/20 bg-[#141414] py-2 backdrop-blur-lg">
                {options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setOption(opt.value);
                      setShowDropdown(false);
                    }}
                    className="flex w-full items-center gap-2 px-6 py-3 text-left text-white transition-colors hover:bg-[#FE7443]/20"
                  >
                    <Sparkles className="h-4 w-4 text-[#28a745]" />
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(formData).map(([field, value]) => (
            <div key={field} className={`group relative ${field === 'keyPoints' ? 'col-span-2' : 'col-span-1'}`}>
              <label
                htmlFor={field}
                className="mb-2 block text-sm font-medium capitalize text-white/80"
              >
                {field === "type" ? "Video Type" : field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              {field === 'keyPoints' ? (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/60">
                      {`${formData.keyPoints.length}/500 characters`}
                    </span>
                  </div>
                  <textarea
                    id="keyPoints"
                    value={formData.keyPoints}
                    onChange={e => handleInputChange('keyPoints', e.target.value)}
                    className="h-32 w-full rounded-xl border border-white/20 bg-[#141414] px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#f7f8f8]/20"
                    placeholder="Enter key points"
                    maxLength={500} // Character limit
                  />
                </div>
              ) : (
                <input
                  id={field}
                  type="text"
                  value={value}
                  onChange={e => handleInputChange(field as keyof FormData, e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-[#141414] px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#f7f8f8]/20"
                  placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 mb-6 p-4 rounded-md bg-red-500 text-white text-center shadow-md">
            <p>{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleRunPrompt}
            disabled={isGenerating}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#28a745] to-[#28a745] px-12 py-4 font-medium text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#f7f8f8]/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        </div>

        {/* Create New Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCreateNew}
            className="rounded-lg border px-6 py-2 transition-all hover:bg-[#28a745] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#f7f8f8]/20 focus:ring-offset-2"
          >
            Create New Script
          </button>
        </div>
      </div>

      {/* Right Column: Generated Script */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Generated Script</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 focus:outline-none"
            >
              <ClipboardCopy className="h-5 w-5" />
            </button>
            {copyMessage && (
              <span className="text-sm text-green-500">{copyMessage}</span>
            )}
          </div>
        </div>
        <pre className="min-h-[400px] rounded-lg border border-white/20 bg-black/20 p-4 text-white/80 overflow-auto">
          {promptResult !== '' ? promptResult : 'Your generated script will appear here...'}
        </pre>
      </div>
    </div>
  </div>




      {/* Help Modal with Enhanced Styling */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-black/90 p-8 backdrop-blur-lg">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-white/60 transition-colors hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="mb-6 text-2xl font-bold text-white">How to Use Video Script Generator</h2>
            <div className="space-y-4 text-white/80">
              <p>Follow these steps to generate your perfect video script:</p>
              <ol className="list-decimal space-y-4 pl-4">
                <li>
                  <strong className="text-[#28a745]">Select Script Type:</strong> Choose between Carousel,
                  Long Form, Short Form, or VSL Script based on your content needs
                </li>
                <li>
                  <strong className="text-[#28a745]">Fill in Details:</strong>
                  <ul className="mt-2 list-disc pl-4 text-white/60">
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
                  <strong className="text-[#28a745]">Generate Script:</strong> Click the &quot;Generate
                  Script&quot; button and wait for your customized script
                </li>
                <li>
                  <strong className="text-[#28a745]">Review & Copy:</strong> Use the copy button to
                  save your script to clipboard
                </li>
              </ol>
              <div className="mt-6 rounded-lg bg-[#FE7443]/20 p-4">
                <p className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 " />
                  Pro tip: Be specific with your key points and target audience for better results
                </p>
              </div>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
}
