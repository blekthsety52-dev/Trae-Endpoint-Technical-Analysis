import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Save, History, Clock, Database, Settings, Shield, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RequestHistory {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  headers: Record<string, string>;
  params: Record<string, string>;
  response: any;
  responseHeaders: Record<string, string>;
  status: number;
  duration: number;
}

export default function ApiTester() {
  const [method, setMethod] = useState('GET');
  const [region, setRegion] = useState('sg');
  const [mode, setMode] = useState('production');
  const [accept, setAccept] = useState('application/json');
  const [simulatedStatus, setSimulatedStatus] = useState(200);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [metrics, setMetrics] = useState<{ duration: number; size: string; status: number } | null>(null);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [showHeaders, setShowHeaders] = useState(false);

  const handleRun = async () => {
    setIsLoading(true);
    const startTime = performance.now();
    
    // Simulate API call latency
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400));
    
    const duration = Math.round(performance.now() - startTime);
    let mockResponse: any = {};
    let mockHeaders: Record<string, string> = {
      'Content-Type': accept,
      'X-Trae-Region': `${region}-cluster-01`,
      'X-RateLimit-Limit': '1000',
      'X-RateLimit-Remaining': Math.floor(Math.random() * 1000).toString(),
      'X-Correlation-ID': Math.random().toString(36).substring(2, 15)
    };

    if (simulatedStatus === 200) {
      mockResponse = {
        status: "success",
        data: {
          agent_id: "577a62",
          name: "Enterprise-Architect-V2",
          region: region,
          mode: mode,
          capabilities: ["code_gen", "refactor", "audit"],
          timestamp: Date.now()
        }
      };
    } else if (simulatedStatus === 400) {
      mockResponse = { error: "bad_request", message: "Invalid parameters provided" };
    } else if (simulatedStatus === 401) {
      mockResponse = { error: "unauthorized", message: "Invalid or missing API key" };
    } else if (simulatedStatus === 429) {
      mockResponse = { error: "rate_limit_exceeded", message: "Too many requests" };
      mockHeaders['Retry-After'] = '30';
    } else {
      mockResponse = { error: "internal_error", message: "An unexpected error occurred" };
    }

    if (mode === 'debug') {
      mockResponse.debug = {
        trace_id: mockHeaders['X-Correlation-ID'],
        server_load: (Math.random() * 1).toFixed(2),
        execution_time_ms: duration - 20
      };
    }

    setResponse(mockResponse);
    setResponseHeaders(mockHeaders);
    const size = (JSON.stringify(mockResponse).length / 1024).toFixed(2) + ' KB';
    setMetrics({ duration, size, status: simulatedStatus });
    
    const newHistory: RequestHistory = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      method,
      url: `https://s.trae.ai/a/577a62?region=${region}&mode=${mode}`,
      headers: { 'Accept': accept, 'X-API-Key': apiKey || '••••••••' },
      params: { region, mode },
      response: mockResponse,
      responseHeaders: mockHeaders,
      status: simulatedStatus,
      duration
    };

    setHistory(prev => [newHistory, ...prev].slice(0, 10));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="border border-[#141414] bg-white p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-mono font-bold text-xs uppercase flex items-center gap-2">
              <Settings size={14} /> Request Configuration
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono opacity-40">Method:</span>
              <span className="text-[10px] font-mono font-bold bg-[#141414] text-[#E4E3E0] px-2 py-0.5">GET</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono opacity-50 uppercase mb-2">Target Region</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-[#E4E3E0] border border-[#141414] px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#141414]"
                >
                  <option value="sg">Singapore (sg)</option>
                  <option value="us">US East (us)</option>
                  <option value="eu">Europe (eu)</option>
                  <option value="cn">China (cn)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono opacity-50 uppercase mb-2">Execution Mode</label>
                <select 
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full bg-[#E4E3E0] border border-[#141414] px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#141414]"
                >
                  <option value="production">Production</option>
                  <option value="debug">Debug</option>
                  <option value="test">Test</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono opacity-50 uppercase mb-2">Simulate Status</label>
                <select 
                  value={simulatedStatus}
                  onChange={(e) => setSimulatedStatus(Number(e.target.value))}
                  className="w-full bg-[#E4E3E0] border border-[#141414] px-3 py-2 text-xs font-mono focus:outline-none"
                >
                  <option value={200}>200 OK</option>
                  <option value={400}>400 Bad Request</option>
                  <option value={401}>401 Unauthorized</option>
                  <option value={429}>429 Too Many Requests</option>
                  <option value={500}>500 Internal Error</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono opacity-50 uppercase mb-2">Accept Header</label>
                <select 
                  value={accept}
                  onChange={(e) => setAccept(e.target.value)}
                  className="w-full bg-[#E4E3E0] border border-[#141414] px-3 py-2 text-xs font-mono focus:outline-none"
                >
                  <option value="application/json">application/json</option>
                  <option value="text/html">text/html</option>
                  <option value="application/x-yaml">application/x-yaml</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono opacity-50 uppercase mb-2 flex items-center gap-2">
                <Shield size={10} /> API Key (Optional)
              </label>
              <input 
                type="password"
                placeholder="trae_sk_••••••••••••"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-[#E4E3E0] border border-[#141414] px-3 py-2 text-xs font-mono focus:outline-none"
              />
            </div>

            <div className="pt-4">
              <button 
                onClick={handleRun}
                disabled={isLoading}
                className="w-full bg-[#141414] text-[#E4E3E0] py-4 text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#222] transition-all disabled:opacity-50 active:translate-y-0.5 active:shadow-none"
              >
                {isLoading ? (
                  <>
                    <RotateCcw size={14} className="animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Run Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Response Panel */}
        <div className="border border-[#141414] bg-[#141414] text-[#E4E3E0] flex flex-col shadow-[4px_4px_0px_0px_rgba(20,20,20,0.2)]">
          <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex gap-4">
              <button 
                onClick={() => setShowHeaders(false)}
                className={cn("text-[10px] font-mono uppercase tracking-widest transition-opacity", !showHeaders ? "opacity-100 font-bold" : "opacity-40")}
              >
                Body
              </button>
              <button 
                onClick={() => setShowHeaders(true)}
                className={cn("text-[10px] font-mono uppercase tracking-widest transition-opacity", showHeaders ? "opacity-100 font-bold" : "opacity-40")}
              >
                Headers
              </button>
            </div>
            {metrics && (
              <div className="flex gap-4 text-[10px] font-mono">
                <span className={cn(metrics.status < 400 ? "text-green-400" : "text-red-400")}>
                  {metrics.status} {metrics.status === 200 ? 'OK' : 'ERR'}
                </span>
                <span className="opacity-40">|</span>
                <span className="text-blue-400">{metrics.duration}ms</span>
                <span className="opacity-40">|</span>
                <span className="text-yellow-400">{metrics.size}</span>
              </div>
            )}
          </div>
          <div className="flex-1 p-6 font-mono text-xs overflow-auto max-h-[350px] custom-scrollbar">
            <AnimatePresence mode="wait">
              {showHeaders ? (
                <motion.div 
                  key="headers"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-2"
                >
                  {Object.entries(responseHeaders).map(([k, v]) => (
                    <div key={k} className="flex gap-4 border-b border-white/5 pb-1">
                      <span className="text-blue-400 w-32 shrink-0">{k}:</span>
                      <span className="opacity-70">{v}</span>
                    </div>
                  ))}
                  {Object.keys(responseHeaders).length === 0 && (
                    <p className="opacity-30 italic">No headers to display</p>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="body"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  {response ? (
                    <pre className="whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
                      <Database size={48} className="mb-4" />
                      <p className="italic text-sm">Awaiting execution...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="border border-[#141414] bg-white">
          <div className="px-6 py-4 border-b border-[#141414] flex justify-between items-center bg-[#141414]/5">
            <h4 className="font-mono font-bold text-xs uppercase flex items-center gap-2">
              <History size={14} /> Request History
            </h4>
            <span className="text-[10px] font-mono opacity-40 uppercase">Last 10 Requests</span>
          </div>
          <div className="divide-y divide-[#141414]/10">
            {history.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-[#141414]/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "text-[10px] font-mono px-2 py-0.5 font-bold",
                    item.status < 400 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}>{item.status}</span>
                  <div className="text-xs font-mono truncate max-w-md opacity-70 group-hover:opacity-100 transition-opacity">
                    {item.url}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-[10px] font-mono opacity-50">
                  <span className="flex items-center gap-1"><Clock size={10} /> {new Date(item.timestamp).toLocaleTimeString()}</span>
                  <span className="text-blue-600 font-bold">{item.duration}ms</span>
                  <button 
                    onClick={() => {
                      setRegion(item.params.region);
                      setMode(item.params.mode);
                      setAccept(item.headers.Accept);
                      setResponse(item.response);
                      setResponseHeaders(item.responseHeaders);
                      setMetrics({ duration: item.duration, size: (JSON.stringify(item.response).length / 1024).toFixed(2) + ' KB', status: item.status });
                    }}
                    className="text-[#141414] hover:underline uppercase font-bold opacity-100"
                  >
                    Replay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
