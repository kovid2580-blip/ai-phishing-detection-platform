import React from 'react';
import type { RiskLevel } from '../../types';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, size = 180 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#00E676'; // Safe - Emerald
  let glowClass = 'glow-emerald';

  if (level === 'CRITICAL') {
    strokeColor = '#FF1744';
    glowClass = 'glow-red';
  } else if (level === 'HIGH') {
    strokeColor = '#FF9100';
    glowClass = 'glow-red';
  } else if (level === 'MEDIUM') {
    strokeColor = '#FFB300';
    glowClass = 'glow-amber';
  } else if (level === 'LOW') {
    strokeColor = '#00F0FF';
    glowClass = 'glow-cyan';
  }

  return (
    <div className={`relative flex flex-col items-center justify-center rounded-full p-2 transition-all duration-500 ${glowClass}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold tracking-tight text-white">
          {score}<span className="text-xl font-normal text-slate-400">%</span>
        </span>
        <span 
          className="mt-1 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${strokeColor}25`, color: strokeColor, border: `1px solid ${strokeColor}50` }}
        >
          {level} RISK
        </span>
      </div>
    </div>
  );
};
