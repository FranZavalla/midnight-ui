import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'submit' | 'button';
  className?: string;
}

export function Button({
  type = 'button',
  children,
  className: customClassName,
  onClick: onClickFn,
  disabled,
}: ButtonProps) {
  return (
    <button
      onClick={onClickFn}
      type={type}
      disabled={disabled}
      className={`h-10 inline-flex w-full select-none items-center justify-center border border-white cursor-pointer
        rounded-lg rounded-b-xl px-5 py-2 text-center text-lg font-semibold tracking-wide sm:w-auto ${customClassName} 
        disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:text-black`}
    >
      {children}
    </button>
  );
}
