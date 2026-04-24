import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({ 
  children, 
  className = "", 
  variant = "primary", 
  size = "md", 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50";
  
const variants = {
  primary: "bg-green-600 text-white hover:bg-green-700",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  // Adăugăm !text-green-600 pentru a forța culoarea chiar și pe fundal alb
  outline: "border-2 border-green-600 !text-green-600 bg-white hover:bg-green-50",
}

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-8 py-3 text-lg",
  };

  // ACEASTA ESTE SOLUȚIA FINALĂ: 
  // Dacă varianta este outline, forțăm culoarea textului prin atributul style
  const inlineStyle = variant === "outline" ? { color: "#16a34a" } : {};

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={inlineStyle}
      {...props}
    >
      {children}
    </button>
  );
}