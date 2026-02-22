// Design C: "Floor Card" — Tablet-first, big tappable cards, minimal chrome
// Best for: factory workers on tablets — glanceable, touch-friendly, task-driven
// Color: warm off-white + deep wood brown + status colors — feels tactile

import { useState } from 'react'
import {
  Hammer, Package, CreditCard, Camera, CheckCircle,
  Clock, AlertOctagon, Plus, ChevronUp, ChevronDown,
  ArrowRight, Wifi
} from 'lucide-react'

const workOrders = [
  { id: 'WO-101', sku: 'CHAIR-001',    name: 'Dining Chair',        qty: 10, done: 6,  due: 'Mar 1',  urgent: false },
  { id: 'WO-102', sku: 'TABLE-002',    name: 'Oak Dining Table',    qty: 5,  done: 0,  due: 'Mar 5',  urgent: false },
  { id: 'WO-103', sku: 'WARDROBE-003', name: 'Sliding Wardrobe',    qty: 3,  done: 3,  due: 'Feb 28', urgent: false },
  { id: 'WO-104', sku: 'CABINET-004',  name: 'Kitchen Cabinet',     qty: 8,  done: 3,  due: 'Mar 6',  urgent: true  },
]

const pages = [
  { id: 'floor',    icon: Hammer,    label: 'Floor'    },
  { id: 'bom',      icon: Package,   label: 'BOM'      },
  { id: 'invoices', icon: CreditCard,label: 'Invoices' },
  { id: 'qc',       icon: Camera,    label: 'QC'       },
]

