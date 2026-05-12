import { useEffect, useState } from 'react';
import type {
  ClaudeModel,
  DecodeSettings,
  ExplainMode,
  GroqModel,
  Provider,
} from '../shared/types';
import { DEFAULT_SETTINGS } from '../shared/types';

const SETTINGS_KEY = 'decode.settings';

const ANTHROPIC_MODELS: { id: ClaudeModel; label: string; hint: string }[] = [
  { id: 'claude-haiku-4-5', label: 'Haiku 4.5', hint: 'Fastest · cheapest · default' },
  { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6', hint: 'Better for complex snippets' },
  { id: 'claude-opus-4-7', label: 'Opus 4.7', hint: 'Highest quality · slower' },
];

const GROQ_MODELS: { id: GroqModel; label: string; hint: string }[] = [
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', hint: 'Best quality · free tier' },
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B', hint: 'Fastest · free tier' },
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

  const activeKey =
    settings.provider === 'groq' ? settings.groqApiKey : settings.anthropicApiKey;
  const canSave = activeKey.length > 0;

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
          Pick a provider and paste an API key. Settings stay on this device.
        </p>
      </header>

      <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <Field label="Provider" hint="Pick which model powers your explanations.">
          <div className="grid grid-cols-2 gap-2">
            <ProviderCard
              id="anthropic"
              label="Anthropic"
              sublabel="Claude · paid"
              active={settings.provider === 'anthropic'}
              onClick={() => update('provider', 'anthropic')}
            />
            <ProviderCard
              id="groq"
              label="Groq"
              sublabel="Llama · free tier"
              active={settings.provider === 'groq'}
              onClick={() => update('provider', 'groq')}
            />
          </div>
        </Field>

        {settings.provider === 'anthropic' ? (
          <AnthropicSection
            apiKey={settings.anthropicApiKey}
            model={settings.anthropicModel}
            onApiKey={(v) => update('anthropicApiKey', v)}
            onModel={(m) => update('anthropicModel', m)}
          />
        ) : (
          <GroqSection
            apiKey={settings.groqApiKey}
            model={settings.groqModel}
            onApiKey={(v) => update('groqApiKey', v)}
            onModel={(m) => update('groqModel', m)}
          />
        )}

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
            disabled={!canSave}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Save
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Keys stay on this device in <code>chrome.storage.local</code>. We never see them.
      </p>
    </div>
  );
}

interface ProviderCardProps {
  id: Provider;
  label: string;
  sublabel: string;
  active: boolean;
  onClick: () => void;
}

function ProviderCard({ label, sublabel, active, onClick }: ProviderCardProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md border p-3 text-left transition ${
        active
          ? 'border-brand-600 bg-brand-50'
          : 'border-slate-200 bg-white hover:bg-slate-50'
      }`}
    >
      <div className="text-sm font-medium text-slate-900">{label}</div>
      <div className="text-xs text-slate-500">{sublabel}</div>
    </button>
  );
}

interface AnthropicSectionProps {
  apiKey: string;
  model: ClaudeModel;
  onApiKey: (v: string) => void;
  onModel: (m: ClaudeModel) => void;
}

function AnthropicSection({ apiKey, model, onApiKey, onModel }: AnthropicSectionProps) {
  return (
    <>
      <Field
        label="Anthropic API key"
        hint={
          <>
            Get one at{' '}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 underline"
            >
              console.anthropic.com
            </a>
            . Requires credits — $5 covers thousands of explanations.
          </>
        }
      >
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKey(e.target.value)}
          placeholder="sk-ant-..."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          aria-label="Anthropic API key"
        />
      </Field>

      <Field label="Claude model" hint="Haiku is recommended for everyday use.">
        <ModelList models={ANTHROPIC_MODELS} active={model} onChange={onModel} name="anthropic-model" />
      </Field>
    </>
  );
}

interface GroqSectionProps {
  apiKey: string;
  model: GroqModel;
  onApiKey: (v: string) => void;
  onModel: (m: GroqModel) => void;
}

function GroqSection({ apiKey, model, onApiKey, onModel }: GroqSectionProps) {
  return (
    <>
      <Field
        label="Groq API key"
        hint={
          <>
            Free key at{' '}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 underline"
            >
              console.groq.com
            </a>
            . No credit card required. Free tier is generous for personal use.
          </>
        }
      >
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onApiKey(e.target.value)}
          placeholder="gsk_..."
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          aria-label="Groq API key"
        />
      </Field>

      <Field label="Llama model" hint="70B is sharper for explanations. 8B is faster.">
        <ModelList models={GROQ_MODELS} active={model} onChange={onModel} name="groq-model" />
      </Field>
    </>
  );
}

interface ModelListProps<T extends string> {
  models: { id: T; label: string; hint: string }[];
  active: T;
  onChange: (id: T) => void;
  name: string;
}

function ModelList<T extends string>({ models, active, onChange, name }: ModelListProps<T>) {
  return (
    <div className="space-y-2">
      {models.map((m) => (
        <label
          key={m.id}
          className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 p-3 hover:bg-slate-50"
        >
          <input
            type="radio"
            name={name}
            value={m.id}
            checked={active === m.id}
            onChange={() => onChange(m.id)}
            className="mt-0.5"
          />
          <div>
            <div className="text-sm font-medium text-slate-900">{m.label}</div>
            <div className="text-xs text-slate-500">{m.hint}</div>
          </div>
        </label>
      ))}
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
