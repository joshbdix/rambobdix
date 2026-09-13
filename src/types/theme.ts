export type ThemePreset = 'josh_dark' | 'josh_light' | 'josh_neon';
export type ButtonStyle = 'solid' | 'outline' | 'gradient';
export type BorderRadiusStyle = 'sharp' | 'medium' | 'rounded';
export type AnimationIntensity = 'low' | 'medium' | 'high';
export type FontFamilyOption = 'Inter + Hind Siliguri' | 'Inter' | 'Hind Siliguri';

export interface ThemeSettings {
  id?: string;
  preset: ThemePreset;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  button_color?: string;
  button_style: ButtonStyle;
  border_radius: BorderRadiusStyle;
  animation_intensity: AnimationIntensity;
  network_animation: boolean;
  background_grid: boolean;
  glow_effects: boolean;
  page_animations: boolean;
  announcement_enabled: boolean;
  floating_contact_enabled: boolean;
  font_family: FontFamilyOption;
  logo_url: string;
  favicon_url: string;
  updated_at?: string;
  updated_by?: string;
}

export const DEFAULT_THEME_JOSH_DARK: ThemeSettings = {
  id: 'active_theme',
  preset: 'josh_dark',
  primary_color: '#0a1931',
  secondary_color: '#060b18',
  accent_color: '#2563eb',
  background_color: '#050811',
  text_color: '#f8fafc',
  button_color: '#2563eb',
  button_style: 'solid',
  border_radius: 'medium',
  animation_intensity: 'medium',
  network_animation: true,
  background_grid: true,
  glow_effects: true,
  page_animations: true,
  announcement_enabled: true,
  floating_contact_enabled: true,
  font_family: 'Inter + Hind Siliguri',
  logo_url: '',
  favicon_url: '',
};

export const THEME_PRESET_JOSH_LIGHT: ThemeSettings = {
  id: 'active_theme',
  preset: 'josh_light',
  primary_color: '#0b1528',
  secondary_color: '#f1f5f9',
  accent_color: '#2563eb',
  background_color: '#f8fafc',
  text_color: '#0f172a',
  button_color: '#2563eb',
  button_style: 'solid',
  border_radius: 'medium',
  animation_intensity: 'medium',
  network_animation: true,
  background_grid: true,
  glow_effects: false,
  page_animations: true,
  announcement_enabled: true,
  floating_contact_enabled: true,
  font_family: 'Inter + Hind Siliguri',
  logo_url: '',
  favicon_url: '',
};

export const THEME_PRESET_JOSH_NEON: ThemeSettings = {
  id: 'active_theme',
  preset: 'josh_neon',
  primary_color: '#1d4ed8',
  secondary_color: '#040814',
  accent_color: '#00f0ff',
  background_color: '#030712',
  text_color: '#ffffff',
  button_color: '#00f0ff',
  button_style: 'gradient',
  border_radius: 'medium',
  animation_intensity: 'medium',
  network_animation: true,
  background_grid: true,
  glow_effects: true,
  page_animations: true,
  announcement_enabled: true,
  floating_contact_enabled: true,
  font_family: 'Inter + Hind Siliguri',
  logo_url: '',
  favicon_url: '',
};

export const THEME_PRESETS_MAP: Record<ThemePreset, ThemeSettings> = {
  josh_dark: DEFAULT_THEME_JOSH_DARK,
  josh_light: THEME_PRESET_JOSH_LIGHT,
  josh_neon: THEME_PRESET_JOSH_NEON,
};
