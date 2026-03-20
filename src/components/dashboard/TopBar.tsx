"use client";

import React, { useState } from "react";
import { Bell, Search, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { mockNotifications } from "@/lib/mock-data";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function TopBar({ title, subtitle, onMenuClick }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-30"
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]"
        >
          <Menu className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <input
                type="text"
                placeholder="Search..."
                className="input-field text-sm"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <Search className="w-4.5 h-4.5" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </motion.div>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)] relative"
            style={{ color: "var(--text-secondary)" }}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[var(--bg-primary)]" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 rounded-2xl border overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border-color)",
                  boxShadow: "var(--shadow-xl)",
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      Notifications
                    </h3>
                    <span className="badge badge-primary">{unreadCount} new</span>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="px-4 py-3 border-b transition-colors hover:bg-[var(--bg-secondary)]"
                      style={{
                        borderColor: "var(--border-color)",
                        background: notif.read ? "transparent" : "rgba(59,130,246,0.03)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                            notif.type === "warning"
                              ? "bg-amber-500"
                              : notif.type === "success"
                              ? "bg-green-500"
                              : notif.type === "danger"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                            {notif.title}
                          </p>
                          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>
                            {notif.message}
                          </p>
                          <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ml-1 cursor-pointer"
          style={{ background: "var(--gradient-primary)" }}
        >
          PV
        </div>
      </div>
    </header>
  );
}
