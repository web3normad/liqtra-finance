// components/layout/CollapsibleSidebar.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

export function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-0" : "w-64"
        } overflow-hidden relative`}
      >
        <Sidebar />
      </div>

      {/* Toggle Button - Always visible, aligned with content area */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`fixed top-20 z-50 w-8 h-8 bg-primary-green text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-green-dark transition-all ${
          isCollapsed ? "left-3" : "left-[250px]"
        }`}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <CaretRight size={16} weight="bold" />
        ) : (
          <CaretLeft size={16} weight="bold" />
        )}
      </button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
