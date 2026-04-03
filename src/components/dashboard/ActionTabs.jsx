const ACTIONS = [
  { id: 'comparison', label: 'Comparison' },
  { id: 'conversion', label: 'Conversion' },
  { id: 'arithmetic', label: 'Arithmetic' },
]

export default function ActionTabs({ selected, onSelect }) {
  return (
    <div className="flex gap-0 bg-[#f3f4f6] rounded-[10px] p-1 w-fit max-sm:w-full">
      {ACTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`px-[22px] py-2 rounded-lg font-nunito text-[14px] font-bold transition-all duration-200
            max-sm:flex-1 max-sm:px-2.5 max-sm:text-[13px]
            ${selected === id
              ? 'bg-[#3b5bdb] text-white shadow-[0_2px_10px_rgba(59,91,219,0.35)]'
              : 'bg-transparent text-[#6b7280] hover:text-[#1a1a2e] hover:bg-[rgba(59,91,219,0.07)]'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
