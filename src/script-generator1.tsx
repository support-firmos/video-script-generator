// 'use client'

// import { useState, useEffect } from 'react'
// import { ClipboardCopy, HelpCircle, X, Sparkles, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react'

// type ScriptOption = 'carousel' | 'long-form' | 'short-form' | 'vsl'

// interface FormData {
//   title: string;
//   type: string;
//   targetAudience: string;
//   tone: string;
//   duration: string;
//   keyPoints: string;
//   callToAction: string;
// }

// export default function VideoScriptGenerator() {
//   const [option, setOption] = useState<ScriptOption>('long-form');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showHelpModal, setShowHelpModal] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [charCount, setCharCount] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [copyMessage, setCopyMessage] = useState('');

//   const [formData, setFormData] = useState<FormData>({
//     title: '',
//     type: '',
//     targetAudience: '',
//     tone: '',
//     duration: '',
//     keyPoints: '',
//     callToAction: '',
//   });

//   const [promptResult, setPromptResult] = useState('');

//   useEffect(() => {
//     if (isGenerating) {
//       const interval = setInterval(() => {
//         setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
//       }, 500);
//       return () => clearInterval(interval);
//     }
//   }, [isGenerating]);

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));

//     // Update character count for keyPoints
//     if (field === 'keyPoints') {
//       setCharCount(value.length); // Count characters
//     }
//   };

//   const validateFormData = () => {
//     return Object.values(formData).every((value) => value.trim() !== '');
//   };

//   const handleRunPrompt = async () => {
//     if (!validateFormData()) {
//       setError('Please fill in all fields before generating the script.');
//       return;
//     }

//     console.log("Starting script generation...");
//     setIsGenerating(true);
//     setError(null);
//     setPromptResult(''); // Clear the previous result
  
//     try {
//       // Use a relative path to ensure compatibility between development and production
//       const response = await fetch('/api/getPoem', { 
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title: formData.title,
//           type: formData.type,
//           targetAudience: formData.targetAudience,
//           tone: formData.tone,
//           duration: formData.duration,
//           keyPoints: formData.keyPoints,
//           callToAction: formData.callToAction,
//           scriptOption: option,
//         }),
//       });
  
//       console.log('Fetch response:', response); // Log the fetch response
  
//       if (!response.ok) {
//         throw new Error(`Failed to generate script: ${response.statusText}`);
//       }
  
//       const data = await response.json();
//       console.log('Response data:', data); // Logging response to verify
  
//       // Set promptResult if content is available, otherwise show warning
//       if (data && data.content) {
//         console.log('Setting prompt result:', data.content);
//         setPromptResult(data.content);
//       } else {
//         console.warn('Unexpected response format', data);
//         setPromptResult('No content generated.');
//       }
//     } catch (err) {
//       console.error('Error generating script:', err);
//       if (err instanceof Error) {
//         setError(`Failed to generate script: ${err.message}`);
//       } else {
//         setError('Failed to generate script: An unexpected error occurred.');
//       }
//     } finally {
//       setIsGenerating(false);
//       setProgress(0);
//     }
//   };

//   const handleCreateNew = () => {
//     setFormData({
//       title: '',
//       type: '',
//       targetAudience: '',
//       tone: '',
//       duration: '',
//       keyPoints: '',
//       callToAction: '',
//     });
//     setPromptResult('');
//     setOption('long-form');
//     setError(null);
//   };

//   const copyToClipboard = () => {
//     if (promptResult) {
//       navigator.clipboard.writeText(promptResult);
//       setCopyMessage('Copied to clipboard!');
      
//       // Hide the message after 2 seconds
//       setTimeout(() => {
//         setCopyMessage('');
//       }, 2000);
//     }
//   };

//   const options: { label: string; value: ScriptOption }[] = [
//     { label: 'Carousel Content', value: 'carousel' },
//     { label: 'Long Form Content', value: 'long-form' },
//     { label: 'Short Form Content', value: 'short-form' },
//     { label: 'VSL Script', value: 'vsl' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#323232] to-[#000000] p-6">
//       <div className="mx-auto max-w-5xl">
//         {/* Header with Glassmorphism */}
//         <div className="mb-8 rounded-2xl bg-white/10 p-8 backdrop-blur-lg">
//           <div className="relative inline-block">
//             <h1 className="bg-gradient-to-r from-[#FE7443] to-[#FEC7B3] bg-clip-text text-5xl font-bold text-transparent">
//               Video Script Generator
//             </h1>
//             <div className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-[#FE7443] to-[#FEC7B3]"></div>
//           </div>
//         </div>

