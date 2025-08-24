import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  className?: string;
  label?: string;
  value: string | number;
  error?: string;
}

export function Input({ name, id, type, value, onChange, placeholder, className: customClassName, error }: InputProps) {
  return (
    <div className="flex flex-col">
      <input
        name={name}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block appearance-none rounded-lg p-2 border border-black bg-white text-lg text-black placeholder-gray-400 ${customClassName}`}
      />
      <div className="text-sm text-red-500">{error}</div>
    </div>
  );
}
