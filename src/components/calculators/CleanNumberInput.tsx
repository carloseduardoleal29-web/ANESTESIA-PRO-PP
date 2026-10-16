import React, { useState, useEffect } from 'react';

interface CleanNumberInputProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  id?: string;
}

export const CleanNumberInput: React.FC<CleanNumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  className = '',
  prefix,
  suffix,
  disabled = false,
  id,
}) => {
  const [localStr, setLocalStr] = useState<string>(
    value !== undefined && value !== null && !isNaN(value) ? String(value) : ''
  );

  useEffect(() => {
    if (value !== undefined && value !== null && !isNaN(value)) {
      if (Number(localStr) !== value) {
        setLocalStr(String(value));
      }
    } else {
      setLocalStr('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalStr(raw);
    if (raw === '' || raw === '-') {
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    if (localStr === '' || isNaN(Number(localStr))) {
      const fallback = min !== undefined ? min : 0;
      setLocalStr(String(fallback));
      onChange(fallback);
    } else {
      let num = parseFloat(localStr);
      if (min !== undefined && num < min) num = min;
      if (max !== undefined && num > max) num = max;
      // Round to prevent floating point anomalies
      const factor = Math.pow(10, 4);
      num = Math.round(num * factor) / factor;
      setLocalStr(String(num));
      onChange(num);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="relative flex items-center w-full">
      {prefix && (
        <span className="absolute left-2.5 text-slate-400 text-xs font-bold pointer-events-none z-10">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        max={max}
        value={localStr}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-slate-900 border border-slate-700/90 rounded-lg py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors ${
          prefix ? 'pl-7' : 'pl-2.5'
        } ${suffix ? 'pr-14' : 'pr-2.5'} ${className}`}
      />
      {suffix && (
        <span className="absolute right-2.5 text-slate-400 text-[10px] font-mono font-bold pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
};
