import { useState, useRef, useEffect } from 'react'

export const OP_LABELS = {
  '+': { symbol: '+', label: 'Add' },
  '-': { symbol: '−', label: 'Subtract' },
  '×': { symbol: '×', label: 'Multiply' },
  '÷': { symbol: '÷', label: 'Divide' },
}

export default function OpDropdown({ selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const wrapRef         = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSelect(op) {
    onSelect(op)
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative flex items-center justify-center w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-[10px] border-2 bg-white font-nunito text-xl font-extrabold
          text-[#3b5bdb] cursor-pointer select-none transition-all duration-200 min-w-[64px] justify-center
          ${open
            ? 'border-[#3b5bdb] bg-[#eef2ff] shadow-[0_4px_14px_rgba(59,91,219,0.18)]'
            : 'border-[#e0e7ff] hover:border-[#3b5bdb] hover:bg-[#eef2ff] hover:shadow-[0_4px_14px_rgba(59,91,219,0.18)] hover:-translate-y-0.5'
          } active:scale-95`}
      >
        <span>{OP_LABELS[selected].symbol}</span>
        <span className={`text-[10px] text-[#6b7280] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▲
        </span>
      </button>

      {/* Menu — opens UPWARD */}
      <div
        className={`absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white border-[1.5px] border-[#e0e7ff]
          rounded-xl shadow-[0_-4px_28px_rgba(59,91,219,0.15),0_2px_8px_rgba(59,91,219,0.08)]
          overflow-hidden z-50 min-w-[150px] transition-all duration-200
          ${open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
      >
        {Object.entries(OP_LABELS).map(([op, meta]) => (
          <button
            key={op}
            type="button"
            onClick={() => handleSelect(op)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-[14px] font-bold text-left
              border-b border-[#e0e7ff] last:border-b-0 transition-all duration-150 group
              ${selected === op
                ? 'bg-[#eef2ff] text-[#3b5bdb]'
                : 'text-[#1a1a2e] hover:bg-[#eef2ff] hover:text-[#3b5bdb]'
              }`}
          >
            <span
              className={`w-7 h-7 flex items-center justify-center rounded-md text-[16px] font-black shrink-0 transition-all duration-150
                ${selected === op
                  ? 'bg-[#3b5bdb] text-white'
                  : 'bg-[#eef2ff] text-[#3b5bdb] group-hover:bg-[#3b5bdb] group-hover:text-white'
                }`}
            >
              {meta.symbol}
            </span>
            <span>{meta.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
