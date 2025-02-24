'use client'

import { Linkedin, Twitter, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#000000] p-8 md:p-12">
      <div className="mx-auto max-w-6xl text-center text-[#F2F2F2]">

        {/* Brand and Tagline Section */}
        <h4 className="text-2xl font-bold tracking-wide text-[#FE7443] mb-3">FirmOS</h4>
        <p className="text-sm text-[#CCCCCC] mb-6">
          Innovating today for a better tomorrow.
        </p>

        {/* Social Icons Section */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="group transition-transform hover:scale-110">
            <div className="rounded-full p-3 bg-[#FE8F68]/10 group-hover:bg-[#FE7443]/40 transition-colors">
              <Linkedin className="h-5 w-5 text-[#FE8F68] group-hover:text-white" />
            </div>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="group transition-transform hover:scale-110">
            <div className="rounded-full p-3 bg-[#FE8F68]/10 group-hover:bg-[#FE7443]/40 transition-colors">
              <Twitter className="h-5 w-5 text-[#FE8F68] group-hover:text-white" />
            </div>
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="group transition-transform hover:scale-110">
            <div className="rounded-full p-3 bg-[#FE8F68]/10 group-hover:bg-[#FE7443]/40 transition-colors">
              <Github className="h-5 w-5 text-[#FE8F68] group-hover:text-white" />
            </div>
          </a>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-[#666666]/40 pt-4">
          <p className="text-sm text-[#CCCCCC]">&copy; {new Date().getFullYear()} FirmOS. All rights reserved.</p>
          <p className="text-xs text-[#999999] mt-1">Ongoing Development by the Product Team</p>
        </div>
      </div>
    </footer>
  )
}
