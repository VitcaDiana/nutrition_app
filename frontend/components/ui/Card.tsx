import * as React from "react"

// 1. Componenta principală
export function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white shadow-md rounded-xl border ${className}`}>
      {children}
    </div>
  )
}

// 2. CardHeader - Adăugat className și aici
export function CardHeader({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-6 pb-3 flex flex-col space-y-1.5 ${className}`}>{children}</div>
}

// 3. CardTitle
export function CardTitle({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

// 4. CardContent
export function CardContent({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}