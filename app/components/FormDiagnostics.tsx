"use client"

import { useState, useEffect } from 'react'
import { isSupabaseConfigured, checkSupabaseAccess } from '@/lib/supabase'

// Log all items
interface LogItem {
  id: string;
  timestamp: Date;
  event: string;
  data?: any;
  level: 'info' | 'warn' | 'error';
}

type DiagnosticsTab = 'logs' | 'supabase';

// Component for monitoring form submissions and API interactions
export const FormDiagnostics = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<LogItem[]>([])
  const [isEnabled, setIsEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState<DiagnosticsTab>('logs')
  const [supabaseStatus, setSupabaseStatus] = useState({
    configured: false,
    connected: false,
    checking: false
  })

  // Function to add a log entry
  const addLog = (event: string, data?: any, level: 'info' | 'warn' | 'error' = 'info') => {
    if (!isEnabled) return;
    
    const newLog: LogItem = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date(),
      event,
      data,
      level
    }
    
    setLogs(prev => [newLog, ...prev].slice(0, 50)) // Keep only the last 50 logs
  }

  // Check Supabase status when opened
  useEffect(() => {
    if (!isOpen) return;
    
    const checkSupabase = async () => {
      setSupabaseStatus(prev => ({ ...prev, checking: true }));
      const configured = isSupabaseConfigured();
      setSupabaseStatus(prev => ({ ...prev, configured }));
      
      if (configured) {
        try {
          const access = await checkSupabaseAccess();
          setSupabaseStatus(prev => ({ ...prev, connected: access, checking: false }));
        } catch (error) {
          setSupabaseStatus(prev => ({ ...prev, connected: false, checking: false }));
        }
      } else {
        setSupabaseStatus(prev => ({ ...prev, checking: false }));
      }
    };
    
    checkSupabase();
  }, [isOpen]);

  // Intercept console logs when active
  useEffect(() => {
    if (!isEnabled) return;
    
    // Save original console methods
    const originalConsoleLog = console.log
    const originalConsoleWarn = console.warn
    const originalConsoleError = console.error
    
    // Override console methods
    console.log = (...args) => {
      originalConsoleLog(...args)
      addLog('console.log', args)
    }
    
    console.warn = (...args) => {
      originalConsoleWarn(...args)
      addLog('console.warn', args, 'warn')
    }
    
    console.error = (...args) => {
      originalConsoleError(...args)
      addLog('console.error', args, 'error')
    }
    
    // Also intercept fetch calls
    const originalFetch = window.fetch
    window.fetch = async (input, init) => {
      addLog('fetch.request', {
        url: typeof input === 'string' ? input : input instanceof URL ? input.toString() : 'Request object',
        method: init?.method || 'GET',
      })
      
      try {
        const response = await originalFetch(input, init)
        
        // Clone the response to log it without consuming it
        const clonedResponse = response.clone()
        
        try {
          const responseData = await clonedResponse.json()
          addLog('fetch.response', {
            url: typeof input === 'string' ? input : input instanceof URL ? input.toString() : 'Request object',
            status: response.status,
            data: responseData
          }, response.ok ? 'info' : 'error')
        } catch (e) {
          addLog('fetch.response', {
            url: typeof input === 'string' ? input : input instanceof URL ? input.toString() : 'Request object',
            status: response.status,
            text: await response.clone().text()
          }, response.ok ? 'info' : 'error')
        }
        
        return response
      } catch (error) {
        addLog('fetch.error', {
          url: typeof input === 'string' ? input : input instanceof URL ? input.toString() : 'Request object',
          error: error instanceof Error ? error.message : String(error)
        }, 'error')
        throw error
      }
    }
    
    // Restore on cleanup
    return () => {
      console.log = originalConsoleLog
      console.warn = originalConsoleWarn
      console.error = originalConsoleError
      window.fetch = originalFetch
    }
  }, [isEnabled])

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-zinc-800 text-white shadow-lg"
        aria-label="Open diagnostics"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-light text-white">Form Diagnostics</h2>
          <div className="flex gap-4 items-center">
            <label className="flex items-center space-x-2 text-sm text-zinc-300">
              <input 
                type="checkbox" 
                checked={isEnabled} 
                onChange={e => setIsEnabled(e.target.checked)} 
                className="rounded border-zinc-600 bg-zinc-800 text-[#a4c2c2] focus:ring-[#a4c2c2]/20"
              />
              <span>Enable Monitoring</span>
            </label>
            <button 
              onClick={() => setLogs([])} 
              className="px-3 py-1 rounded bg-zinc-800 text-white text-sm hover:bg-zinc-700 transition-colors"
            >
              Clear
            </button>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-zinc-800">
          <div className="flex">
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 text-sm ${
                activeTab === 'logs' 
                  ? 'text-white border-b-2 border-[#a4c2c2]' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Console Logs
            </button>
            <button
              onClick={() => setActiveTab('supabase')}
              className={`px-4 py-2 text-sm ${
                activeTab === 'supabase' 
                  ? 'text-white border-b-2 border-[#a4c2c2]' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Supabase
            </button>
          </div>
        </div>
        
        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="flex-1 overflow-auto p-4 font-mono text-sm">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500">
                {isEnabled ? 'Monitoring active. No logs yet.' : 'Enable monitoring to start capturing logs.'}
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map(log => (
                  <div 
                    key={log.id} 
                    className={`p-2 rounded ${
                      log.level === 'error' ? 'bg-red-900/20 border border-red-800/30' :
                      log.level === 'warn' ? 'bg-yellow-900/20 border border-yellow-800/30' :
                      'bg-zinc-800/40 border border-zinc-700/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold ${
                        log.level === 'error' ? 'text-red-400' :
                        log.level === 'warn' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {log.event}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="text-xs overflow-auto max-h-40 text-zinc-300">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Supabase Tab */}
        {activeTab === 'supabase' && (
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Supabase Connection Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/40">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300">Configuration</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        supabaseStatus.configured 
                          ? 'bg-green-900/30 text-green-400 border border-green-800/30' 
                          : 'bg-red-900/30 text-red-400 border border-red-800/30'
                      }`}>
                        {supabaseStatus.configured ? 'Configured' : 'Not Configured'}
                      </span>
                    </div>
                  </div>
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/40">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-300">Connection</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        supabaseStatus.checking
                          ? 'bg-blue-900/30 text-blue-400 border border-blue-800/30'
                          : supabaseStatus.connected 
                            ? 'bg-green-900/30 text-green-400 border border-green-800/30' 
                            : 'bg-red-900/30 text-red-400 border border-red-800/30'
                      }`}>
                        {supabaseStatus.checking 
                          ? 'Checking...' 
                          : supabaseStatus.connected 
                            ? 'Connected' 
                            : 'Not Connected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Supabase Information</h3>
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/40">
                  <div className="space-y-2">
                    <div className="flex flex-col">
                      <span className="text-zinc-400 text-sm">Tables</span>
                      <span className="text-zinc-200">waitlist, custom_emails</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-400 text-sm">Row-Level Security</span>
                      <span className="text-zinc-200">
                        {supabaseStatus.connected 
                          ? "Configured correctly (inserts allowed)" 
                          : "Not configured or preventing operations"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-400 text-sm">Local Fallback</span>
                      <span className="text-zinc-200">Enabled (data will be stored locally if Supabase is unavailable)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Test Connection</h3>
                  <button 
                    onClick={async () => {
                      setSupabaseStatus(prev => ({ ...prev, checking: true }));
                      const access = await checkSupabaseAccess();
                      setSupabaseStatus(prev => ({ ...prev, connected: access, checking: false }));
                    }}
                    className="px-3 py-1 rounded bg-[#a4c2c2] text-zinc-900 text-sm hover:bg-[#93afaf] transition-colors"
                  >
                    Test Now
                  </button>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/40">
                  <p className="text-zinc-300 text-sm">
                    {supabaseStatus.checking 
                      ? "Testing connection..." 
                      : supabaseStatus.connected 
                        ? "✓ Connection successful! The application can access Supabase tables." 
                        : supabaseStatus.configured 
                          ? "⚠️ Configuration found but connection failed. Check your Supabase setup and RLS policies." 
                          : "❌ Supabase is not configured. Data will be stored locally only."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormDiagnostics 