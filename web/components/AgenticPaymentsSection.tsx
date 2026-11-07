'use client';

import React from 'react';
import { Check, Code2 } from 'lucide-react';

export function AgenticPaymentsSection() {
  const featurePoints = [
    {
      title: 'Autonomous Service Payments',
      description:
        'AI agents can independently initiate payments to access paid APIs and services without requiring users to manually complete every transaction.',
    },
    {
      title: 'Native x402 Integration',
      description:
        'HTTP 402 Payment Required responses enable services to communicate payment requirements directly to AI agents.',
    },
    {
      title: 'On-Chain Settlement',
      description:
        'Payments are executed using blockchain infrastructure, providing transparent transaction verification and settlement.',
    },
    {
      title: 'Policy-Based Authorization',
      description:
        'Spending limits and delegated permissions help ensure agents only execute payments within their authorized boundaries.',
    },
  ];

  return (
    <section
      id="agentic-payments"
      aria-label="Agentic Payments over x402 Protocol"
      className="py-20 sm:py-24 md:py-28 bg-[#F7F8FC] dark:bg-[#071228] border-t border-[#E2E8F0] dark:border-white/10 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Background ambient lighting accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#1749F5]/5 dark:bg-[#1749F5]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 xl:gap-16 items-center">
          
          {/* ========================================================= */}
          {/* Left Column: Eyebrow, Heading, Description & 4 Features    */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Main Heading */}
            <h2 className="font-archivo font-bold text-3xl sm:text-4xl lg:text-[44px] text-[#090B12] dark:text-[#F5F8FF] leading-[1.18] tracking-tight">
              Autonomous payments for AI agents. Powered by x402.
            </h2>

            {/* Description */}
            <p className="font-archivo text-base sm:text-[17px] text-[#303747] dark:text-[#A9B9D5] leading-[1.65]">
              PaidX enables AI agents to access paid APIs, services, and digital resources without manual payment
              intervention. Using the x402 protocol, agents can discover payment requirements, authorize
              transactions, and receive access after on-chain payment verification.
            </p>

            {/* Four Feature Points */}
            <div className="space-y-5 sm:space-y-6 pt-2">
              {featurePoints.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  {/* Circular Green Checkmark Badge */}
                  <div className="w-6 h-6 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200/80 dark:border-emerald-800/40 shadow-xs">
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>

                  {/* Feature Content */}
                  <div>
                    <h3 className="font-archivo font-semibold text-base sm:text-[17px] text-[#090B12] dark:text-[#F5F8FF] leading-snug">
                      {feature.title}
                    </h3>
                    <p className="font-archivo text-sm sm:text-[15px] text-[#667085] dark:text-[#94A3B8] leading-relaxed mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================= */}
          {/* Right Column: Code Editor Visual with x402 Payment Flow   */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="w-full max-w-[540px] rounded-[24px] bg-[#0A0F1D] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden font-mono select-text transition-all">
              
              {/* Editor Window Top Bar */}
              <div className="px-5 py-3.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                {/* 3 Window Controls */}
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>

                {/* Tab Label */}
                <div className="flex items-center gap-2 text-xs text-[#94A3B8] bg-white/[0.04] px-3 py-1 rounded-md border border-white/5">
                  <Code2 className="w-3.5 h-3.5 text-[#5B8EFF]" />
                  <span>x402-client.ts</span>
                </div>

                {/* Status Dot */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#10B981] font-sans font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Live</span>
                </div>
              </div>

              {/* Code Content Area with Line Numbers */}
              <div className="p-5 sm:p-6 text-xs sm:text-[13px] leading-[1.65] overflow-x-auto text-[#E2E8F0]">
                <div className="flex">
                  {/* Line Numbers */}
                  <div className="text-[#4B5563] select-none pr-4 text-right shrink-0 space-y-0.5">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                    <div>7</div>
                    <div>8</div>
                    <div>9</div>
                    <div>10</div>
                    <div>11</div>
                    <div>12</div>
                    <div>13</div>
                    <div>14</div>
                    <div>15</div>
                    <div>16</div>
                    <div>17</div>
                  </div>

                  {/* Code Lines with Syntax Highlighting */}
                  <div className="space-y-0.5 overflow-x-auto">
                    <div>
                      <span className="text-[#6B7280] italic">// Agent requests a paid resource</span>
                    </div>
                    <div>
                      <span className="text-[#C084FC]">const</span>{' '}
                      <span className="text-[#E2E8F0]">response</span>{' '}
                      <span className="text-[#94A3B8]">=</span>{' '}
                      <span className="text-[#C084FC]">await</span>{' '}
                      <span className="text-[#60A5FA]">fetch</span>(
                      <span className="text-[#34D399]">API_URL</span>);
                    </div>
                    <div className="h-4" />
                    <div>
                      <span className="text-[#6B7280] italic">// Server responds with HTTP 402</span>
                    </div>
                    <div>
                      <span className="text-[#F472B6]">if</span> (
                      <span className="text-[#E2E8F0]">response</span>.
                      <span className="text-[#60A5FA]">status</span>{' '}
                      <span className="text-[#94A3B8]">===</span>{' '}
                      <span className="text-[#FBBF24]">402</span>) &#123;
                    </div>
                    <div className="pl-4">
                      <span className="text-[#C084FC]">const</span>{' '}
                      <span className="text-[#E2E8F0]">requirements</span>{' '}
                      <span className="text-[#94A3B8]">=</span>{' '}
                      <span className="text-[#C084FC]">await</span>{' '}
                      <span className="text-[#E2E8F0]">response</span>.
                      <span className="text-[#60A5FA]">json</span>();
                    </div>
                    <div className="h-4" />
                    <div className="pl-4">
                      <span className="text-[#6B7280] italic">// Validate agent spending policy</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[#C084FC]">await</span>{' '}
                      <span className="text-[#E2E8F0]">policy</span>.
                      <span className="text-[#60A5FA]">validate</span>(
                      <span className="text-[#E2E8F0]">requirements</span>);
                    </div>
                    <div className="h-4" />
                    <div className="pl-4">
                      <span className="text-[#6B7280] italic">// Prepare and authorize x402 payment</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[#C084FC]">const</span>{' '}
                      <span className="text-[#E2E8F0]">payment</span>{' '}
                      <span className="text-[#94A3B8]">=</span>{' '}
                      <span className="text-[#C084FC]">await</span>{' '}
                      <span className="text-[#E2E8F0]">agent</span>.
                      <span className="text-[#60A5FA]">authorizePayment</span>(
                      <span className="text-[#E2E8F0]">requirements</span>);
                    </div>
                    <div className="h-4" />
                    <div className="pl-4">
                      <span className="text-[#6B7280] italic">// Retry request with payment authorization</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-[#C084FC]">const</span>{' '}
                      <span className="text-[#E2E8F0]">result</span>{' '}
                      <span className="text-[#94A3B8]">=</span>{' '}
                      <span className="text-[#C084FC]">await</span>{' '}
                      <span className="text-[#60A5FA]">fetch</span>(
                      <span className="text-[#34D399]">API_URL</span>, &#123;
                    </div>
                    <div className="pl-8">
                      <span className="text-[#E2E8F0]">headers</span>: &#123;
                    </div>
                    <div className="pl-12">
                      <span className="text-[#34D399]">&quot;X-PAYMENT&quot;</span>:{' '}
                      <span className="text-[#E2E8F0]">payment</span>.
                      <span className="text-[#60A5FA]">payload</span>
                    </div>
                    <div className="pl-8">&#125;</div>
                    <div className="pl-4">&#125;);</div>
                    <div>&#125;</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
