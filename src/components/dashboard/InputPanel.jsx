import { useState, useEffect, useCallback } from 'react';
import { quantityAPI } from '../../services/api';
import { toast } from 'react-toastify';
import OpDropdown, { OP_LABELS } from './OpDropdown';

// Unit mapping for display
const UNIT_DISPLAY = {
  METER: 'Meter', KILOMETER: 'Kilometer', CENTIMETER: 'Centimeter', MILLIMETER: 'Millimeter',
  MILE: 'Mile', YARD: 'Yard', FOOT: 'Foot', INCH: 'Inch',
  KILOGRAM: 'Kilogram', GRAM: 'Gram', MILLIGRAM: 'Milligram', POUND: 'Pound', OUNCE: 'Ounce',
  LITER: 'Liter', MILLILITER: 'Milliliter', GALLON: 'Gallon', QUART: 'Quart', PINT: 'Pint',
  CELSIUS: 'Celsius', FAHRENHEIT: 'Fahrenheit', KELVIN: 'Kelvin'
};

const UNITS_BY_TYPE = {
  length: ['METER', 'KILOMETER', 'CENTIMETER', 'MILLIMETER', 'MILE', 'YARD', 'FOOT', 'INCH'],
  weight: ['KILOGRAM', 'GRAM', 'MILLIGRAM', 'POUND', 'OUNCE'],
  volume: ['LITER', 'MILLILITER', 'GALLON', 'QUART', 'PINT'],
  temperature: ['CELSIUS', 'FAHRENHEIT', 'KELVIN']
};

const TYPE_MAP = {
  length: 'LENGTH',
  weight: 'WEIGHT',
  volume: 'VOLUME',
  temperature: 'TEMPERATURE'
};

