// Design G: "The Command Deck" — Advanced Station Terminal
// Addresses task switching, engineering sync, and routing.

import { useState, useEffect } from 'react'
import { 
  Scan, List, FileText, AlertCircle, 
  ArrowRightCircle, History, Package, 
  Play, Square, Pause, Settings, 
  FileCheck, ShieldAlert, ChevronRight,
  Clock, CheckCircle, Database
} from 'lucide-react'

// Mock Data for the Queue
const ASSIGNED_QUEUE = [
  { id: 'WO-2045-A', project: 'Manila Hotel', part: 'Rashida Leg (Front)', qty: 40, status: 'ready', version: 'v4', cnc: 'L4_RASH_V4.nc' },
  { id: 'WO-2045-B', project: 'Manila Hotel', part: 'Rashida Leg (Back)', qty: 40, status: 'ready', version: 'v4', cnc: 'L4_RASH_V4.nc' },
  { id: 'WO-2048-D', project: 'Private Villa', part: 'Dining Table Top', qty: 2, status: 'blocked', version: 'v1', cnc: 'TAB_T_V1.nc' },
]

export default function DesignG() {
  const [activeJob, setActiveJob] = useState(null)
  const [workState, setWorkState] = useState('idle') // idle | setup | running | quality
  const [timer, setTimer] = useState(0)
  const [unitsDone, setUnitsDone] = useState(0)

  // Simulation of timer
  useEffect(() => {
    let interval
    if (['setup', 'running'].includes(workState)) {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [workState])

  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-300 font-sans flex overflow-hidden">
      
      {/* 📋 LEFT: WORKER QUEUE (25% Width) */}
      <aside className="w-80 bg-[#16181d] border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <List size={14} className="text-amber-500" /> Station Queue
          </h2>
          <div className="relative">
            <input 
              type="text" placeholder="Scan Part ID..." 
              className="w-full bg-black/40 border border-slate-700 rounded-xl py-3 px-4 text-sm focus:border-amber-500 outline-none transition-all"
            />
            <Scan size={16} className="absolute right-4 top-3.5 text-slate-500" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {ASSIGNED_QUEUE.map((job) => (
            <button 
              key={job.id}
              onClick={() => { setActiveJob(job); setWorkState('idle'); setTimer(0); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden group
                ${activeJob?.id === job.id ? 'bg-amber-600 border-amber-500 shadow-lg' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}
            >
              <p className={`text-[10px] font-black uppercase mb-1 ${activeJob?.id === job.id ? 'text-black/60' : 'text-amber-500/80'}`}>{job.project}</p>
              <h4 className={`font-bold text-sm ${activeJob?.id === job.id ? 'text-black' : 'text-white'}`}>{job.part}</h4>
              <div className="flex justify-between items-center mt-3">
                <span className={`text-[10px] font-mono ${activeJob?.id === job.id ? 'text-black/60' : 'text-slate-500'}`}>{job.id}</span>
                <span className={`text-xs font-black ${activeJob?.id === job.id ? 'text-black' : 'text-slate-300'}`}>Qty: {job.qty}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-black/20 border-t border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">NH</div>
             <div>
               <p className="text-white text-xs font-bold leading-none">Nathan Hizon</p>
               <p className="text-slate-500 text-[10px] uppercase mt-1">Clocked In: 7:30 AM</p>
             </div>
          </div>
        </div>
      </aside>

      {/* 🚀 CENTER: PRODUCTION CONTROL */}
      <main className="flex-1 flex flex-col relative">
        {!activeJob ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
             <ArrowRightCircle size={80} strokeWidth={1} />
             <p className="mt-4 font-black uppercase tracking-widest text-xl">Select Job to Begin</p>
          </div>
        ) : (
          <>
            {/* TOP BAR: Engineering Verification */}
            <div className="h-16 bg-[#16181d] border-b border-slate-800 px-8 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                   <FileCheck size={14} /> BOM Sync: {activeJob.version}
                 </div>
                 <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg border border-blue-500/20 text-[10px] font-black uppercase tracking-widest">
                   <Database size={14} /> CNC: {activeJob.cnc}
                 </div>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors">
                <Settings size={20} />
              </button>
            </div>

            <div className="flex-1 p-8 grid grid-cols-12 gap-8 overflow-auto">
              
              {/* MAIN COLUMN */}
              <div className="col-span-8 space-y-6">
                
                {/* Visual Context */}
                <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 min-h-[300px] flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{activeJob.part}</h2>
                    <div className="text-right">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Efficiency</p>
                      <p className="text-2xl font-black text-amber-500 tracking-tighter italic">94%</p>
                    </div>
                  </div>

                  <div className="flex-1 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center bg-black/20 group cursor-zoom-in overflow-hidden relative">
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-widest z-10">BOM Technical Drawing Attached</p>
                    {/* Placeholder for real PDF/Img */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                  </div>
                </div>

                {/* Control Deck */}
                <div className="grid grid-cols-4 gap-4">
                   <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Current Session</p>
                     <p className="text-4xl font-black text-white tabular-nums leading-none">{formatTime(timer)}</p>
                   </div>
                   
                   <div className="col-span-3 flex gap-4">
                      {workState === 'idle' && (
                        <button 
                          onClick={() => setWorkState('setup')}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/10"
                        >
                          <Settings size={24} /> BEGIN SETUP
                        </button>
                      )}

                      {workState === 'setup' && (
                        <button 
                          onClick={() => setWorkState('running')}
                          className="flex-1 bg-amber-600 hover:bg-amber-500 text-black rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-amber-600/10"
                        >
                          <Play fill="black" size={24} /> START PRODUCTION
                        </button>
                      )}

                      {workState === 'running' && (
                        <>
                          <button 
                            onClick={() => setWorkState('quality')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                          >
                            <CheckCircle size={24} /> LOG & ROUTE
                          </button>
                          <button 
                            onClick={() => setWorkState('idle')}
                            className="w-20 bg-slate-800 hover:bg-red-500 text-white rounded-[1.5rem] flex items-center justify-center transition-all group"
                          >
                            <Pause size={24} className="group-hover:hidden" />
                            <Square size={24} className="hidden group-hover:block" />
                          </button>
                        </>
                      )}

                      {workState === 'quality' && (
                        <div className="flex-1 flex gap-4">
                           <button className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest">Next Batch</button>
                           <button className="flex-1 bg-white text-black rounded-[1.5rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                             Move to next station <ChevronRight size={16} />
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR: Task Intelligence */}
              <div className="col-span-4 space-y-4">
                
                {/* Requirements */}
                <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                    <FileText size={14} className="text-amber-500" /> BOM Specifications
                  </h3>
                  <div className="space-y-3">
                     {[
                       { label: 'Material', value: 'Solid Oak - Grade A' },
                       { label: 'Grain Direction', value: 'Vertical / Lengthwise' },
                       { label: 'Tooling', value: '5mm Pilot / 12mm Profile' },
                     ].map((spec, i) => (
                       <div key={i} className="flex justify-between border-b border-slate-800/50 pb-2 last:border-0">
                         <span className="text-slate-500 text-xs font-bold">{spec.label}</span>
                         <span className="text-white text-xs font-black">{spec.value}</span>
                       </div>
                     ))}
                  </div>
                </section>

                {/* Quality / Error Panel */}
                <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 flex-1">
                   <h3 className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldAlert size={16} /> Flag Issue
                   </h3>
                   <div className="grid gap-2">
                     <button className="w-full text-left bg-black/40 hover:bg-red-500/20 p-4 rounded-2xl border border-slate-800 transition-all flex justify-between items-center group">
                       <span className="text-xs font-bold uppercase tracking-tight">Material Defect</span>
                       <ChevronRight size={14} className="text-slate-700 group-hover:text-red-500" />
                     </button>
                     <button className="w-full text-left bg-black/40 hover:bg-red-500/20 p-4 rounded-2xl border border-slate-800 transition-all flex justify-between items-center group">
                       <span className="text-xs font-bold uppercase tracking-tight">BOM Error</span>
                       <ChevronRight size={14} className="text-slate-700 group-hover:text-red-500" />
                     </button>
                   </div>
                </section>

                {/* QC Photo Action */}
                <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all">
                  <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:rotate-12 transition-transform">
                    <Camera size={160} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest mb-2">Quality Gate</h3>
                  <p className="text-xl font-black tracking-tighter leading-none mb-4">Capture Verification Photo</p>
                  <div className="bg-white/20 p-3 rounded-xl border border-white/30 text-center text-[10px] font-black uppercase">Click to open camera</div>
                </section>

              </div>
            </div>
          </>
        )}

        {/* Global Footer */}
        <footer className="h-10 bg-black border-t border-slate-800 px-8 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
           <div className="flex gap-8">
             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> System Live</span>
             <span>Network: Batangas-Fiber-01</span>
           </div>
           <span>Mejore Manufacturing System © 2026</span>
        </footer>
      </main>
    </div>
  )
}
