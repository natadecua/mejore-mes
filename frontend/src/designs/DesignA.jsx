// Design A: "Factory Dark" — Dark mode, high contrast, industrial feel
// Best for: factory floor tablets under harsh lighting
// Color: dark slate + amber accent + green/red status

import { useState } from 'react'
import {
  ClipboardList, Package, DollarSign, Camera,
  CheckCircle, AlertCircle, Clock, ChevronRight,
  Zap, TrendingUp, RefreshCw, Upload
} from 'lucide-react'

const mockOrders = [
  { id: 'WO-101', item: 'CHAIR-001 Dining Chair', qty: 10, status: 'In Production', due: 'Mar 1', pct: 60 },
  { id: 'WO-102', item: 'TABLE-002 Oak Dining Table', qty: 5, status: 'Open', due: 'Mar 5', pct: 0 },
  { id: 'WO-103', item: 'WARDROBE-003 Sliding', qty: 3, status: 'Finished', due: 'Feb 28', pct: 100 },
  { id: 'WO-104', item: 'CABINET-004 Kitchen', qty: 8, status: 'In Production', due: 'Mar 8', pct: 35 },
]

const mockBOMs = [
  { id: 1, file: 'chair-001-bom.xml', status: 'parsed', items: 5, time: '2m ago' },
  { id: 2, file: 'wardrobe-003-bom.csv', status: 'pushed_to_ot', items: 6, time: '1h ago' },
  { id: 3, file: 'table-002-bom.xml', status: 'error', items: 0, time: '3h ago' },
]

const statusStyles = {
  'In Production': 'text-amber-400 bg-amber-400/10 border border-amber-400/20',
  'Open':          'text-sky-400 bg-sky-400/10 border border-sky-400/20',
  'Finished':      'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20',
  'parsed':        'text-emerald-400',
  'pushed_to_ot':  'text-sky-400',
  'error':         'text-red-400',
}

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex gap-4 items-start">
      <div className={`p-2 rounded-lg ${accent}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function DesignA() {
  const [activeTab, setActiveTab] = useState('orders')

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="border-b border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">Mejore MES</h1>
            <p className="text-slate-400 text-xs">Manufacturing Floor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-slate-400 text-xs">Live</span>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={ClipboardList} label="Active Orders"  value="3"    sub="1 due today"   accent="bg-amber-500" />
          <StatCard icon={Package}      label="BOM Imports"     value="12"   sub="2 this week"   accent="bg-sky-500" />
          <StatCard icon={DollarSign}   label="Open Invoices"   value="₱4.2M" sub="3 unpaid"     accent="bg-violet-500" />
          <StatCard icon={Camera}       label="QC Photos"       value="28"   sub="Today"          accent="bg-emerald-600" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800 rounded-xl p-1 w-fit">
          {[['orders','Work Orders'], ['bom','BOM Imports'], ['invoices','Invoices']].map(([k,l]) => (
            <button key={k} onClick={() => setActiveTab(k)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${activeTab === k ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>

        {/* Orders Panel */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {mockOrders.map(wo => (
              <div key={wo.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-mono text-sm font-bold">{wo.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[wo.status]}`}>
                        {wo.status}
                      </span>
                    </div>
                    <p className="text-white font-medium mt-1">{wo.item}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Qty</p>
                    <p className="text-white font-bold text-lg">{wo.qty}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-slate-400">{wo.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${wo.pct === 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                      style={{ width: `${wo.pct}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-slate-500 text-xs flex items-center gap-1"><Clock size={11} /> Due {wo.due}</span>
                  <button className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
                    Details <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOM Imports Panel */}
        {activeTab === 'bom' && (
          <div className="space-y-3">
            <label className="block border-2 border-dashed border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500/50 transition-colors group">
              <Upload size={24} className="mx-auto text-slate-500 group-hover:text-amber-400 mb-2 transition-colors" />
              <p className="text-slate-400 text-sm">Drop PYTHA XML or CSV here</p>
              <p className="text-slate-600 text-xs mt-1">or click to browse</p>
              <input type="file" className="hidden" accept=".xml,.csv" />
            </label>
            {mockBOMs.map(b => (
              <div key={b.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 rounded-lg p-2">
                    <Package size={16} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium font-mono">{b.file}</p>
                    <p className="text-slate-500 text-xs">{b.items} components · {b.time}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${statusStyles[b.status]}`}>
                  {b.status === 'pushed_to_ot' ? '✓ In OT' : b.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <DollarSign size={32} className="mx-auto text-slate-600 mb-2" />
            <p className="text-slate-400">Connect QuickBooks to view invoices</p>
            <button className="mt-3 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-lg transition-colors">
              Connect QBO →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
