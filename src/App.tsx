/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  Code2, 
  AlertCircle, 
  Activity, 
  Server, 
  Terminal,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Cpu,
  Network,
  Search,
  Bookmark,
  ChevronDown,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DOC_SECTIONS } from './constants/docs';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [activeSection, setActiveSection] = useState('summary');
  const [activeSubSection, setActiveSubSection] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['response-formats']));

  const contentRef = useRef<HTMLDivElement>(null);

  // Handle scroll synchronization
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const scrollPosition = contentRef.current.scrollTop + 100;
      
      for (const section of DOC_SECTIONS) {
        for (const sub of section.subSections) {
          const element = document.getElementById(sub.id);
          if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
            setActiveSection(section.id);
            setActiveSubSection(sub.id);
            // Auto-expand sidebar section
            setExpandedSections(prev => new Set(prev).add(section.id));
            return;
          }
        }
      }
    };

    const currentContent = contentRef.current;
    currentContent?.addEventListener('scroll', handleScroll);
    return () => currentContent?.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle deep linking
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.location.hash = id;
      setIsMobileMenuOpen(false);
    }
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery) return DOC_SECTIONS;
    const query = searchQuery.toLowerCase();
    return DOC_SECTIONS.filter(section => 
      section.title.toLowerCase().includes(query) || 
      section.subSections.some(sub => sub.title.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 border-r border-[#141414] bg-[#E4E3E0] flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0",
        !isMobileMenuOpen && "-translate-x-full"
      )}>
        <div className="p-8 border-b border-[#141414]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Terminal size={24} />
              <h1 className="font-mono font-bold text-lg tracking-tighter uppercase">Trae.Docs</h1>
            </div>
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={14} />
            <input 
              type="text" 
              placeholder="SEARCH DOCUMENTATION..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414]/5 border border-[#141414] pl-10 pr-4 py-2 text-[10px] font-mono focus:outline-none focus:bg-white transition-all"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="px-8 py-4">
            <button 
              onClick={() => setActiveSection('summary')}
              className={cn(
                "w-full flex items-center gap-3 py-2 text-sm font-medium transition-all",
                activeSection === 'summary' ? "opacity-100" : "opacity-50 hover:opacity-80"
              )}
            >
              <Shield size={16} />
              <span>Executive Summary</span>
            </button>
          </div>

          {filteredSections.map((section) => (
            <div key={section.id} className="border-t border-[#141414]/5">
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "w-full flex items-center justify-between px-8 py-4 transition-all hover:bg-[#141414]/5",
                  activeSection === section.id && "bg-[#141414]/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <section.icon size={16} className={activeSection === section.id ? "text-[#141414]" : "opacity-40"} />
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    activeSection === section.id ? "opacity-100" : "opacity-60"
                  )}>{section.title}</span>
                </div>
                <ChevronDown size={14} className={cn(
                  "transition-transform duration-200 opacity-30",
                  expandedSections.has(section.id) && "rotate-180"
                )} />
              </button>
              
              <AnimatePresence initial={false}>
                {expandedSections.has(section.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#141414]/5"
                  >
                    {section.subSections.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => scrollTo(sub.id)}
                        className={cn(
                          "w-full flex items-center justify-between pl-14 pr-8 py-3 text-[11px] transition-all group",
                          activeSubSection === sub.id ? "text-[#141414] font-bold" : "text-[#141414]/50 hover:text-[#141414]"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {completed.has(sub.id) && <CheckCircle2 size={12} className="text-green-600" />}
                          <span className={cn(
                            searchQuery && sub.title.toLowerCase().includes(searchQuery.toLowerCase()) && "bg-yellow-200"
                          )}>{sub.title}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => toggleBookmark(sub.id, e)}>
                            <Bookmark size={12} className={cn(bookmarks.has(sub.id) && "fill-current")} />
                          </button>
                          <button onClick={(e) => toggleComplete(sub.id, e)}>
                            <CheckCircle2 size={12} className={cn(completed.has(sub.id) && "fill-current")} />
                          </button>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="p-8 border-t border-[#141414] bg-[#141414]/5">
          <div className="flex items-center justify-between text-[10px] font-mono opacity-50 uppercase mb-4">
            <span>Read Progress</span>
            <span>{Math.round((completed.size / DOC_SECTIONS.reduce((acc, s) => acc + s.subSections.length, 0)) * 100)}%</span>
          </div>
          <div className="h-1 w-full bg-[#141414]/10 rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${(completed.size / DOC_SECTIONS.reduce((acc, s) => acc + s.subSections.length, 0)) * 100}%` }}
              className="h-full bg-[#141414]"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-[#E4E3E0]/80 backdrop-blur-md border-b border-[#141414] px-6 lg:px-12 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <h2 className="font-serif italic text-xl lg:text-2xl">Trae Documentation</h2>
              <p className="text-[10px] lg:text-xs font-mono opacity-50 mt-1 uppercase tracking-widest">Last Updated: Mar 13, 2026</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#141414] text-[#E4E3E0] text-[10px] font-mono uppercase">
              <Zap size={12} />
              <span>v2.4.1-stable</span>
            </div>
            <button className="p-2 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors">
              <ExternalLink size={16} />
            </button>
          </div>
        </header>

        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar"
        >
          <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12 space-y-24">
            {/* Summary Section */}
            <section id="summary" className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-serif italic text-3xl lg:text-4xl">Executive Summary</h3>
                <p className="text-lg text-[#141414]/70 leading-relaxed font-light">
                  Trae is a high-performance AI agent orchestration layer. This documentation provides a comprehensive 
                  technical breakdown of the agent resolution endpoint, designed for enterprise-grade integrations.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Latency', val: '< 200ms', icon: Zap },
                  { label: 'Uptime', val: '99.99%', icon: Activity },
                  { label: 'Security', val: 'TLS 1.3', icon: Lock }
                ].map((stat, i) => (
                  <div key={i} className="p-6 border border-[#141414] bg-white">
                    <stat.icon size={20} className="opacity-30 mb-4" />
                    <p className="text-[10px] font-mono opacity-50 uppercase mb-1">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.val}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Dynamic Sections */}
            {DOC_SECTIONS.map((section) => (
              <section key={section.id} className="space-y-12">
                <div className="flex items-center gap-4 border-b border-[#141414] pb-4">
                  <section.icon size={24} className="opacity-30" />
                  <h3 className="font-serif italic text-2xl lg:text-3xl">{section.title}</h3>
                </div>

                <div className="space-y-20">
                  {section.subSections.map((sub) => (
                    <div key={sub.id} id={sub.id} className="space-y-6 scroll-mt-32">
                      <div className="flex items-center justify-between group">
                        <h4 className="text-xl font-bold tracking-tight flex items-center gap-3">
                          <span className="text-[10px] font-mono opacity-30">#</span>
                          {sub.title}
                        </h4>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => copyToClipboard(window.location.origin + '#' + sub.id, sub.id)}
                            className="p-2 hover:bg-[#141414]/5 transition-colors"
                          >
                            {copied === sub.id ? <Check size={14} className="text-green-600" /> : <Code2 size={14} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="prose prose-sm max-w-none text-[#141414]/80 leading-relaxed">
                        {sub.content}
                      </div>

                      <div className="pt-8 border-t border-[#141414]/5 flex justify-end">
                        <button 
                          onClick={(e) => toggleComplete(sub.id, e)}
                          className={cn(
                            "flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-all",
                            completed.has(sub.id) ? "text-green-600" : "opacity-40 hover:opacity-100"
                          )}
                        >
                          {completed.has(sub.id) ? (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Completed</span>
                            </>
                          ) : (
                            <span>Mark as read</span>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Footer */}
            <footer className="pt-24 pb-12 border-t border-[#141414]/10">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3 opacity-50">
                  <Terminal size={20} />
                  <span className="font-mono text-[10px] uppercase tracking-tighter">Trae Technical Documentation © 2026</span>
                </div>
                <div className="flex gap-8 text-[10px] font-mono uppercase opacity-50">
                  <a href="#" className="hover:underline">Privacy Policy</a>
                  <a href="#" className="hover:underline">Terms of Service</a>
                  <a href="#" className="hover:underline">Support</a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-[#141414]/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