//         {/* Main Container with Glassmorphism */}
//         <div className="relative rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
//           {/* Help Icon - Fixed z-index issue */}
//           <div className="absolute right-4 top-4 z-50">
//             <button
//               onMouseEnter={() => setShowTooltip(true)}
//               onMouseLeave={() => setShowTooltip(false)}
//               onClick={() => setShowHelpModal(true)}
//               className="group relative transition-transform hover:scale-110"
//             >
//               <div className="rounded-full bg-[#FE7443]/20 p-2 backdrop-blur-sm">
//                 <HelpCircle className="h-6 w-6 text-[#FE7443]" />
//               </div>
//               {showTooltip && (
//                 <div className="absolute right-0 top-full mt-2 w-32 rounded-lg bg-black/80 p-2 text-center text-sm text-white backdrop-blur-sm">
//                   Need help?
//                   <div className="absolute -top-1 right-4 h-2 w-2 rotate-45 bg-black/80"></div>
//                 </div>
//               )}
//             </button>
//           </div>

//           {/* Option Dropdown with Enhanced Styling */}
//           <div className="mb-8">
//             <label className="mb-2 block text-sm font-medium text-white/80">Script Type:</label>
//             <div className="relative">
//               <button
//                 onClick={() => setShowDropdown(!showDropdown)}
//                 className="group flex w-full items-center justify-between rounded-xl border border-white/20 bg-black/40 px-6 py-3 text-white backdrop-blur-sm transition-all hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[#FE7443]"
//               >
//                 <span className="flex items-center gap-2">
//                   <Sparkles className="h-5 w-5 text-[#FE7443]" />
//                   {options.find(opt => opt.value === option)?.label}
//                 </span>
//                 <ChevronDown
//                   className={`h-5 w-5 text-[#FE7443] transition-transform duration-200 ${
//                     showDropdown ? 'rotate-180' : ''
//                   }`}
//                 />
//               </button>
//               {showDropdown && (
//                 <div className="absolute z-40 mt-2 w-full rounded-xl border border-white/20 bg-black/90 py-2 backdrop-blur-lg">
//                   {options.map(opt => (
//                     <button
//                       key={opt.value}
//                       onClick={() => {
//                         setOption(opt.value);
//                         setShowDropdown(false);
//                       }}
//                       className="flex w-full items-center gap-2 px-6 py-3 text-left text-white transition-colors hover:bg-[#FE7443]/20"
//                     >
//                       <Sparkles className="h-4 w-4 text-[#FE7443]" />
//                       {opt.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Enhanced Form Grid */}
//           <div className="mb-8 grid gap-6 md:grid-cols-2">
//             {Object.entries(formData).map(([field, value]) => (
//               <div key={field} className="group relative">
//                 <label
//                   htmlFor={field}
//                   className="mb-2 block text-sm font-medium capitalize text-white/80"
//                 >
//                   {field.replace(/([A-Z])/g, ' $1').trim()}
//                 </label>
//                 {field === 'keyPoints' ? (
//                   <textarea
//                     id={field}
//                     value={value}
//                     onChange={e => handleInputChange(field as keyof FormData, e.target.value)}
//                     className="h-32 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-[#FE7443] focus:outline-none focus:ring-2 focus:ring-[#FE7443]"
//                     placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
//                   />
//                 ) : (
//                   <input
//                     id={field}
//                     type="text"
//                     value={value}
//                     onChange={e => handleInputChange(field as keyof FormData, e.target.value)}
//                     className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-[#FE7443] focus:outline-none focus:ring-2 focus:ring-[#FE7443]"
//                     placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}`}
//                   />
//                 )}
//                 {field === 'keyPoints' && (
//                   <div className="absolute right-4 top-10 text-sm text-white/60">
//                     {`${charCount}/500 characters`}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//    {/* Error Message */}
// {error && (
//   <div className="mb-6 p-4 rounded-md bg-red-500 text-white text-center shadow-md">
//     <p>{error}</p>
//   </div>
// )}


