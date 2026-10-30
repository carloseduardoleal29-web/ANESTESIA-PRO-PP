export interface CustomBillingConfig {
  zinliEmail: string;
  binanceEmail: string;
  binancePayId: string;
  pagoMovilBanks: { code: string; name: string }[];
  pagoMovilCedula: string;
  pagoMovilPhone: string;
  defaultExchangeRate: number;
  price3mUSD: number;
  price6mUSD: number;
  price1yUSD: number;
  whatsappPhone: string;
}

const BILLING_STORAGE_KEY = 'anestesiapro_custom_billing_config_v1';

export const DEFAULT_BILLING_CONFIG: CustomBillingConfig = {
  zinliEmail: 'carloseduardoleal29@gmail.com',
  binanceEmail: 'carloseduardoleal29@gmail.com',
  binancePayId: 'carloseduardoleal29',
  pagoMovilBanks: [
    { code: '0102', name: 'Banco de Venezuela' },
    { code: '0134', name: 'Banesco' },
    { code: '0105', name: 'Mercantil' }
  ],
  pagoMovilCedula: 'V-15.489.288',
  pagoMovilPhone: '0424-3291438',
  defaultExchangeRate: 1001.32,
  price3mUSD: 30,
  price6mUSD: 50,
  price1yUSD: 95,
  whatsappPhone: '+584243291438'
};

export function getBillingConfig(): CustomBillingConfig {
  if (typeof window === 'undefined') return DEFAULT_BILLING_CONFIG;
  try {
    const raw = localStorage.getItem(BILLING_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return { ...DEFAULT_BILLING_CONFIG, ...parsed };
      }
    }
  } catch {}
  return DEFAULT_BILLING_CONFIG;
}

export function saveBillingConfig(config: CustomBillingConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('anestesiapro_billing_config_updated', { detail: config }));
  } catch (e) {
    console.warn('[Billing Config] Error saving config:', e);
  }
}
