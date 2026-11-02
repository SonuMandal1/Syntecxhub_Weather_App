import { useAppStore } from '../store/useAppStore';

interface SwitchProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

function PillSwitch<T extends string>({ label, value, options, onChange }: SwitchProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full border border-line bg-card p-0.5 shadow-inset">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
              on ? 'bg-emerald text-[#04281D]' : 'text-body hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function UnitToggle() {
  const { tempUnit, speedUnit, setTempUnit, setSpeedUnit } = useAppStore();
  return (
    <div className="flex items-center gap-2">
      <PillSwitch
        label="Temperature unit"
        value={tempUnit}
        options={[{ value: 'C', label: '°C' }, { value: 'F', label: '°F' }]}
        onChange={setTempUnit}
      />
      <div className="hidden sm:block">
        <PillSwitch
          label="Wind speed unit"
          value={speedUnit}
          options={[{ value: 'kmh', label: 'km/h' }, { value: 'mph', label: 'mph' }]}
          onChange={setSpeedUnit}
        />
      </div>
    </div>
  );
}
