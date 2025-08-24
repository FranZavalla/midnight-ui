import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  className?: string;
  label?: string;
  value: string;
}

export function Input({ name, id, type, value, onChange, placeholder, className: customClassName }: InputProps) {
  return (
    <input
      name={name}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`block appearance-none rounded-lg rounded-b-xl border-2 border-b-8 border-black bg-white text-lg text-black placeholder-gray-400 shadow shadow-black outline-none ${customClassName}`}
    />
  );
}
