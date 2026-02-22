import { useState } from 'react'
import DesignA from './designs/DesignA'
import DesignB from './designs/DesignB'
import DesignC from './designs/DesignC'
import DesignD from './designs/DesignD'
import DesignE from './designs/DesignE'
import DesignF from './designs/DesignF'

const designs = [
  {
    id: 'F',
    name: 'Industrial Pulse',
    desc: 'The machine-terminal. Focus on cycle timing, sub-part trees, and project value completion.',
    best: 'CNC/Machining/Assembly Stations (Tablet)',
    tags: ['Customized', 'Timing', 'Value-First'],
  },
  {
    id: 'E',
    name: 'Mejore Forge',
    desc: 'Rugged, brand-aligned terminal with high-contrast amber accents.',
    best: 'Factory Floor (Tablet)',
    tags: ['Brand Aligned', 'Rugged'],
  },
  {
    id: 'B',
    name: 'Office Hub',
    desc: 'Management dashboard for project oversight and financial health.',
    best: 'Manager Office (Desktop)',
    tags: ['Management', 'Enterprise'],
  },
  {
    id: 'C',
    name: 'Floor Walker',
    desc: 'Touch-first mobile card view for QA and roaming inspectors.',
    best: 'Roaming QA / Warehouse (Phone)',
    tags: ['Mobile', 'QA'],
  },
]

export default function App() {
  const [selected, setSelected] = useState(null)

  if (selected === 'A') return <DesignA />
  if (selected === 'B') return <DesignB />
  if (selected === 'C') return <DesignC />
  if (selected === 'D') return <DesignD />
  if (selected === 'E') return <DesignE />
  if (selected === 'F') return <DesignF />

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="bg-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-600/20">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10"/><path d="M18.4 4.6a10 10 0 1 1-12.8 0"/></svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">Mejore <span className="text-amber-600 not-italic">MES</span></h1>
          <p className="text-slate-500 font-medium">Factory Floor Hierarchy v2.0 — Custom Workflow Architecture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {designs.map(d => (
            <button key={d.id} onClick={() => setSelected(d.id)}
              className={`text-left transition-all group relative overflow-hidden rounded-3xl p-8 border 
                ${d.id === 'F' 
                  ? 'bg-zinc-900 border-amber-600/50 hover:border-amber-600 shadow-2xl shadow-amber-600/5' 
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-600'}`}>
              
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-7xl font-black italic text-white">{d.id}</span>
              </div>

              {d.id === 'F' && (
                <span className="bg-amber-600 text-black text-[10px] font-black px-2 py-1 rounded mb-4 inline-block uppercase tracking-widest">
                  New: Machine Timing
                </span>
              )}

              <h2 className="text-white font-black text-2xl mb-2 tracking-tight">{d.name}</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed font-medium">{d.desc}</p>
              
              <div className="space-y-4">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${d.id === 'F' ? 'bg-amber-600 animate-pulse' : 'bg-zinc-700'}`}></span> Deploy to: {d.best}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {d.tags.map(t => (
                    <span key={t} className="text-[10px] uppercase font-black tracking-widest bg-black/40 text-slate-400 px-3 py-1 rounded-lg border border-zinc-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`mt-8 text-sm font-black flex items-center gap-2 transition-colors 
                ${d.id === 'F' ? 'text-amber-500 group-hover:text-amber-400' : 'text-zinc-400 group-hover:text-white'}`}>
                INITIALIZE STATION <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">Mejore Manufacturing Execution System · Batangas City, PH</p>
        </footer>
      </div>
    </div>
  )
}

function ChevronRight({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}
