import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-3 rounded-xl bg-white border text-surface-900 placeholder-surface-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'transition-all duration-200',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                : 'border-surface-200',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-surface-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 rounded-xl bg-white border text-surface-900 placeholder-surface-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'transition-all duration-200 resize-none',
            error
              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
              : 'border-surface-200',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-surface-500">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-surface-700 mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 rounded-xl bg-white border text-surface-900',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
            'transition-all duration-200 cursor-pointer',
            error
              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
              : 'border-surface-200',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-surface-500">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
