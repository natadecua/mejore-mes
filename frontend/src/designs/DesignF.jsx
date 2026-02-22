// Design F: "The Industrial Pulse" — Productivity-first station terminal
// Specifically designed for Miguel's workflow: Sub-parts, Timing, and Value.

import { useState, useEffect } from 'react'
import { 
  BarChart3, Clock, ScanBarcode, AlertTriangle, 
  Layers, Play, Pause, CheckCircle2, 
  ArrowUpRight, Info, ChevronDown, Camera
} from 'lucide-react'

const currentProject = {
  name: "Manila Hotel Renovation",
  contractValue: "₱4,500,000",
  totalCompletion: 42
}

const activeJob = {
  id: "JOB-992",
  parentItem: "Rashida Bed Frame (King)",
  subPart: "Drawer Shell Mechanism",
  targetCycle: "08:00", // 8 minutes per part
  valuePerUnit: "₱12,500",
  stationWeight: "15% of item value",
  instructions: "Ensure 2mm gap for soft-close runners. Sand to 220 grit before assembly.",
  components: [
    { name: "Side Panel L", status: "complete" },
    { name: "Side Panel R", status: "pending" },
    { name: "Bottom Base", status: "pending" }
  ]
}

export default function DesignF() {
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [completed, setCompleted] = useState(8)
  const totalInBatch = 20

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
    const secs = s % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans p-4 flex flex-col gap-4">
      
      {/* 🔝 PROJECT CONTEXT BAR */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-amber-600/10 p-2 rounded-lg border border-amber-600/20">
            <BarChart3 size={20} className="text-amber-500" />
          </div>
          <div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Active Contract</p>
            <h2 className="text-white font-bold text-sm uppercase">{currentProject.name}</h2>
          </div>
        </div>
        
        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Contract Value</p>
            <p className="text-white font-mono text-sm font-bold">{currentProject.contractValue}</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">Overall Progress</p>
            <p className="text-amber-500 font-mono text-sm font-black">{currentProject.totalCompletion}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        
        {/* 📟 LEFT: HIERARCHY & SPECS (3/12) */}
        <div className="lg:col-span-3 space-y-4">
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-full flex flex-col">
            <div className="mb-6">
              <span className="text-amber-600 text-[10px] font-black uppercase tracking-tighter bg-amber-600/10 px-2 py-0.5 rounded border border-amber-600/20">
                In-House Machining
              </span>
              <h3 className="text-white font-black text-2xl mt-3 tracking-tighter leading-none">{activeJob.subPart}</h3>
              <p className="text-zinc-500 text-xs mt-2 flex items-center gap-1 font-medium italic">
                Part of: <span className="text-zinc-300 not-italic font-bold underline decoration-amber-600/50">{activeJob.parentItem}</span>
              </p>
            </div>

            <div className="space-y-2 flex-1">
               <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3">Sub-Assembly Tree</p>
               {activeJob.components.map((c, i) => (
                 <div key={i} className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-zinc-800/50">
                    <div className={`w-2 h-2 rounded-full ${c.status === 'complete' ? 'bg-emerald-500' : 'bg-zinc-700 animate-pulse'}`}></div>
                    <span className={`text-xs font-bold ${c.status === 'complete' ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>{c.name}</span>
                 </div>
               ))}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                <ScanBarcode size={16} /> SCAN NEW SUB-PART
              </button>
            </div>
          </section>
        </div>

        {/* ⏱️ CENTER: PERFORMANCE & TIMING (6/12) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <section className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 flex-1 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
              <div className="h-full bg-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.5)] transition-all duration-500" style={{ width: `${(completed/totalInBatch)*100}%` }}></div>
            </div>

            <div className="w-full flex justify-between">
               <div>
                  <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-2">Cycle Timer</p>
                  <div className={`text-8xl font-black tabular-nums tracking-tighter ${timer > 480 ? 'text-red-500' : 'text-white'}`}>
                    {formatTime(timer)}
                  </div>
                  <p className="text-zinc-600 text-xs font-bold mt-2 uppercase tracking-widest">
                    Target Cycle: <span className="text-zinc-400">{activeJob.targetCycle}</span>
                  </p>
               </div>
               <div className="text-right">
                  <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] mb-1">Earned Value</p>
                  <p className="text-4xl font-black text-emerald-500 tracking-tighter tabular-nums">₱{ (completed * 12500 * 0.15).toLocaleString() }</p>
                  <p className="text-zinc-600 text-[10px] font-bold mt-1 uppercase tracking-widest">{activeJob.stationWeight}</p>
               </div>
            </div>

            {/* BIG ACTION BUTTONS */}
            <div className="w-full grid grid-cols-2 gap-8 mt-12">
               {!isRunning ? (
                 <button 
                   onClick={() => setIsRunning(true)}
                   className="bg-amber-600 hover:bg-amber-500 text-black rounded-3xl py-10 flex flex-col items-center gap-2 transition-all active:scale-95 shadow-2xl shadow-amber-600/10 group"
                 >
                   <Play size={40} fill="black" />
                   <span className="font-black text-xl uppercase tracking-tighter">Start Cycle</span>
                 </button>
               ) : (
                 <button 
                   onClick={() => setIsRunning(false)}
                   className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-3xl py-10 flex flex-col items-center gap-2 transition-all active:scale-95 border border-zinc-700 shadow-2xl shadow-black group"
                 >
                   <Pause size={40} fill="white" />
                   <span className="font-black text-xl uppercase tracking-tighter">Pause Machine</span>
                 </button>
               )}

               <button 
                 onClick={() => {
                   setCompleted(c => Math.min(c + 1, totalInBatch))
                   setTimer(0)
                 }}
                 disabled={!isRunning}
                 className="bg-white hover:bg-zinc-100 disabled:opacity-30 text-black rounded-3xl py-10 flex flex-col items-center gap-2 transition-all active:scale-95 shadow-2xl shadow-white/5 group"
               >
                 <CheckCircle2 size={40} />
                 <span className="font-black text-xl uppercase tracking-tighter">Complete Unit</span>
               </button>
            </div>

            <div className="w-full mt-10 flex justify-between items-end bg-black/40 p-6 rounded-3xl border border-zinc-800">
               <div>
                 <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1">Batch Progress</p>
                 <p className="text-4xl font-black text-white">{completed} <span className="text-zinc-700">/ {totalInBatch}</span></p>
               </div>
               <div className="flex gap-4">
                  <div className="h-12 w-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-full bg-emerald-500 transition-all duration-700" style={{ height: '70%' }}></div>
                  </div>
                  <div className="h-12 w-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-full bg-amber-500 transition-all duration-700" style={{ height: '40%' }}></div>
                  </div>
               </div>
            </div>
          </section>
        </div>

        {/* 🚩 RIGHT: QUALITY & LOGS (3/12) */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-inner">
            <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Info size={14} className="text-amber-500" /> Instructions
            </h3>
            <p className="text-zinc-300 text-sm leading-relaxed font-medium bg-black/40 p-4 rounded-2xl border border-zinc-800 italic">
              "{activeJob.instructions}"
            </p>
          </section>

          <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer active:scale-95 transition-all">
             <div className="absolute top-[-10%] right-[-10%] opacity-10 group-hover:rotate-12 transition-transform">
               <Camera size={120} />
             </div>
             <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-1">QC Verification</h3>
             <p className="text-xl font-black mb-4 tracking-tighter">Submit Photo Proof</p>
             <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center gap-2 border border-white/30 text-xs font-black uppercase">
               Open Camera <ArrowUpRight size={14} />
             </div>
          </section>

          <section className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 flex-1 flex flex-col">
            <h3 className="text-red-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle size={14} /> Machine Incident
            </h3>
            <div className="grid gap-2 flex-1">
              {['Material Waste', 'Tool Failure', 'Drawing Error'].map(err => (
                <button key={err} className="text-left bg-zinc-900 hover:bg-red-500/10 border border-zinc-800 p-3 rounded-xl transition-all group">
                   <p className="text-[10px] font-black text-zinc-500 group-hover:text-red-400 uppercase tracking-tighter leading-none mb-1">Report</p>
                   <p className="text-sm font-bold text-zinc-300 group-hover:text-white uppercase leading-none">{err}</p>
                </button>
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* 🏁 STATION FOOTER */}
      <footer className="px-6 py-2 flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
        <div className="flex gap-10">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> System Live</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div> CNC-R01 Master</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-zinc-500">Station Hardware Rev. 4.2</span>
          <Settings size={12} className="text-zinc-700" />
        </div>
      </footer>
    </div>
  )
}
