"use client"

import { useState } from "react"

const FloatingLabelInput = ({
  type = "text",
  name,
  label,
  value,
  onChange,
  icon: Icon,
  error,
  required = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false)

  const isActive = focused || value

  return (
    <div className="relative">
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-gray-400 z-10" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3 text-sm border rounded-xl transition-all duration-200 bg-white dark:bg-gray-800
            ${Icon ? "pl-12" : "pl-4"}
            ${
              error
                ? "border-danger-500 focus:ring-danger-500 focus:border-danger-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            }
            ${isActive ? "pt-6 pb-2" : ""}
          `}
          required={required}
          {...props}
        />
        <label
          className={`
            absolute transition-all duration-200 pointer-events-none text-gray-500 dark:text-gray-400
            ${Icon ? "left-12" : "left-4"}
            ${isActive ? "top-1 text-xs text-primary-500 dark:text-primary-400" : "top-3 text-sm"}
          `}
        >
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-danger-500 animate-slide-down">{error}</p>}
    </div>
  )
}

export default FloatingLabelInput
