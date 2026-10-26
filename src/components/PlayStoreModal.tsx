/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Terminal, FileText, CheckCircle2 } from 'lucide-react';
import { soundHaptics } from '../utils/audioHaptics';

export const PlayStoreModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'store' | 'build' | 'privacy'>('store');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    soundHaptics.playKeyClick('action');
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-4 overflow-y-auto space-y-4">
      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setActiveTab('store');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'store'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Google Play Store Listing</span>
        </button>

        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setActiveTab('build');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'build'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>AAB Build & Release Guide</span>
        </button>

        <button
          onClick={() => {
            soundHaptics.playKeyClick('op');
            setActiveTab('privacy');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'privacy'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy Policy</span>
        </button>
      </div>

      {/* Store Listing */}
      {activeTab === 'store' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Application Metadata
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">App Name:</span>
                <span className="font-bold text-white text-sm">Scientific Calculator Pro 2026</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Package Name:</span>
                <span className="font-mono text-cyan-300">com.scientific.calculatorpro2026</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Version:</span>
                <span className="font-mono text-white">1.0.0 (Version Code: 100)</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Target Android API:</span>
                <span className="font-mono text-emerald-400">Android 16 (API 36 / 35 Target)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Short Description (80 chars max)</span>
              <button
                onClick={() =>
                  copyText('short', 'Pro scientific & graphing calculator with step-by-step solver, calculus & units.')
                }
                className="text-xs text-cyan-400 flex items-center gap-1 hover:underline"
              >
                {copiedKey === 'short' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl text-sm font-sans text-white border border-slate-800">
              Pro scientific &amp; graphing calculator with step-by-step solver, calculus &amp; units.
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Full Store Description</span>
              <button
                onClick={() =>
                  copyText(
                    'full',
                    `Scientific Calculator Pro 2026 is an ultra-accurate, professional-grade mathematical suite designed for engineers, scientists, students, and mathematicians.\n\nKey Features:\n• Advanced Scientific Engine with full trigonometric, complex number, and logarithmic capabilities\n• Interactive Graphing Calculator: plot Cartesian y=f(x) & polar curves, trace coordinates, roots & extrema detection\n• Step-by-Step Equation Solver: Quadratic, Linear, 2x2 Systems (Cramer's Rule), and Cubic equations with full derivation and verification\n• Calculus Suite: Numerical differentiation (1st & 2nd order), adaptive Simpson's integration, and limits\n• Programmer Mode: HEX, DEC, OCT, BIN bases with 64-bit interactive bit matrix and bitwise operators\n• Comprehensive Unit Converter: 15+ categories with SI & Imperial conversions\n• CODATA Scientific Constants Database & searchable mathematical formula library\n• 100% Offline, Privacy-First, No Ads, Zero tracking`
                  )
                }
                className="text-xs text-cyan-400 flex items-center gap-1 hover:underline"
              >
                {copiedKey === 'full' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl text-xs font-sans text-slate-300 border border-slate-800 leading-relaxed whitespace-pre-wrap">
              Scientific Calculator Pro 2026 is an ultra-accurate, professional-grade mathematical suite designed for engineers, scientists, students, and mathematicians.
              {'\n\n'}• Advanced Scientific Engine with full trigonometric, complex number, and logarithmic capabilities
              {'\n'}• Interactive Graphing Calculator: plot Cartesian y=f(x) & polar curves, trace coordinates, roots & extrema detection
              {'\n'}• Step-by-Step Equation Solver: Quadratic, Linear, 2x2 Systems (Cramer&apos;s Rule), and Cubic equations with full derivation and verification
              {'\n'}• Calculus Suite: Numerical differentiation (1st & 2nd order), adaptive Simpson&apos;s integration, and limits
              {'\n'}• Programmer Mode: HEX, DEC, OCT, BIN bases with 64-bit interactive bit matrix and bitwise operators
              {'\n'}• Comprehensive Unit Converter: 15+ categories with SI & Imperial conversions
              {'\n'}• CODATA Scientific Constants Database & searchable mathematical formula library
              {'\n'}• 100% Offline, Privacy-First, No Ads, Zero tracking
            </div>
          </div>
        </div>
      )}

      {/* Build & Release Guide */}
      {activeTab === 'build' && (
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
            Android Studio &amp; Gradle Build Steps
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-white text-sm">1. Generate Release Keystore</span>
              <pre className="p-2 bg-slate-900 rounded-lg font-mono text-cyan-300 overflow-x-auto">
                keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias calcpro
              </pre>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-white text-sm">2. Build Android App Bundle (AAB)</span>
              <p className="text-slate-400">Run in your Android Studio / Gradle terminal:</p>
              <pre className="p-2 bg-slate-900 rounded-lg font-mono text-cyan-300 overflow-x-auto">
                ./gradlew bundleRelease
              </pre>
              <p className="text-slate-500">Output artifact: app/build/outputs/bundle/release/app-release.aab</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
              <span className="font-bold text-white text-sm">3. Build Debug APK for Local Testing</span>
              <pre className="p-2 bg-slate-900 rounded-lg font-mono text-cyan-300 overflow-x-auto">
                ./gradlew assembleDebug
              </pre>
              <p className="text-slate-500">Install directly via adb: adb install app/build/outputs/apk/debug/app-debug.apk</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white text-sm">4. Google Play Console Pre-Launch Checklist</span>
              <ul className="space-y-1 text-slate-300 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target API Level 35/36 requirement met</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>App content rating: Everyone (PEGI 3, ESRB Everyone)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Data Safety Section: Disclosed 0 data collected, 0 shared</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Graphic assets: 512×512 icon, 1024×500 feature graphic, screenshots</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy */}
      {activeTab === 'privacy' && (
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Privacy Policy (Privacy by Design)</span>
          </h4>
          <p>
            Effective Date: October 2026. Scientific Calculator Pro 2026 values user privacy above all else. This application is engineered with a strict <strong>Privacy-First, Offline-First Architecture</strong>.
          </p>
          <div className="space-y-2">
            <h5 className="font-bold text-white text-sm">1. Zero Data Collection</h5>
            <p>
              The application does not collect, log, track, transmit, or sell any personal data, identifiers, device information, or calculation history. All calculations and equations remain strictly on your local device.
            </p>
            <h5 className="font-bold text-white text-sm">2. Local Storage Only</h5>
            <p>
              Your calculation history and personalized settings (theme, angle mode, precision) are saved exclusively to your local device storage. You can delete individual calculations or clear your history permanently at any time.
            </p>
            <h5 className="font-bold text-white text-sm">3. No Advertisements or Trackers</h5>
            <p>
              There are no third-party advertisements, behavioral trackers, or analytics SDKs bundled into this application.
            </p>
            <h5 className="font-bold text-white text-sm">4. Permissions Required</h5>
            <p>
              Only standard system vibration permission (`android.permission.VIBRATE`) is utilized to provide realistic haptic feedback upon key press, which can be disabled in the Settings menu.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
