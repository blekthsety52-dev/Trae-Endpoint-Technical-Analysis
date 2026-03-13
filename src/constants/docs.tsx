import React from 'react';
import { 
  FileJson, 
  ArrowRightLeft, 
  Settings2, 
  Terminal, 
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  ShieldCheck
} from 'lucide-react';
import ApiTester from '../components/ApiTester';
import { DocSection } from '../types/docs';

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'response-formats',
    title: 'Response Formats & Status Codes',
    icon: FileJson,
    subSections: [
      {
        id: 'json-schema',
        title: 'JSON Schema (200 OK)',
        content: (
          <div className="space-y-4">
            <p className="text-sm opacity-80">The standard success response follows a strict JSON schema designed for deterministic parsing across all enterprise clients.</p>
            <div className="bg-[#141414] text-[#E4E3E0] p-6 font-mono text-xs rounded-sm overflow-x-auto">
              <pre>{`{
  "status": "string", // "success" | "error"
  "data": {
    "agent_id": "string", // Unique identifier
    "name": "string",
    "capabilities": ["string"],
    "endpoint": "string (url)",
    "metadata": {
      "version": "string",
      "region": "string"
    }
  },
  "timestamp": "number (unix)"
}`}</pre>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 border border-[#141414]/10 bg-white">
                <h5 className="font-bold text-xs uppercase mb-2 flex items-center gap-2"><Clock size={14}/> Benchmarks</h5>
                <p className="text-xs opacity-60">Avg Response: 45ms</p>
                <p className="text-xs opacity-60">P99: 180ms</p>
              </div>
              <div className="p-4 border border-[#141414]/10 bg-white">
                <h5 className="font-bold text-xs uppercase mb-2 flex items-center gap-2"><Zap size={14}/> Rate Limits</h5>
                <p className="text-xs opacity-60">1000 req/sec</p>
                <p className="text-xs opacity-60">Burst: 5000</p>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'error-structures',
        title: 'Error Response Structures',
        content: (
          <div className="space-y-6">
            <div className="space-y-4">
              <h5 className="text-sm font-bold text-red-600">400 Bad Request</h5>
              <div className="bg-[#141414] text-[#E4E3E0] p-4 font-mono text-xs">
                <pre>{`{
  "error": "validation_failed",
  "fields": {
    "region": "Invalid region 'xyz'. Must be one of [sg, us, eu, cn]"
  }
}`}</pre>
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="text-sm font-bold text-red-600">404 Not Found</h5>
              <div className="bg-[#141414] text-[#E4E3E0] p-4 font-mono text-xs">
                <pre>{`{
  "error": "agent_not_found",
  "suggestions": ["577a61", "577a63"]
}`}</pre>
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="text-sm font-bold text-red-600">500 Internal Server Error</h5>
              <div className="bg-[#141414] text-[#E4E3E0] p-4 font-mono text-xs">
                <pre>{`{
  "error": "internal_error",
  "correlation_id": "req-992-abc-123"
}`}</pre>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'redirection-logic',
    title: 'Redirection Logic Flow',
    icon: ArrowRightLeft,
    subSections: [
      {
        id: 'flowchart',
        title: 'Visual Flowchart',
        content: (
          <div className="space-y-6">
            <p className="text-sm opacity-80">The Trae resolution engine uses a multi-stage redirection strategy to ensure requests are handled by the optimal regional cluster.</p>
            <div className="p-8 border border-[#141414] bg-white flex flex-col items-center space-y-4 rounded-sm">
              <div className="px-4 py-2 border border-[#141414] font-mono text-xs shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">Incoming Request</div>
              <ArrowRight size={16} />
              <div className="px-4 py-2 border border-[#141414] bg-[#141414] text-[#E4E3E0] font-mono text-xs">Global Edge (Anycast)</div>
              <div className="flex gap-12 items-center">
                <div className="flex flex-col items-center">
                  <ArrowRight size={16} className="rotate-90 my-2" />
                  <div className="px-4 py-2 border border-[#141414] font-mono text-xs">Geo-IP Match</div>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowRight size={16} className="rotate-90 my-2" />
                  <div className="px-4 py-2 border border-[#141414] border-dashed font-mono text-xs opacity-50">Override (?region=)</div>
                </div>
              </div>
              <ArrowRight size={16} />
              <div className="px-4 py-2 border border-[#141414] font-mono text-xs">Regional Load Balancer</div>
              <ArrowRight size={16} />
              <div className="px-4 py-2 border border-[#141414] bg-green-50 font-mono text-xs border-green-600 text-green-700">302 Found (Target Cluster)</div>
            </div>
          </div>
        )
      },
      {
        id: 'redirect-scenarios',
        title: 'Redirect Scenarios',
        content: (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[#141414]/10 bg-white">
                <h5 className="font-bold text-xs uppercase mb-2">Protocol Upgrade</h5>
                <p className="text-xs opacity-70 leading-relaxed">Requests to <code className="bg-[#141414]/5 px-1">http://</code> are automatically upgraded to <code className="bg-[#141414]/5 px-1">https://</code> via 301 Permanent Redirect with HSTS headers.</p>
              </div>
              <div className="p-4 border border-[#141414]/10 bg-white">
                <h5 className="font-bold text-xs uppercase mb-2">Cross-Region Failover</h5>
                <p className="text-xs opacity-70 leading-relaxed">If the primary region (e.g., SG) is degraded, the edge router issues a 307 Temporary Redirect to the nearest healthy cluster.</p>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 text-xs">
              <p className="font-bold flex items-center gap-2 text-yellow-800"><AlertTriangle size={14}/> Circular Redirect Protection</p>
              <p className="mt-1 text-yellow-700 opacity-80">
                To prevent infinite loops, the system injects a <code className="bg-yellow-900/10 px-1">X-Trae-Hop-Count</code> header. 
                If this count exceeds 5, the request is terminated with a 508 Loop Detected status.
              </p>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'content-negotiation',
    title: 'Content Negotiation',
    icon: Settings2,
    subSections: [
      {
        id: 'mapping-table',
        title: 'Accept Header Strategies',
        content: (
          <div className="space-y-6">
            <p className="text-sm opacity-80">Trae implements proactive content negotiation as defined in RFC 7231, Section 3.4.1.</p>
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#141414] text-[#E4E3E0]">
                  <th className="p-3 text-left border border-[#141414]">Header Value</th>
                  <th className="p-3 text-left border border-[#141414]">Response Type</th>
                  <th className="p-3 text-left border border-[#141414]">Use Case</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="p-3 border border-[#141414]">application/json</td>
                  <td className="p-3 border border-[#141414]">JSON Object</td>
                  <td className="p-3 border border-[#141414]">API Clients / IDEs</td>
                </tr>
                <tr>
                  <td className="p-3 border border-[#141414]">text/html</td>
                  <td className="p-3 border border-[#141414]">HTML Document</td>
                  <td className="p-3 border border-[#141414]">Web Browsers</td>
                </tr>
                <tr>
                  <td className="p-3 border border-[#141414]">application/x-yaml</td>
                  <td className="p-3 border border-[#141414]">YAML Stream</td>
                  <td className="p-3 border border-[#141414]">DevOps Tooling</td>
                </tr>
              </tbody>
            </table>
            <div className="p-6 border border-[#141414] bg-[#141414] text-[#E4E3E0] rounded-sm">
              <h5 className="text-[10px] font-mono uppercase opacity-50 mb-3">Q-Value Logic Example</h5>
              <div className="font-mono text-xs space-y-2">
                <p className="text-blue-400">Request:</p>
                <p className="pl-4 border-l border-white/20">Accept: application/json;q=0.9, text/html;q=0.8, */*;q=0.5</p>
                <p className="text-green-400 mt-4">Resolution:</p>
                <p className="pl-4 border-l border-white/20">The server selects <span className="font-bold">application/json</span> because 0.9 &gt; 0.8.</p>
              </div>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'query-params',
    title: 'Query Parameter Processing',
    icon: Terminal,
    subSections: [
      {
        id: 'validation-rules',
        title: 'Parameter Validation Logic',
        content: (
          <div className="space-y-6">
            <p className="text-sm opacity-80">All query parameters are strictly validated before processing. Invalid parameters trigger a 400 Bad Request with detailed field errors.</p>
            <div className="space-y-4">
              {[
                { name: 'region', type: 'String (Enum)', regex: '^(sg|us|eu|cn)$', desc: 'Target deployment region for low-latency routing.' },
                { name: 'mode', type: 'String (Enum)', regex: '^(production|debug|test)$', desc: 'Execution mode affecting response verbosity.' },
                { name: 'v', type: 'Integer', regex: '^[0-9]+$', desc: 'API versioning identifier.' },
                { name: 'trace', type: 'Boolean', regex: '^(true|false)$', desc: 'Enables detailed request tracing (Debug mode only).' }
              ].map((param) => (
                <div key={param.name} className="p-4 border border-[#141414]/10 bg-white group hover:border-[#141414] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <code className="text-sm font-bold text-blue-600">{param.name}</code>
                    <span className="text-[10px] font-mono opacity-40 uppercase">{param.type}</span>
                  </div>
                  <p className="text-xs opacity-70 mb-3">{param.desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono opacity-30 uppercase">Regex:</span>
                    <code className="text-[10px] bg-[#141414] text-[#E4E3E0] px-2 py-0.5 rounded-sm">{param.regex}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'interactive-tools',
    title: 'Interactive Testing Tools',
    icon: Terminal,
    subSections: [
      {
        id: 'api-tester',
        title: 'Live API Tester',
        content: <ApiTester />
      }
    ]
  }
];
