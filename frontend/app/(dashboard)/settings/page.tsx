"use client";

import { useState } from "react";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Lightning,
  Moon,
  Sun,
  CheckCircle,
  Warning,
} from "@phosphor-icons/react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    rewards: true,
    transactions: true,
    prices: false,
    newsletter: true,
  });
  const [theme, setTheme] = useState("dark");
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Manage your account preferences and security
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-green to-primary-green-light rounded-full flex items-center justify-center">
            <User size={24} weight="fill" className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Profile</h3>
            <p className="text-sm text-gray-400">Manage your account details</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              defaultValue="Ryan Crawford"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="ryan@example.com"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div>
              <p className="text-white font-medium">Account Level</p>
              <p className="text-gray-400 text-sm">Level 7 · PRO</p>
            </div>
            <Badge variant="purple">PRO</Badge>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary-green/20 rounded-md flex items-center justify-center">
            <Palette size={24} className="text-primary-green" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Appearance</h3>
            <p className="text-sm text-gray-400">Customize your interface</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "dark", label: "Dark", icon: Moon },
                { value: "light", label: "Light", icon: Sun },
                { value: "auto", label: "Auto", icon: Lightning },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`p-4 rounded-md border-2 transition-all ${
                    theme === option.value
                      ? "border-primary-green bg-primary-green/10"
                      : "border-gray-800 bg-gray-800/30 hover:border-gray-700"
                  }`}
                >
                  <option.icon
                    size={24}
                    className={
                      theme === option.value
                        ? "text-primary-green mx-auto mb-2"
                        : "text-gray-400 mx-auto mb-2"
                    }
                  />
                  <p
                    className={`text-sm font-medium ${
                      theme === option.value ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {option.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-green/50 transition-all"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-primary-green-light/20 rounded-md flex items-center justify-center">
            <Bell size={24} className="text-primary-green-light" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Notifications</h3>
            <p className="text-sm text-gray-400">
              Choose what updates you receive
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "rewards",
              label: "Reward Notifications",
              description: "Get notified when you earn rewards",
            },
            {
              key: "transactions",
              label: "Transaction Updates",
              description: "Updates on deposits and withdrawals",
            },
            {
              key: "prices",
              label: "Price Alerts",
              description: "Alerts when prices change significantly",
            },
            {
              key: "newsletter",
              label: "Newsletter",
              description: "Weekly updates and insights",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-800/30 rounded-md"
            >
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  notifications[item.key as keyof typeof notifications]
                    ? "bg-primary-green"
                    : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-success/20 rounded-md flex items-center justify-center">
            <Shield size={24} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Security</h3>
            <p className="text-sm text-gray-400">
              Protect your account and assets
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-md">
            <div className="flex items-center space-x-3">
              <CheckCircle size={20} weight="fill" className="text-success" />
              <div>
                <p className="text-white font-medium">
                  Two-Factor Authentication
                </p>
                <p className="text-gray-400 text-sm">Enabled</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Manage
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-md">
            <div className="flex items-center space-x-3">
              <Key size={20} className="text-gray-400" />
              <div>
                <p className="text-white font-medium">Password</p>
                <p className="text-gray-400 text-sm">
                  Last changed 30 days ago
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-md">
            <div className="flex items-center space-x-3">
              <Warning size={20} className="text-warning" />
              <div>
                <p className="text-white font-medium">Session Management</p>
                <p className="text-gray-400 text-sm">2 active sessions</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              View
            </Button>
          </div>
        </div>
      </Card>

      {/* Connected Wallets */}
      <Card>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-warning/20 rounded-md flex items-center justify-center">
            <Globe size={24} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Connected Wallets</h3>
            <p className="text-sm text-gray-400">Manage blockchain wallets</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-md">
            <div>
              <p className="text-white font-medium">0xA1B2...9F8E</p>
              <p className="text-gray-400 text-sm">MetaMask · Ethereum</p>
            </div>
            <Badge variant="success">Connected</Badge>
          </div>

          <button className="w-full p-4 border-2 border-dashed border-gray-700 rounded-md text-gray-400 hover:border-primary-green hover:text-primary-green transition-colors">
            + Connect Another Wallet
          </button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-3">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">
          <CheckCircle size={18} weight="fill" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  );
}