export default function InputPanel({ measureType, action }) {
  const units = UNITS_BY_TYPE[measureType] || UNITS_BY_TYPE.length;
  const [fromVal, setFromVal] = useState('1');
  const [toVal, setToVal] = useState('');
  const [fromUnit, setFromUnit] = useState(units[0]);
  const [toUnit, setToUnit] = useState(units[1] || units[0]);
  const [op, setOp] = useState('+');
  const [result, setResult] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultKey, setResultKey] = useState(0);

  // ✅ Check if arithmetic is allowed for current measurement type
  const isArithmeticAllowed = measureType !== 'temperature';

  // ✅ Check if execute button should be enabled
  const isExecuteEnabled = useCallback(() => {
    const fv = parseFloat(fromVal);
    if (isNaN(fv)) return false;

    if (action === 'conversion') {
      // Conversion only needs from value
      return !isNaN(fv);
    } 
    else if (action === 'comparison') {
      // Comparison needs both values
      const tv = parseFloat(toVal);
      return !isNaN(fv) && !isNaN(tv);
    } 
    else if (action === 'arithmetic') {
      // Check temperature restriction first
      if (measureType === 'temperature') return false;
      // Arithmetic needs both values
      const tv = parseFloat(toVal);
      return !isNaN(fv) && !isNaN(tv);
    }
    
    return false;
  }, [fromVal, toVal, action, measureType]);

  // ✅ Check if second input should be required/disabled
  const isSecondInputRequired = action !== 'conversion';
  const isSecondInputDisabled = action === 'conversion';

  useEffect(() => {
    const u = UNITS_BY_TYPE[measureType] || UNITS_BY_TYPE.length;
    setFromUnit(u[0]);
    setToUnit(u[1] || u[0]);
    setFromVal('1');
    setToVal('');
    setResult('');
    
    // ✅ If temperature is selected and action is arithmetic, show warning
    if (measureType === 'temperature' && action === 'arithmetic') {
      setResult('⚠️ Arithmetic operations are not supported for Temperature measurements');
      setIsError(true);
      setResultKey(k => k + 1);
    } else {
      // Clear result when changing type/action
      setResult('');
      setIsError(false);
    }
  }, [measureType, action]);

  const calculate = useCallback(async () => {
    const fv = parseFloat(fromVal);
    
    if (isNaN(fv)) {
      setResult('Enter a valid value');
      setIsError(true);
      setResultKey(k => k + 1);
      return;
    }

    // ✅ Check temperature arithmetic restriction
    if (measureType === 'temperature' && action === 'arithmetic') {
      setResult('Arithmetic operations are not supported for Temperature measurements');
      setIsError(true);
      setResultKey(k => k + 1);
      return;
    }

    // Validate required fields based on action
    if (action !== 'conversion') {
      const tv = parseFloat(toVal);
      if (isNaN(tv)) {
        setResult('Enter both values to proceed');
        setIsError(true);
        setResultKey(k => k + 1);
        return;
      }
    }

    setLoading(true);
    const type = TYPE_MAP[measureType];

    try {
      if (action === 'comparison') {
        const tv = parseFloat(toVal);
        const response = await quantityAPI.compare({
          value1: fv, unit1: fromUnit,
          value2: tv, unit2: toUnit,
          type: type
        });
        setResult(response.data.message);
        setIsError(false);
        setResultKey(k => k + 1);

      } else if (action === 'conversion') {
        const response = await quantityAPI.convert({
          value: fv, fromUnit: fromUnit, toUnit: toUnit, type: type
        });
        setToVal(response.data.value.toFixed(4));
        setResult(response.data.result);
        setIsError(false);
        setResultKey(k => k + 1);

      } else if (action === 'arithmetic') {
        const tv = parseFloat(toVal);
        
        let response;
        switch (op) {
          case '+': response = await quantityAPI.add({ value1: fv, unit1: fromUnit, value2: tv, unit2: toUnit, type: type }); break;
          case '-': response = await quantityAPI.subtract({ value1: fv, unit1: fromUnit, value2: tv, unit2: toUnit, type: type }); break;
          case '×': response = await quantityAPI.multiply({ value1: fv, unit1: fromUnit, value2: tv, unit2: toUnit, type: type }); break;
          case '÷': response = await quantityAPI.divide({ value1: fv, unit1: fromUnit, value2: tv, unit2: toUnit, type: type }); break;
          default: return;
        }
        setResult(response.data.result);
        setIsError(false);
        setResultKey(k => k + 1);
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Calculation failed';
      setResult(message);
      setIsError(true);
      toast.error(message);
      setResultKey(k => k + 1);
    } finally {
      setLoading(false);
    }
  }, [fromVal, toVal, fromUnit, toUnit, op, action, measureType]);

  const handleExecute = () => {
    if (isExecuteEnabled()) {
      calculate();
    }
  };

  const isConversion = action === 'conversion';
  const showExecuteButton = !(measureType === 'temperature' && action === 'arithmetic');
  const isButtonDisabled = !isExecuteEnabled() || loading;
  
  const inputCls = 'font-raleway text-[32px] font-extrabold text-[#1a1a2e] border-0 border-b-2 border-[#e0e7ff] outline-none bg-transparent w-full py-1 transition-all duration-200 focus:border-[#3b5bdb] max-sm:text-2xl';
  const selectCls = 'mt-0.5 px-3 py-2 border-[1.5px] border-[#e0e7ff] rounded-lg font-nunito text-[14px] font-bold text-[#1a1a2e] bg-white cursor-pointer outline-none transition-all duration-200 hover:border-[#b0b8e0] focus:border-[#3b5bdb] focus:shadow-[0_0_0_3px_rgba(59,91,219,0.10)] w-full';

  return (
    <div>
      <div className="flex items-end gap-5 flex-wrap max-sm:gap-2.5">
        <div className="flex-1 min-w-[140px] flex flex-col gap-2">
          <p className="text-[11px] font-extrabold tracking-[2px] text-[#6b7280]">
            {action === 'arithmetic' ? 'VALUE A' : 'FROM'}
          </p>
          <input 
            type="number" 
            value={fromVal} 
            onChange={(e) => {
              setFromVal(e.target.value);
              // Clear result when user changes input
              setResult('');
              setIsError(false);
            }} 
            className={inputCls} 
          />
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className={selectCls}>
            {units.map((u) => <option key={u} value={u}>{UNIT_DISPLAY[u] || u}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-center pb-7 min-w-[70px] relative max-sm:pb-4">
          {action === 'arithmetic' && isArithmeticAllowed ? (
            <OpDropdown selected={op} onSelect={setOp} />
          ) : (
            <svg viewBox="0 0 40 20" width="40" fill="none">
              <line x1="4" y1="10" x2="28" y2="10" stroke="#3b5bdb" strokeWidth="2.5" strokeLinecap="round"/>
              <polyline points="22,4 32,10 22,16" stroke="#3b5bdb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-[140px] flex flex-col gap-2">
          <p className="text-[11px] font-extrabold tracking-[2px] text-[#6b7280]">
            {action === 'arithmetic' ? 'VALUE B' : 'TO'}
          </p>
          <input 
            type="number" 
            value={toVal} 
            readOnly={isSecondInputDisabled} 
            onChange={(e) => {
              if (!isSecondInputDisabled) {
                setToVal(e.target.value);
                // Clear result when user changes input
                setResult('');
                setIsError(false);
              }
            }} 
            className={`${inputCls} ${isSecondInputDisabled ? 'opacity-60 cursor-default' : ''}`} 
            disabled={!isArithmeticAllowed && action === 'arithmetic'}
            placeholder={isSecondInputRequired ? "Enter value" : "Auto-calculated"}
          />
          <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className={selectCls}>
            {units.map((u) => <option key={u} value={u}>{UNIT_DISPLAY[u] || u}</option>)}
          </select>
        </div>
      </div>

      {/* Execute Button */}
      {showExecuteButton && (
        <div className="mt-6">
          <button
            onClick={handleExecute}
            disabled={isButtonDisabled}
            className={`w-full py-3 rounded-lg font-nunito text-[15px] font-extrabold tracking-wide transition-all duration-200
              ${isButtonDisabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-[#3b5bdb] text-white hover:bg-[#1a3db5] hover:shadow-[0_4px_16px_rgba(59,91,219,0.35)] hover:-translate-y-0.5 active:scale-[0.98]'
              }`}
          >
            {loading ? 'Calculating...' : 'Execute'}
          </button>
        </div>
      )}

      {/* Result Display */}
      <div key={resultKey} className={`mt-6 flex items-center gap-3.5 rounded-[10px] px-5 py-3.5 min-h-[52px] animate-popIn
        ${result ? (isError ? 'bg-red-50 border-l-4 border-red-500' : 'bg-[#eef2ff] border-l-4 border-[#3b5bdb]') : 'bg-gray-50'}`}>
        <span className={`text-[17px] font-extrabold tracking-wide max-sm:text-sm ${isError ? 'text-[#e53935]' : 'text-[#3b5bdb]'}`}>
          {result || 'Fill in the values and click Execute to see the result'}
        </span>
      </div>
    </div>
  );
}