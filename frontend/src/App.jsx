import { useState } from 'react'
import DesignA from './designs/DesignA'
import DesignB from './designs/DesignB'
import DesignC from './designs/DesignC'
import DesignD from './designs/DesignD'
import DesignE from './designs/DesignE'

const designs = [
  {
    id: 'E',
    name: 'Mejore Industrial Forge',
    desc: 'High-utility machine terminal with Burnt Amber accents. Built for CNC & Assembly floor hardware.',
    best: 'CNC Stations, Assembly Lines, Tablet/Embedded Screens',
    tags: ['Brand Aligned', 'Rugged', 'Operator-First'],
  },
  {
    id: 'B',
    name: 'Clean Operations',
    desc: 'Light mode · Sidebar nav · Data table layout. Professional office management interface.',
    best: 'Manager/office view, desktop or tablet landscape',
    tags: ['Management', 'Enterprise', 'Financials'],
  },
  {
    id: 'A',
    name: 'Factory Dark',
    desc: 'Classic industrial dark mode with tabbed navigation.',
    best: 'High-glare environments, General Supervisors',
    tags: ['Dark', 'Industrial', 'Supervisor'],
  },
  {
    id: 'C',
    name: 'Floor Card',
    desc: 'Touch-first mobile card view for roaming inspectors.',
    best: 'Roaming QA, Material Handlers, Mobile/Phone',
    tags: ['Mobile', 'Tactile', 'QA'],
  },
]

export default function App() {
  const [selected, setSelected] = useState(null)

  if (selected === 'A') return <DesignA />
  if (selected === 'B') return <DesignB />
  if (selected === 'C') return <DesignC />
  if (selected === 'D') return <DesignD />
  if (selected === 'E') return <DesignE />

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col items-center justify-center p-8 font-sans">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <div className="bg-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-600/20">
             <svg width=\"32\" height=\"32\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"black\" strokeWidth=\"3\" strokeLinecap=\"round\" strokeLinejoin=\"round\"><path d=\"M12 2v10\"/><path d=\"M18.4 4.6a10 10 0 1 1-12.8 0\"/></svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Mejore MES Hierarchy</h1>
          <p className="text-slate-500 font-medium">Select a module to enter the specialized factory interface.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {designs.map(d => (
            <button key={d.id} onClick={() => setSelected(d.id)}
              className={`text-left transition-all group relative overflow-hidden rounded-3xl p-8 border 
                ${d.id === 'E' 
                  ? 'bg-slate-900 border-amber-600/50 hover:border-amber-600 shadow-2xl shadow-amber-600/5' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'}`}>
              
              <div className=\"absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity\">
                <span className=\"text-7xl font-black italic text-white\">{d.id}</span>
              </div>

              {d.id === 'E' && (
                <span className="bg-amber-600 text-black text-[10px] font-black px-2 py-1 rounded mb-4 inline-block uppercase tracking-widest">
                  Brand Recommended
                </span>
              )}

              <h2 className="text-white font-black text-2xl mb-2 tracking-tight">{d.name}</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed font-medium">{d.desc}</p>
              
              <div className="space-y-4">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${d.id === 'E' ? 'bg-amber-600' : 'bg-slate-700'}`}></span> Deploy to: {d.best}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {d.tags.map(t => (
                    <span key={t} className="text-[10px] uppercase font-black tracking-widest bg-black/40 text-slate-400 px-3 py-1 rounded-lg border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`mt-8 text-sm font-black flex items-center gap-2 transition-colors 
                ${d.id === 'E' ? 'text-amber-500 group-hover:text-amber-400' : 'text-slate-400 group-hover:text-white'}`}>
                INITIALIZE STATION <ChevronRight size={18} />
              </div>
            </button>
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-slate-900 text-center">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">Mejore Manufacturing Execution System · Since 1983</p>
        </footer>
      </div>
    </div>
  )
}

function ChevronRight({ size }) {
  return (
    <svg width={size} height={size} viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" strokeWidth=\"3\" strokeLinecap=\"round\" strokeLinejoin=\"round\">
      <path d=\"m9 18 6-6-6-6\"/>
    </svg>
  )
}
