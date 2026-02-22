// Design D: "Station Terminal" — The high-utility machine-level interface
// Best for: CNC stations, edge banding, assembly line tablets
// Color: high-visibility slate + focus on actionable tasks

import { useState } from 'react'
import { 
  Play, Pause, CheckCircle2, FileText, Settings, 
  AlertTriangle, History, Info, ChevronRight,
  Monitor, Cpu, Maximize2, Camera
} from 'lucide-react'

// Station Context Mock
const STATIONS = [
  { id: 'cnc-01', name: 'CNC Router A', type: 'machine' },
  { id: 'edge-02', name: 'Edge Bander 2', type: 'machine' },
  { id: 'asm-04', name: 'Final Assembly', type: 'human' }
]

const currentJob = {
  woId: 'WO-2045',
  sku: 'CHAIR-LEG-SET-B',
  bomFile: 'chair-001-v2.xml',
  instructions: 'Ensure grain orientation follows marking. Use 5mm pilot bit.',
  totalQty: 40,
  completedQty: 12,
  startTime: '08:45 AM',
  cncProgram: 'B_LEG_S4_R1.nc',
  status: 'running' // running | paused | stopped
}

export default function DesignD() {
  const [status, setStatus] = useState(currentJob.status)
  const [completed, setCompleted] = useState(currentJob.completedQty)
  
  const pct = Math.round((completed / currentJob.totalQty) * 100)

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 font-sans flex flex-col p-4 gap-4">
      {/* Station Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">CNC Router A</h2>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Station ID: CNC-01</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs mb-1">Operator</p>
          <p className="text-white font-medium">Nathan H.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* Left Column: Active Job & Controls */}
        <div className="lg:col-span-2 space-y-4 flex flex-col">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter border border-blue-500/20">
                  Active Production
                </span>
                <h1 className="text-4xl font-black text-white mt-4 tracking-tighter">{currentJob.sku}</h1>
                <p className="text-slate-400 text-lg mt-1 font-mono">{currentJob.woId}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-sm mb-1">Program</p>
                <div className="bg-black/40 px-4 py-2 rounded-xl border border-slate-800 font-mono text-emerald-400 text-sm">
                  {currentJob.cncProgram}
                </div>
              </div>
            </div>

            {/* Progress Visualization */}
            <div className="space-y-6 flex-1">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase">Batch Progress</p>
                  <p className="text-6xl font-black text-white">{completed}<span className="text-slate-600">/{currentJob.totalQty}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-blue-500">{pct}%</p>
                </div>
              </div>
              
              <div className="h-6 bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-500 shadow-lg ${
                    status === 'running' ? 'bg-gradient-to-r from-blue-600 to-cyan-400 animate-pulse' : 'bg-slate-600'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-black/20 rounded-2xl p-4 border border-slate-800/50">
                  <p className="text-slate-500 text-xs mb-1 uppercase font-bold">Start Time</p>
                  <p className="text-lg font-mono">{currentJob.startTime}</p>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 border border-slate-800/50">
                  <p className="text-slate-500 text-xs mb-1 uppercase font-bold">Est. Finish</p>
                  <p className="text-lg font-mono">11:30 AM</p>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 border border-slate-800/50">
                  <p className="text-slate-500 text-xs mb-1 uppercase font-bold">Cycle Time</p>
                  <p className="text-lg font-mono">4m 12s</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {status === 'running' ? (
                <button 
                  onClick={() => setStatus('paused')}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-black text-xl py-6 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95"
                >
                  <Pause fill="currentColor" size={24} /> PAUSE STATION
                </button>
              ) : (
                <button 
                  onClick={() => setStatus('running')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xl py-6 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95"
                >
                  <Play fill="currentColor" size={24} /> RESUME WORK
                </button>
              )}
              <button 
                onClick={() => setCompleted(prev => Math.min(prev + 1, currentJob.totalQty))}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xl py-6 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 size={24} /> LOG +1 UNIT
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Reference & Logs */}
        <div className="space-y-4 flex flex-col">
          {/* Instructions */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <FileText size={18} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Task Instructions</h3>
            </div>
            <div className="bg-black/30 rounded-2xl p-4 text-slate-300 text-sm leading-relaxed border border-slate-800 italic font-medium">
              \"{currentJob.instructions}\"
            </div>
            <button className="w-full mt-4 bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-slate-700">
              <Maximize2 size={14} /> VIEW FULL PLAN
            </button>
          </div>

          {/* Quality Control Quick Action */}
          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/10">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Camera size={20} /> Quality Check
            </h3>
            <p className="text-indigo-100 text-sm mb-4">Required every 10 units. Last check at 8 units.</p>
            <button className="w-full bg-white text-indigo-600 font-black py-3 rounded-xl text-sm tracking-tight shadow-lg">
              ATTACH QC PHOTO
            </button>
          </div>

          {/* Incident Reporting */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex-1">
             <div className="flex items-center gap-2 mb-4 text-red-500">
              <AlertTriangle size={18} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Report Issue</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {['Material Defect', 'Machine Error', 'Tool Broken'].map(issue => (
                <button key={issue} className="text-left px-4 py-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-200 text-sm font-medium transition-colors">
                  {issue}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Station Footer / Status Bar */}
      <div className="bg-black border border-slate-800 rounded-2xl px-6 py-3 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <div className=\"w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]\"></div> SYSTEM ONLINE
          </span>
          <span className="flex items-center gap-2">
            <div className=\"w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]\"></div> PYTHA SYNCED
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>{new Date().toLocaleTimeString()}</span>
          <button className="text-slate-400 hover:text-white"><Settings size={14} /></button>
        </div>
      </div>
    </div>
  )
}
