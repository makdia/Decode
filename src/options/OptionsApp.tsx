import { useEffect, useState } from 'react';
import type { ClaudeModel, DecodeSettings, ExplainMode } from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/types';

const SETTINGS_KEY = 'decode.settings';

const MODELS: { id: ClaudeModel; label: string; hint: string }[] = [
  { id: 'claude-haiku-4-5', label: 'Haiku 4.5', hint: 'Fastest · cheapest · default' },
  { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6', hint: 'Better for complex snippets' },
  { id: 'claude-opus-4-7', label: 'Opus 4.7', hint: 'Highest quality · slower' },
];

export default function OptionsApp() {
  const [settings, setSettings] = useState<DecodeSettings>(DEFAULT_SETTINGS);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void chrome.storage.local.get(SETTINGS_KEY).then((result) => {
      setSettings({ ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] ?? {}) });
      setLoaded(true);
    });
  }, []);

  const update = <K extends keyof DecodeSettings>(key: K, value: DecodeSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
    setSavedAt(Date.now());
  };

  if (!loaded) {
    return (
      <div className="mx-auto max-w-xl px-6 py-10 text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Decode settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Configure your Anthropic API key and preferred model.
        </p>
      </header>

      <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Field
          label="Anthropic API key"
          hint={
            <>
              Get a key at{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 underline"
              >
                console.anthropic.com
              </a>
              . Stored locally — never sent anywhere except Anthropic.
            </>
          }
        >
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => update('apiKey', e.target.value)}
            placeholder="sk-ant-..."
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            aria-label="Anthropic API key"
          />
        </Field>

        <Field label="Model" hint="Haiku is recommended for everyday use.">
          <div className="space-y-2">
            {MODELS.map((m) => (
              <label
                key={m.id}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50"
              >
                <input
                  type="radio"
                  name="model"
                  value={m.id}
                  checked={settings.model === m.id}
                  onChange={() => update('model', m.id)}
                  className="mt-0.5"
                />
                <div>
                  <div className="text-sm font-medium text-slate-900">{m.label}</div>
                  <div className="text-xs text-slate-500">{m.hint}</div>
                </div>
              </label>
            ))}
          </div>
        </Field>

        <Field label="Default explanation mode">
          <div className="flex gap-2">
            {(['normal', 'eli5'] as ExplainMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => update('defaultMode', mode)}
                aria-pressed={settings.defaultMode === mode}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                  settings.defaultMode === mode
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {mode === 'eli5' ? 'Explain Like I\'m 5' : 'Normal'}
              </button>
            ))}
          </div>
        </Field>

        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="text-xs text-slate-500" aria-live="polite">
            {savedAt ? 'Saved ✓' : ''}
          </div>
          <button
            onClick={save}
            disabled={!settings.apiKey}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Save
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Your API key stays on this device in <code>chrome.storage.local</code>. We never see it.
      </p>
    </div>
  );
}

interface FieldProps {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}

function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-900">{label}</label>
      {hint && <p className="mb-2 text-xs text-slate-500">{hint}</p>}
      {children}
    </div>
  );
}
