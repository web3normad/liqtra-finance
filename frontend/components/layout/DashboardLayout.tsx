"use client";

import { useState } from "react";
import { CollapsibleSidebar } from "./CollapsibleSidebar";
import { ChatbotSidebar } from "./ChatbotSidebar";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(true); // Start OPEN by default

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background">
      {/* Desktop Sidebar - Collapsible */}
      <div className="hidden lg:block">
        <CollapsibleSidebar />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col bg-gray-50 dark:bg-background transition-all duration-300 ${
          isChatbotOpen ? "lg:mr-96" : "mr-0"
        }`}
      >
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>

      {/* AI Chatbot Sidebar - Right Side */}
      <ChatbotSidebar onOpenChange={setIsChatbotOpen} isOpen={isChatbotOpen} />

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
