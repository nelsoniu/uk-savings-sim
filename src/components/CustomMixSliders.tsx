'use client';

import { CustomMix } from '@/types';

interface CustomMixSlidersProps {
  mix: CustomMix;
  onChange: (mix: CustomMix) => void;
}

export function CustomMixSliders({ mix, onChange }: CustomMixSlidersProps) {
  const handleChange = (key: keyof CustomMix, value: number) => {
    const newMix = { ...mix, [key]: value };

    // Calculate total and adjust if needed
    const total =
      newMix.regularSaverPercent +
      newMix.easyAccessPercent +
      newMix.indexPercent;

    if (total > 100) {
      // Reduce other values proportionally
      const excess = total - 100;
      const otherKeys = (
        Object.keys(newMix) as Array<keyof CustomMix>
      ).filter((k) => k !== key);
      const otherTotal = otherKeys.reduce((sum, k) => sum + newMix[k], 0);

      if (otherTotal > 0) {
        for (const k of otherKeys) {
          newMix[k] = Math.max(0, newMix[k] - (newMix[k] / otherTotal) * excess);
        }
      }
    }

    onChange(newMix);
  };

  const total =
    mix.regularSaverPercent + mix.easyAccessPercent + mix.indexPercent;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Regular Savers</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round(mix.regularSaverPercent)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={mix.regularSaverPercent}
          onChange={(e) =>
            handleChange('regularSaverPercent', Number(e.target.value))
          }
          className="w-full cursor-pointer accent-purple-600"
        />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Easy Access</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round(mix.easyAccessPercent)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={mix.easyAccessPercent}
          onChange={(e) =>
            handleChange('easyAccessPercent', Number(e.target.value))
          }
          className="w-full cursor-pointer accent-green-600"
        />
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Index Fund</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round(mix.indexPercent)}%
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={mix.indexPercent}
          onChange={(e) => handleChange('indexPercent', Number(e.target.value))}
          className="w-full cursor-pointer accent-blue-600"
        />
      </div>

      {Math.round(total) !== 100 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Total: {Math.round(total)}% (should equal 100%)
        </p>
      )}
    </div>
  );
}
