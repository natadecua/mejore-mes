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
  }
]

export default function DesignH() {
  const [activeJob, setActiveJob] = useState(null)
  const [workState, setWorkState] = useState('idle') // idle | setup | running | quality | route
  const [timer, setTimer] = useState(0)
  const [stationType, setStationType] = useState('machine') // machine | manual
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    let interval
    if (['setup', 'running'].includes(workState)) {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [workState])

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins}m ${secs.toString().padStart(2, '0')}s`
  }

  return (
    <div className="min-h-screen bg-[#090a0c] text-slate-300 font-sans flex overflow-hidden">
      
      {/* 📋 SIDEBAR */}
      <aside className="w-80 bg-[#111318] border-r border-slate-800 flex flex-col shadow-2xl z-20 shrink-0">
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
              onClick={() => { setActiveJob(job); setWorkState('idle'); setTimer(0); }}
              className={`w-full text-left p-4 rounded-2xl border transition-all relative overflow-hidden
                ${activeJob?.id === job.id ? 'bg-amber-600 border-amber-500 shadow-xl scale-[1.02]' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
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

        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center gap-3 text-white">
             <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-black">NH</div>
             <div><p className="text-xs font-black uppercase tracking-tighter">Nathan Hizon</p><p className="text-emerald-500 text-[9px] font-black uppercase">Active</p></div>
          </div>
        </div>
      </aside>

      {/* 🚀 MAIN DECK */}
      <main className="flex-1 flex flex-col relative bg-[#0d0e12] min-w-0">
        {!activeJob ? (
          <div className="flex-1 flex flex-col items-center justify-center">
             <ArrowRightCircle size={48} className="text-slate-700" />
             <p className="mt-4 font-black uppercase tracking-[0.3em] text-slate-600">Select Job to Begin</p>
          </div>
        ) : (
          <>
            <div className="h-16 bg-[#16181d] border-b border-slate-800 px-8 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 bg-emerald-500/5 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                   <FileCheck size={14} /> BOM: {activeJob.version}
                 </div>
                 {stationType === 'machine' && (
                   <div className="flex items-center gap-2 bg-blue-500/5 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 text-[10px] font-black uppercase tracking-widest font-mono">
                     <Database size={14} /> {activeJob.cnc}
                   </div>
                 )}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Connected
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-auto">
              
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-[#1a1d24] border border-slate-800 rounded-[2rem] p-8 flex flex-col shadow-2xl relative flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">{activeJob.part}</h2>
                      <p className="text-amber-500/70 text-[10px] font-bold uppercase tracking-widest mt-2">{activeJob.project} / {activeJob.id}</p>
                    </div>
                    <div className="bg-black/40 px-4 py-2 rounded-2xl border border-slate-800 flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Efficiency</span>
                      <span className="text-xl font-black text-amber-500 italic">94%</span>
                    </div>
                  </div>
                  <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center bg-black/30 min-h-[200px]">
                    <div className="flex flex-col items-center gap-3 text-slate-700"><FileText size={40}/><p className="font-black text-xs uppercase tracking-widest">View Technical Drawing</p></div>
                  </div>
                </div>

                {/* TIMER DECK: FIXED SQUISH */}
                <div className="flex flex-col md:flex-row gap-4 h-auto md:h-40 shrink-0">
                   <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[1.5rem] p-6 flex flex-col justify-center items-center shadow-xl">
                     <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Session Timer</p>
                     <p className="text-4xl md:text-6xl font-black text-white tabular-nums tracking-tighter leading-none">{formatTime(timer)}</p>
                   </div>
                   
                   <div className="flex-[2] flex gap-3">
                      {workState === 'idle' && (
                        <button onClick={() => setWorkState('setup')} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-xl uppercase flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95">
                          <Settings size={24} /> SETUP
                        </button>
                      )}
                      {workState === 'setup' && (
                        <button onClick={() => setWorkState('running')} className="flex-1 bg-amber-600 hover:bg-amber-500 text-black rounded-[1.5rem] font-black text-xl uppercase flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95">
                          <Play fill="black" size={24} /> START
                        </button>
                      )}
                      {workState === 'running' && (
                        <button onClick={() => setWorkState('quality')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-black rounded-[1.5rem] font-black text-xl uppercase flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95">
                          <CheckCircle size={24} /> LOG UNIT
                        </button>
                      )}
                      {(workState === 'quality' || workState === 'route') && (
                        <button onClick={() => setWorkState('route')} className={`flex-1 rounded-[1.5rem] font-black text-lg uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${workState === 'route' ? 'bg-amber-600 text-black' : 'bg-white text-black'}`}>
                          {workState === 'route' ? 'MOVED' : 'ROUTE NEXT'} <ChevronRight size={18} />
                        </button>
                      )}
                   </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4 flex flex-col pb-10">
                <section className="bg-zinc-900/80 border border-slate-800 rounded-[1.5rem] p-6 shadow-inner flex flex-col gap-4">
                  <h3 className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2 tracking-widest"><FileText size={14} className="text-amber-500" /> BOM INTEL</h3>
                  <div className="space-y-4 border-l-2 border-slate-800 pl-4">
                    <div className="flex flex-col"><span className="text-slate-500 text-[9px] font-bold uppercase">Material</span><span className="text-white text-sm font-black tracking-tight uppercase leading-none">{activeJob.specs.material}</span></div>
                    <div className="flex flex-col"><span className="text-slate-500 text-[9px] font-bold uppercase">Grain</span><span className="text-white text-sm font-black tracking-tight uppercase leading-none">{activeJob.specs.grain}</span></div>
                    <div className="flex flex-col"><span className="text-slate-500 text-[9px] font-bold uppercase">Tools</span><span className="text-white text-sm font-black tracking-tight uppercase leading-none">{activeJob.specs.tools}</span></div>
                  </div>
                </section>

                <section className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-6 border-l-4 border-l-amber-600">
                   <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 mb-2 tracking-widest"><MapPin size={14} className="text-amber-600" /> LOGISTICS</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Route to:</p>
                   <div className="bg-black/40 p-4 rounded-xl border border-slate-800">
                      <p className="text-white font-black text-base uppercase tracking-tight leading-none">{activeJob.nextStation}</p>
                   </div>
                </section>

                <button onClick={() => setShowError(true)} className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-[1.5rem] p-4 flex items-center justify-center gap-3 transition-all active:scale-95 group">
                   <ShieldAlert size={20} className="group-hover:scale-110 transition-transform" /><span className="font-black text-xs uppercase tracking-widest">FLAG ERROR</span>
                </button>

                <section className="bg-indigo-600 rounded-[1.5rem] p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all flex flex-col justify-center min-h-[120px]">
                  <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:rotate-12 transition-transform pointer-events-none"><Camera size={140} /></div>
                  <p className="text-[9px] font-black uppercase opacity-80 mb-1 tracking-widest leading-none">Quality Gate</p>
                  <p className="text-lg font-black tracking-tighter leading-none mb-3">CAPTURE PHOTO</p>
                  <div className="bg-white/20 p-2 rounded-xl border border-white/30 text-center text-[9px] font-black uppercase">Open Camera <ArrowUpRight size={12} className="inline ml-1"/></div>
                </section>
              </div>
            </div>
          </>
        )}

        {showError && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-[50] flex items-center justify-center p-8">
            <div className="bg-slate-900 border-2 border-red-500 rounded-[2.5rem] p-10 max-w-lg w-full text-center shadow-2xl shadow-red-900/20">
               <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Flag Admin?</h2>
               <p className="text-slate-400 text-sm mb-8">This will pause timers and alert the office of a production blockage.</p>
               <div className="flex gap-4"><button onClick={() => setShowError(false)} className="flex-1 bg-slate-800 text-white py-4 rounded-xl font-black uppercase text-xs border border-slate-700">Cancel</button><button onClick={() => setShowError(false)} className="flex-1 bg-red-600 text-white py-4 rounded-xl font-black uppercase text-xs shadow-lg shadow-red-900/40">Yes, Alert</button></div>
            </div>
          </div>
        )}

        <footer className="h-10 bg-black border-t border-slate-800 px-8 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 shrink-0">
           <div className="flex gap-6 items-center">
             <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> System Live</div>
             <div className="hidden sm:block">Batangas Plant</div>
           </div>
           <div>v3.3 Build-Final</div>
        </footer>
      </main>
    </div>
  )
}
