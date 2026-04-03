export default function BrandPanel() {
  return (
    <div className="w-[230px] shrink-0 bg-gradient-to-br from-[#1a1f6e] to-[#3b5bdb] flex flex-col items-center justify-center px-5 py-8 gap-3 max-sm:w-full max-sm:flex-row max-sm:justify-start max-sm:py-5 max-sm:px-6">
      {/* Logo */}
      <div className="shrink-0">
        <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" width="68" className="max-sm:w-10">
          <rect x="20" y="5"  width="40" height="65" rx="6" fill="#5b8af5" opacity="0.9"/>
          <rect x="25" y="55" width="30" height="15" rx="3" fill="#7ba3ff"/>
          <rect x="25" y="35" width="30" height="12" rx="3" fill="#a8c0ff" opacity="0.7"/>
          <rect x="10" y="70" width="60" height="12" rx="4" fill="#e2a96a"/>
          <rect x="15" y="72" width="8"  height="8"  rx="1" fill="#c47d3a"/>
          <rect x="27" y="72" width="8"  height="8"  rx="1" fill="#c47d3a"/>
          <rect x="39" y="72" width="8"  height="8"  rx="1" fill="#c47d3a"/>
          <rect x="51" y="72" width="8"  height="8"  rx="1" fill="#c47d3a"/>
          <rect x="63" y="72" width="8"  height="8"  rx="1" fill="#c47d3a"/>
        </svg>
      </div>

      <div className="flex flex-col items-center gap-2 max-sm:items-start">
        <h1 className="font-raleway text-[15px] font-extrabold text-white text-center tracking-[2px] leading-snug max-sm:text-[13px] max-sm:text-left">
          QUANTITY<br />MEASUREMENT
        </h1>
        <p className="text-[11px] text-white/60 tracking-wide text-center max-sm:text-[10px] max-sm:text-left">
          Measure, Convert &amp; Compare
        </p>
        <div className="mt-2 flex flex-col gap-1.5 w-full max-sm:hidden">
          {['Length & Weight', 'Temperature', 'Volume'].map((f) => (
            <div key={f} className="flex items-center gap-2 text-[11px] text-white/65">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
