import { useId } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string | number;
    onChange: (value: string | number) => void;
    options?: SelectOption[];
    className?: string;
    required?: boolean;
    placeholder?: string;
    id?: string;
    title?: string;
}

export default function Select({
    label,
    value,
    onChange,
    options = [],
    className = '',
    required = false,
    placeholder = 'Select an option',
    id,
    title,
}: SelectProps) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const accessibleTitle = title ?? label ?? placeholder;

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label htmlFor={selectId} className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {label}
                    {required && <span className='text-red-500 ml-1'>*</span>}
                </label>
            )}
            <div className='relative'>
                <select
                    id={selectId}
                    title={accessibleTitle}
                    aria-label={label ? undefined : accessibleTitle}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className='w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 cursor-pointer'
                >
                    <option value='' disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDownIcon className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none' />
            </div>
        </div>
    );
}
