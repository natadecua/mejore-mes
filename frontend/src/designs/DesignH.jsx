// Design H: "Mejore Production Terminal" — Finalized Industrial Architecture
// Handles barcodes, manual/machine modes, version check, and handoff routing.

import { useState, useEffect } from 'react'
import { 
  Scan, List, FileText, AlertCircle, 
  ArrowRightCircle, History, Package, 
  Play, Square, Pause, Settings, 
  FileCheck, ShieldAlert, ChevronRight,
  Clock, CheckCircle, Database, Camera,
  Printer, ArrowUpRight, MapPin
} from 'lucide-react'

const BRAND = {
  amber: '#D97706',
  zinc: '#18181b',
  emerald: '#10b981',
  rose: '#f43f5e'
}

const INITIAL_QUEUE = [
  { 
    id: 'PART-2045-A', 
    project: 'Manila Hotel', 
    part: 'Rashida Leg (Front)', 
    qty: 40, 
    status: 'ready', 
    version: 'v4', 
    cnc: 'L4_RASH_V4.nc', 
    nextStation: 'Sanding Bench 02',
    specs: { material: 'Solid Oak', tools: '5mm Pilot / 12mm Profile', grain: 'Vertical' } 
  },
  { 
    id: 'PART-2045-B', 
    project: 'Manila Hotel', 
    part: 'Rashida Leg (Back)', 
    qty: 40, 
    status: 'ready', 
    version: 'v4', 
    cnc: 'L4_RASH_V4.nc', 
    nextStation: 'Sanding Bench 02',
    specs: { material: 'Solid Oak', tools: '5mm Pilot / 12mm Profile', grain: 'Vertical' } 
  },
  { 
    id: 'PART-9981-D', 
    project: 'Private Villa', 
    part: 'Dining Table Top', 
    qty: 2, 
    status: 'blocked', 
    version: 'v1', 
    cnc: 'TAB_T_V1.nc', 
    nextStation: 'Finishing Booth A',
    specs: { material: 'Walnut', tools: 'Planing / Sanding', grain: 'Cross' } 
  },
]

