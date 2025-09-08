import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  to?: string;
  type: 'primary' | 'secondary' | 'small' | 'round';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ children, disabled, to, type, onClick }: ButtonProps) => {
  const base =
    'inline-block rounded-full bg-yellow-400 font-semibold uppercase tracking-wide text-sm text-stone-800 transition-colors duration-300 hover:bg-yellow-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed';

  const styles = {
    primary: base + ' px-4 py-3 md:px-6 md:py-4',
    secondary:
      'inline-block rounded-full font-semibold uppercase tracking-wide text-sm text-stone-400 transition-colors duration-300 hover:bg-stone-300 hover:text-stone-800 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-stone-200 focus:ring-offset-2 focus:text-stone-800 disabled:cursor-not-allowed border-2 border-stone-300 px-4 py-2.5 md:px-6 md:py-3.5',
    small: base + ' px-4 py-2 md:px-5 md:py-3 text-xs',
    round: base + ' px-2.5 py-1 md:px-3.5 md:py-2 text-sm',
  };

  if (to)
    return (
      <Link to={to} className={styles[type]}>
        {children}
      </Link>
    );

  if (onClick)
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );

  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
};

export default Button;
