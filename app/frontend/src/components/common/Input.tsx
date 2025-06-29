import { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="w-full">
      {/* FIX: Added dark mode text color for the label */}
      {label && <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</label>}
      <input
        className="w-full px-4 py-2 rounded-lg 
                   bg-white/50 dark:bg-black/20 
                   border-2 border-transparent 
                   focus:border-blue-500 focus:outline-none
                   text-gray-800 dark:text-gray-100
                   placeholder:text-gray-500 dark:placeholder:text-gray-400
                   transition-all duration-300"
        {...props}
      />
    </div>
  );
};

export default Input;