export default function DesignH() {
  const [activeJob, setActiveJob] = useState(null)
  const [workState, setWorkState] = useState('idle') // idle | setup | running | quality | route
  const [timer, setTimer] = useState(0)
  const [completedInBatch, setCompletedInBatch] = useState(0)
  const [stationType, setStationType] = useState('machine') // machine | manual
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    let interval
    if (['setup', 'running'].includes(workState)) {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [workState])

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="min-h-screen bg-[#090a0c] text-slate-300 font-sans flex overflow-hidden">
      
      {/* 📋 SIDEBAR: QUEUE & ROLE */}
      <aside className="w-80 bg-[#111318] border-r border-slate-800 flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
              <List size={14} className="text-amber-500" /> Job Queue
            </h2>
            <div className="flex bg-black/40 rounded-lg p-1 border border-slate-800">
               <button onClick={() => setStationType('machine')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${stationType === 'machine' ? 'bg-amber-600 text-black' : 'text-slate-500'}`}>CNC</button>
               <button onClick={() => setStationType('manual')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${stationType === 'manual' ? 'bg-amber-600 text-black' : 'text-slate-500'}`}>MAN</button>
            </div>
          </div>
          <div className="relative group">
            <input 
              type="text" placeholder="Scan Part Barcode..." 
              className="w-full bg-black/60 border border-slate-700 rounded-xl py-3 px-4 text-xs font-bold focus:border-amber-500 outline-none transition-all placeholder:text-slate-600"
            />
            <Scan size={14} className="absolute right-4 top-3.5 text-slate-500 group-hover:text-amber-500 transition-colors" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3 custom-scrollbar">
          {INITIAL_QUEUE.map((job) => (
            <button 
              key={job.id}
              onClick={() => { setActiveJob(job); setWorkState('idle'); setTimer(0); setCompletedInBatch(0); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden
                ${activeJob?.id === job.id ? 'bg-amber-600 border-amber-500 shadow-xl scale-[1.02]' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-black uppercase tracking-tighter ${activeJob?.id === job.id ? 'text-black/60' : 'text-amber-600'}`}>{job.project}</span>
                {job.status === 'blocked' && <ShieldAlert size={12} className="text-red-500" />}
              </div>
              <h4 className={`font-black text-sm tracking-tight leading-none ${activeJob?.id === job.id ? 'text-black' : 'text-white'}`}>{job.part}</h4>
              <div className="flex justify-between items-center mt-4">
                <span className={`text-[9px] font-mono font-bold ${activeJob?.id === job.id ? 'text-black/40' : 'text-slate-600'}`}>{job.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${activeJob?.id === job.id ? 'bg-black/10 text-black' : 'bg-black/40 text-slate-400'}`}>QTY {job.qty}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-black border border-slate-600 shadow-lg">NH</div>
             <div>
               <p className="text-white text-xs font-black leading-none uppercase tracking-tighter">Nathan Hizon</p>
               <p className="text-emerald-500 text-[9px] font-black uppercase mt-1 flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div> Active Station</p>
             </div>
          </div>
        </div>
      </aside>

      {/* 🚀 MAIN DECK */}
      <main className="flex-1 flex flex-col relative bg-[#0d0e12]">
        {!activeJob ? (
          <div className="flex-1 flex flex-col items-center justify-center">
             <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
               <ArrowRightCircle size={48} className="text-slate-700 animate-bounce-x" />
             </div>
             <p className="font-black uppercase tracking-[0.3em] text-slate-600 text-lg">Initialize Station Queue</p>
          </div>
        ) : (
          <>
            {/* VERSION GATEKEEPER */}
            <div className="h-16 bg-[#16181d] border-b border-slate-800 px-8 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 bg-emerald-500/5 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest shadow-inner">
                   <FileCheck size={14} /> BOM SYNC: {activeJob.version}
                 </div>
                 {stationType === 'machine' && (
                   <div className="flex items-center gap-2 bg-blue-500/5 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 text-[10px] font-black uppercase tracking-widest shadow-inner font-mono">
                     <Database size={14} /> CNC: {activeJob.cnc}
                   </div>
                 )}
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Connected to Order Time</span>
              </div>
            </div>

            <div className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-auto">
              
              {/* LEFT: WORK AREA (8/12) */}
              <div className="col-span-8 flex flex-col gap-6">
                
                {/* DRAWING / SPEC PANEL */}
                <div className="bg-[#1a1d24] border border-slate-800 rounded-[2.5rem] p-8 flex flex-col shadow-2xl relative group overflow-hidden flex-1">
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{activeJob.part}</h2>
                      <p className="text-amber-500/70 text-xs font-bold uppercase tracking-widest mt-2">{activeJob.project} / {activeJob.id}</p>
                    </div>
                    <div className="bg-black/40 px-4 py-2 rounded-2xl border border-slate-800 flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Efficiency</span>
                      <span className="text-xl font-black text-amber-500 italic">94.2%</span>
                    </div>
                  </div>

                  <div className="flex-1 mt-8 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center bg-black/30 relative group cursor-zoom-in min-h-[200px]">
                    <div className="flex flex-col items-center gap-3 text-slate-700 group-hover:text-slate-500 transition-colors text-center p-4">
                      <FileText size={40} />
                      <p className="font-black text-xs uppercase tracking-widest underline underline-offset-4 decoration-slate-800">Tap to view technical drawing</p>
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE CONTROL DECK */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-[160px]">
                   <div className="col-span-1 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 flex flex-col justify-center items-center shadow-xl text-center">
                     <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Session Timer</p>
                     <p className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tighter whitespace-nowrap">{formatTime(timer)}</p>
                   </div>
                   
                   <div className="col-span-3 flex gap-4">
                      {workState === 'idle' && (
                        <button 
                          onClick={() => setWorkState('setup')}
                          className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xl uppercase tracking-tighter flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl shadow-blue-900/20 border-b-8 border-blue-800 active:border-b-0 active:translate-y-1"
                        >
                          <Settings size={28} /> Start Setup
                        </button>
                      )}

                      {workState === 'setup' && (
                        <button 
                          onClick={() => setWorkState('running')}
                          className="flex-1 bg-amber-600 hover:bg-amber-500 text-black rounded-[2rem] font-black text-xl uppercase tracking-tighter flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl shadow-amber-900/20 border-b-8 border-amber-800 active:border-b-0 active:translate-y-1"
                        >
                          <Play fill="black" size={28} /> Start Batch
                        </button>
                      )}

                      {workState === 'running' && (
                        <>
                          <button 
                            onClick={() => setWorkState('quality')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-black rounded-[2rem] font-black text-xl uppercase tracking-tighter flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl shadow-emerald-900/20 border-b-8 border-emerald-800 active:border-b-0 active:translate-y-1"
                          >
                            <CheckCircle size={28} /> Log 1 Unit
                          </button>
                          <button 
                            onClick={() => setWorkState('idle')}
                            className="w-24 bg-slate-800 hover:bg-red-500 text-white rounded-[2rem] flex items-center justify-center transition-all shadow-xl active:scale-95 group border-b-8 border-slate-700 hover:border-red-900"
                          >
                            <Pause size={28} className="group-hover:hidden" />
                            <Square size={28} className="hidden group-hover:block" />
                          </button>
                        </>
                      )}

                      {(workState === 'quality' || workState === 'route') && (
                        <div className="flex-1 flex gap-4">
                           <button onClick={() => setWorkState('running')} className="flex-1 bg-slate-800 border-2 border-slate-700 text-white rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-slate-700 transition-all px-2">Next Unit</button>
                           <button onClick={() => setWorkState('route')} className={`flex-[1.5] rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl border-b-8 px-2
                            ${workState === 'route' ? 'bg-amber-600 text-black border-amber-800' : 'bg-white text-black border-slate-300'}`}>
                             {workState === 'route' ? 'Handoff confirmed' : 'Route to next station'} <ChevronRight size={18} />
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* RIGHT: INTEL & QUALITY (4/12) */}
              <div className="col-span-4 space-y-4 flex flex-col h-full overflow-auto pr-2 custom-scrollbar pb-20">
                
                {/* BOM SPECS */}
                <section className="bg-zinc-900/80 border border-slate-800 rounded-3xl p-6 shadow-inner">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5 flex items-center gap-2">
                    <FileText size={14} className="text-amber-500" /> BOM Intelligence
                  </h3>
                  <div className="space-y-4">
                     {[
                       { label: 'Wood Grade', value: activeJob.specs.material },
                       { label: 'Grain Orient.', value: activeJob.specs.grain },
                       { label: 'Tool Bits', value: activeJob.specs.tools },
                     ].map((spec, i) => (
                       <div key={i} className="flex flex-col gap-1 border-l-2 border-slate-800 pl-4">
                         <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{spec.label}</span>
                         <span className="text-white text-sm font-black tracking-tight leading-none">{spec.value}</span>
                       </div>
                     ))}
                  </div>
                </section>

                {/* NEXT STATION (Replacement for manual printing) */}
                <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 border-l-4 border-l-amber-600">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                    <MapPin size={14} className="text-amber-600" /> Logistics Instruction
                   </h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Move current pallet to:</p>
                   <div className="bg-black/40 p-4 rounded-2xl border border-slate-800">
                      <p className="text-white font-black text-lg tracking-tight uppercase">{activeJob.nextStation}</p>
                   </div>
                </section>

                {/* ERROR REPORTING */}
                <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert size={16} /> Flag production error
                     </h3>
                   </div>
                   <div className="grid gap-2">
                     {['Material Fault', 'Machine Bug', 'Plan Mismatch'].map(issue => (
                        <button key={issue} onClick={() => setShowError(true)} className="w-full text-left bg-black/40 hover:bg-red-500/20 p-4 rounded-2xl border border-slate-800 transition-all flex justify-between items-center group active:scale-95">
                          <span className="text-[11px] font-black uppercase text-slate-400 group-hover:text-red-400 transition-colors">{issue}</span>
                          <ChevronRight size={14} className="text-slate-800 group-hover:text-red-400" />
                        </button>
                     ))}
                   </div>
                </section>

                {/* QC GATE */}
                <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all flex flex-col justify-center min-h-[140px]">
                  <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:rotate-12 transition-transform pointer-events-none">
                    <Camera size={160} />
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Quality Gate</p>
                  <p className="text-xl font-black tracking-tight leading-none mb-4">Submit Photo Proof</p>
                  <div className="bg-white/20 p-3 rounded-xl border border-white/30 text-center text-[10px] font-black uppercase flex items-center justify-center gap-2">
                    Open Station Camera <ArrowUpRight size={14} />
                  </div>
                </section>

              </div>
            </div>
          </>
        )}

        {/* ERROR OVERLAY */}
        {showError && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[50] flex items-center justify-center p-8">
            <div className="bg-slate-900 border-2 border-red-500 rounded-[3rem] p-12 max-w-lg w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.3)]">
               <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertCircle size={48} className="text-red-500 animate-pulse" />
               </div>
               <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Confirm Error Log?</h2>
               <p className="text-slate-400 font-medium mb-8">This will flag Job {activeJob.id} to the Admin dashboard and pause all production timers for this station.</p>
               <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setShowError(false)} className="bg-slate-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest border border-slate-700">Cancel</button>
                 <button onClick={() => setShowError(false)} className="bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest">Yes, Flag Admin</button>
               </div>
            </div>
          </div>
        )}

        {/* Global Footer */}
        <footer className="h-12 bg-black border-t border-slate-800 px-8 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 shrink-0">
           <div className="flex gap-8">
             <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Main Fleet Online</span>
             <span className="flex items-center gap-2 font-mono tabular-nums text-slate-400 font-bold uppercase tracking-tight overflow-hidden whitespace-nowrap">Batangas Plant</span>
           </div>
           <span className="text-slate-700 italic hidden sm:block">Mejore MES Hierarchy v3.2</span>
        </footer>
      </main>
    </div>
  )
}
