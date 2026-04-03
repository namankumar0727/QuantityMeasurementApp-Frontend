const TYPES = [
  {
    type: 'length',
    label: 'Length',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="4"  y="17" width="32" height="6"  rx="3"   fill="#6b8cff"/>
        <rect x="4"  y="14" width="3"  height="12" rx="1.5" fill="#3b5bdb"/>
        <rect x="33" y="14" width="3"  height="12" rx="1.5" fill="#3b5bdb"/>
      </svg>
    ),
  },
  {
    type: 'weight',
    label: 'Weight',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="20" cy="30" rx="14" ry="7" fill="#6b8cff" opacity="0.3"/>
        <path d="M10 28 Q20 12 30 28" stroke="#3b5bdb" strokeWidth="2.5" fill="#a5b4fc" fillOpacity="0.4"/>
        <line x1="20" y1="8" x2="20" y2="13" stroke="#3b5bdb" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="7" r="3" fill="#3b5bdb"/>
      </svg>
    ),
  },
  {
    type: 'temperature',
    label: 'Temperature',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="17"   y="5"  width="6" height="20" rx="3"   fill="#ff6b6b" opacity="0.4"/>
        <rect x="18.5" y="5"  width="3" height="18" rx="1.5" fill="#ff6b6b"/>
        <circle cx="20" cy="28" r="5" fill="#ff6b6b"/>
        <line x1="24" y1="11" x2="27" y2="11" stroke="#ff6b6b" strokeWidth="1.5"/>
        <line x1="24" y1="15" x2="26" y2="15" stroke="#ff6b6b" strokeWidth="1.5"/>
        <line x1="24" y1="19" x2="27" y2="19" stroke="#ff6b6b" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    type: 'volume',
    label: 'Volume',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M12 8 L9 32 Q9 34 12 34 L28 34 Q31 34 31 32 L28 8 Z" fill="#a78bfa" opacity="0.3"/>
        <path d="M12 8 L9 32 Q9 34 12 34 L28 34 Q31 34 31 32 L28 8 Z" stroke="#7c3aed" strokeWidth="2" fill="none"/>
        <path d="M9 22 Q12 20 15 22 Q18 24 21 22 Q24 20 27 22 Q29 23 31 22" stroke="#7c3aed" strokeWidth="1.5" fill="none"/>
        <rect x="10" y="6" width="20" height="4" rx="2" fill="#7c3aed"/>
      </svg>
    ),
  },
]

export default function TypeGrid({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-3.5 max-sm:grid-cols-2 max-sm:gap-2.5">
      {TYPES.map(({ type, label, icon }) => {
        const isActive = selected === type
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`border-2 rounded-[14px] py-[18px] px-3 pb-3.5 flex flex-col items-center gap-2.5
              text-[13px] font-bold transition-all duration-200 select-none group
              ${isActive
                ? 'border-[#3b5bdb] bg-[#eef2ff] text-[#3b5bdb] shadow-[0_4px_16px_rgba(59,91,219,0.18)]'
                : 'border-[#e0e7ff] bg-[#fafbff] text-[#6b7280] hover:border-[#3b5bdb] hover:text-[#3b5bdb] hover:shadow-[0_6px_20px_rgba(59,91,219,0.15)] hover:-translate-y-0.5'
              } active:scale-[0.98]`}
          >
            <div className={`w-10 h-10 transition-transform duration-200 ${!isActive ? 'group-hover:scale-110' : ''}`}>
              {icon}
            </div>
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
