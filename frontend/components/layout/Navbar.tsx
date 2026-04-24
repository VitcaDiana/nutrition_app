"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500 font-medium">Platformă Nutriție</span>
        <div className="font-bold text-gray-800">
          Bun venit, <span className="text-green-600">{user?.name || "Utilizator"}</span>
          {user?.role && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full uppercase">
              {user.role}
            </span>
          )}
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}