function WOCard({ wo }) {
  const [open, setOpen] = useState(false)
  const pct = Math.round((wo.done / wo.qty) * 100)
  const done = wo.done === wo.qty
  const borderColor = wo.urgent ? 'border-l-red-500' : done ? 'border-l-emerald-500' : 'border-l-amber-400'

  return (
    <div className={`bg-white rounded-2xl border border-stone-200 border-l-4 ${borderColor} shadow-sm overflow-hidden`}>
      {/* Main row — always visible */}
      <button className="w-full p-5 text-left flex items-center justify-between gap-4"
        onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs font-bold text-stone-400 uppercase tracking-wider">{wo.id}</span>
            {wo.urgent && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <AlertOctagon size={10} /> Urgent
              </span>
            )}
            {done && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <CheckCircle size={10} /> Done
              </span>
            )}
          </div>
          <p className="text-stone-900 font-bold text-lg leading-tight">{wo.name}</p>
          <p className="text-stone-400 text-sm mt-0.5">{wo.sku}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-stone-900 font-black text-3xl leading-none">{wo.done}<span className="text-stone-400 font-normal text-lg">/{wo.qty}</span></p>
          <p className="text-stone-400 text-xs mt-1">units</p>
        </div>
        <div className="text-stone-400 ml-2">
          {open ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
        </div>
      </button>

      {/* Progress bar */}
      <div className="px-5 pb-2">
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${done ? 'bg-emerald-400' : wo.urgent ? 'bg-red-400' : 'bg-amber-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 pb-5 pt-3 border-t border-stone-100 mt-2 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500 flex items-center gap-1"><Clock size={13}/> Due {wo.due}</span>
            <span className="text-stone-500">{pct}% complete</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Camera size={15} /> Add QC Photo
            </button>
            <button className={`text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors
              ${done
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-amber-400 hover:bg-amber-500 text-white'}`}>
              {done ? <CheckCircle size={15}/> : <Hammer size={15}/>}
              {done ? 'Mark Finished' : 'Update Progress'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DesignC() {
  const [page, setPage] = useState('floor')

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-[#3d2b1f] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-white font-black text-xl tracking-tight">Mejore</h1>
          <p className="text-amber-300/70 text-xs font-medium">Factory Floor</p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
          <Wifi size={12} className="text-emerald-400" />
          <span className="text-white/80 text-xs">Online</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-24 space-y-3 max-w-2xl mx-auto w-full">
        {page === 'floor' && (
          <>
            {/* Today summary */}
            <div className="bg-[#3d2b1f] rounded-2xl p-4 text-white mb-2">
              <p className="text-amber-300/70 text-xs font-medium uppercase tracking-wider mb-2">Today — Feb 22</p>
              <div className="grid grid-cols-3 gap-4">
                <div><p className="text-2xl font-black">3</p><p className="text-white/50 text-xs">Active WOs</p></div>
                <div><p className="text-2xl font-black">9<span className="text-white/50 text-base font-normal">/26</span></p><p className="text-white/50 text-xs">Units done</p></div>
                <div><p className="text-2xl font-black text-red-400">1</p><p className="text-white/50 text-xs">Urgent</p></div>
              </div>
            </div>

            {/* Work order cards */}
            <div className="flex justify-between items-center px-1">
              <h2 className="text-stone-700 font-semibold text-sm uppercase tracking-wider">Work Orders</h2>
              <button className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                New WO <Plus size={12}/>
              </button>
            </div>

            {/* Sort urgent first */}
            {[...workOrders].sort((a,b) => b.urgent - a.urgent).map(wo => (
              <WOCard key={wo.id} wo={wo} />
            ))}
          </>
        )}

        {page === 'bom' && (
          <div className="space-y-3">
            <label className="block bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl p-10 text-center cursor-pointer active:bg-amber-100 transition-colors">
              <Plus size={32} className="mx-auto text-amber-400 mb-2" />
              <p className="text-stone-700 font-semibold">Import PYTHA BOM</p>
              <p className="text-stone-400 text-sm mt-1">XML or CSV</p>
              <input type="file" className="hidden" accept=".xml,.csv" />
            </label>
            {[
              { f: 'chair-001-bom.xml',    s: 'Parsed', c: 'text-emerald-600', t: '2m ago' },
              { f: 'wardrobe-003-bom.csv', s: 'In OT',  c: 'text-sky-600',     t: '1h ago' },
              { f: 'table-002-bom.xml',    s: 'Error',  c: 'text-red-600',     t: '3h ago' },
            ].map((b,i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-mono text-stone-800 font-semibold text-sm">{b.f}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{b.t}</p>
                </div>
                <span className={`text-sm font-bold ${b.c}`}>{b.s}</span>
              </div>
            ))}
          </div>
        )}

        {page === 'invoices' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-sm">
            <CreditCard size={36} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-700 font-semibold">Connect QuickBooks</p>
            <p className="text-stone-400 text-sm mt-1 mb-4">View open invoices and payment status</p>
            <button className="bg-[#3d2b1f] text-white font-semibold px-5 py-3 rounded-xl w-full flex items-center justify-center gap-2">
              Authenticate QBO <ArrowRight size={16} />
            </button>
          </div>
        )}

        {page === 'qc' && (
          <div className="space-y-3">
            <label className="block bg-stone-100 border-2 border-dashed border-stone-300 rounded-2xl p-10 text-center cursor-pointer active:bg-stone-200">
              <Camera size={32} className="mx-auto text-stone-400 mb-2" />
              <p className="text-stone-700 font-semibold">Take QC Photo</p>
              <p className="text-stone-400 text-sm mt-1">Attach to a work order</p>
              <input type="file" className="hidden" accept="image/*" capture="environment" />
            </label>
            <p className="text-stone-400 text-center text-sm pt-2">No photos yet today</p>
          </div>
        )}
      </main>

      {/* Bottom nav — big tap targets */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-2 py-2 flex justify-around z-10">
        {pages.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setPage(id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors min-w-0
              ${page === id ? 'text-[#3d2b1f]' : 'text-stone-400'}`}>
            <div className={`p-2 rounded-xl ${page === id ? 'bg-amber-100' : ''}`}>
              <Icon size={20} />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