//           {/* Run Prompt Button with Progress */}
//           <div className="mb-8 flex justify-center">
//             <button
//               onClick={handleRunPrompt}
//               disabled={isGenerating}
//               className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#FE7443] to-[#FEAB8E] px-12 py-4 font-medium text-white transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#FE7443] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               <span className="flex items-center gap-2">
//                 {isGenerating ? (
//                   <>
//                     <RefreshCw className="h-5 w-5 animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="h-5 w-5" />
//                     Generate Script
//                   </>
//                 )}
//               </span>
//               {isGenerating && (
//                 <div
//                   className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-500"
//                   style={{ width: `${progress}%` }}
//                 />
//               )}
//             </button>
//           </div>

//           {/* Prompt Result with Enhanced Styling */}
//           <div className="relative rounded-xl border border-white/20 bg-black/40 p-6 backdrop-blur-sm">
//             <div className="mb-4 flex items-center justify-between">
//               <h2 className="text-lg font-medium text-white">Generated Script</h2>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={copyToClipboard}
//                   className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 focus:outline-none"
//                 >
//                   <ClipboardCopy className="h-5 w-5" />
//                 </button>
//                 {copyMessage && (
//                   <span className="text-sm text-green-500">{copyMessage}</span>
//                 )}
//               </div>
//             </div>
//             <pre className="min-h-[200px] rounded-lg border border-white/20 bg-black/20 p-4 text-white/80 overflow-auto">
//               {promptResult !== '' ? promptResult : 'Your generated script will appear here...'}
//             </pre>

//             {!promptResult && (
//               <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
//                 <AlertCircle className="h-4 w-4" />
//                 Fill in the form above and click &quot;Generate Script&quot; to create your video script
//               </div>
//             )}
//           </div>

//           {/* Create New Button */}
//           <div className="mt-6 flex justify-end">
//             <button
//               onClick={handleCreateNew}
//               className="rounded-lg border border-[#FE7443] px-6 py-2 text-[#FE7443] transition-all hover:bg-[#FE7443] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#FE7443] focus:ring-offset-2"
//             >
//               Create New Script
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Help Modal with Enhanced Styling */}
//       {showHelpModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//           <div className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-black/90 p-8 backdrop-blur-lg">
//             <button
//               onClick={() => setShowHelpModal(false)}
//               className="absolute right-4 top-4 rounded-lg p-1 text-white/60 transition-colors hover:bg-white/10"
//             >
//               <X className="h-6 w-6" />
//             </button>
//             <h2 className="mb-6 text-2xl font-bold text-white">How to Use Video Script Generator</h2>
//             <div className="space-y-4 text-white/80">
//               <p>Follow these steps to generate your perfect video script:</p>
//               <ol className="list-decimal space-y-4 pl-4">
//                 <li>
//                   <strong className="text-[#FE7443]">Select Script Type:</strong> Choose between Carousel,
//                   Long Form, Short Form, or VSL Script based on your content needs
//                 </li>
//                 <li>
//                   <strong className="text-[#FE7443]">Fill in Details:</strong>
//                   <ul className="mt-2 list-disc pl-4 text-white/60">
//                     <li>Video Title - The main topic or subject of your video</li>
//                     <li>Video Type - The style or format (educational, promotional, etc.)</li>
//                     <li>Target Audience - Who your content is aimed at</li>
//                     <li>Tone - The style of communication (professional, casual, etc.)</li>
//                     <li>Duration - Estimated length of the video</li>
//                     <li>Key Points - Main messages or topics to cover</li>
//                     <li>Call to Action - What you want viewers to do after watching</li>
//                   </ul>
//                 </li>
//                 <li>
//                   <strong className="text-[#FE7443]">Generate Script:</strong> Click the &quot;Generate
//                   Script&quot; button and wait for your customized script
//                 </li>
//                 <li>
//                   <strong className="text-[#FE7443]">Review & Copy:</strong> Use the copy button to
//                   save your script to clipboard
//                 </li>
//               </ol>
//               <div className="mt-6 rounded-lg bg-[#FE7443]/20 p-4">
//                 <p className="flex items-center gap-2 text-sm">
//                   <AlertCircle className="h-4 w-4 text-[#FE7443]" />
//                   Pro tip: Be specific with your key points and target audience for better results
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
