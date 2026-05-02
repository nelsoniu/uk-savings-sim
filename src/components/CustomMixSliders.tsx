'use client';

import { CustomMix } from '@/types';

interface CustomMixSlidersProps {
  mix: CustomMix;
  onChange: (mix: CustomMix) => void;
}

const SLIDERS: { key: keyof CustomMix; label: string; color: string }[] = [
  { key: 'regularSaverPercent', label: 'Regular Savers', color: 'accent-purple-600' },
  { key: 'easyAccessPercent', label: 'Easy Access', color: 'accent-green-600' },
  { key: 'indexPercent', label: 'Index Funds', color: 'accent-blue-600' },
];

export function CustomMixSliders({ mix, onChange }: CustomMixSlidersProps) {
  const handleChange = (key: keyof CustomMix, value: number) => {
    const newMix = { ...mix, [key]: value };
    const total = newMix.regularSaverPercent + newMix.easyAccessPercent + newMix.indexPercent;

    if (total > 100) {
      const excess = total - 100;
      const otherKeys = (Object.keys(newMix) as Array<keyof CustomMix>).filter((k) => k !== key);
      const otherTotal = otherKeys.reduce((sum, k) => sum + newMix[k], 0);
      if (otherTotal > 0) {
        for (const k of otherKeys) {
          newMix[k] = Math.max(0, newMix[k] - (newMix[k] / otherTotal) * excess);
        }
      }
    }

    onChange(newMix);
  };

  const total = mix.regularSaverPercent + mix.easyAccessPercent + mix.indexPercent;

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        Custom Allocation
      </h4>
      {SLIDERS.map(({ key, label, color }) => (
        <div key={key}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span className="font-semibold text-gray-900 dark:text-white tabular-nums">
              {Math.round(mix[key])}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={mix[key]}
            onChange={(e) => handleChange(key, Number(e.target.value))}
            className={`w-full cursor-pointer ${color}`}
          />
        </div>
      ))}
      {Math.round(total) !== 100 && (
        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
          Total: {Math.round(total)}% (should equal 100%)
        </p>
      )}
    </div>
  );
}
