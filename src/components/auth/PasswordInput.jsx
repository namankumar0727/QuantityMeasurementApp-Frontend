import { useState } from 'react'
import EyeIcon from './EyeIcon'

export default function PasswordInput({ id, value, placeholder, onChange, hasError }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3.5 py-2.5 pr-11 border-[1.5px] rounded-lg font-nunito text-sm text-[#1a1a2e] outline-none transition-all duration-200
          ${hasError
            ? 'border-danger-500 bg-red-50'
            : 'border-[#e0e0e0] hover:border-[#b0b8e0] focus:border-[#3b5bdb] focus:shadow-[0_0_0_3px_rgba(59,91,219,0.12)] focus:bg-[#f8faff]'
          }`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#3b5bdb] transition-colors w-[22px] h-[22px] flex items-center justify-center"
      >
        <EyeIcon visible={show} />
      </button>
    </div>
  )
}
