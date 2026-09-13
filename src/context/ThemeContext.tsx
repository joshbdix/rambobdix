import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  ThemeSettings, 
  ThemePreset, 
  DEFAULT_THEME_JOSH_DARK, 
  THEME_PRESET_JOSH_LIGHT, 
  THEME_PRESET_JOSH_NEON, 
  THEME_PRESETS_MAP 
} from '../types/theme';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: ThemeSettings;
  previewTheme: ThemeSettings | null;
  effectiveTheme: ThemeSettings;
  loadingTheme: boolean;
  updateTheme: (newTheme: Partial<ThemeSettings>) => Promise<boolean>;
  setPreview: (preview: ThemeSettings | null) => void;
  resetToDefault: () => Promise<boolean>;
  applyPreset: (preset: ThemePreset) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'JOSH_RAMBO_THEME_CACHE';

// Helper to determine derived CSS variables for contrast & aesthetics
function applyThemeTokensToDOM(theme: ThemeSettings) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Preset-dependent defaults
  const isLight = theme.preset === 'josh_light';
  const isNeon = theme.preset === 'josh_neon';

  // Primary colors
  root.style.setProperty('--color-primary', theme.primary_color);
  root.style.setProperty('--color-secondary', theme.secondary_color);
  root.style.setProperty('--color-accent', theme.accent_color);
  root.style.setProperty('--color-background', theme.background_color);
  root.style.setProperty('--color-text', theme.text_color);

  // Derived card and container colors
  if (isLight) {
    root.style.setProperty('--color-card', '#ffffff');
    root.style.setProperty('--color-card-muted', '#f8fafc');
    root.style.setProperty('--color-card-border', '#e2e8f0');
    root.style.setProperty('--color-text-muted', '#64748b');
    root.style.setProperty('--color-text-dim', '#94a3b8');
    root.style.setProperty('--color-nav-bg', 'rgba(255, 255, 255, 0.94)');
    root.style.setProperty('--color-nav-border', '#e2e8f0');
    root.style.setProperty('--color-badge-bg', 'rgba(37, 99, 235, 0.08)');
    root.style.setProperty('--color-badge-text', '#1d4ed8');
    root.style.setProperty('--color-badge-border', 'rgba(37, 99, 235, 0.25)');
    root.style.setProperty('--color-grid', 'rgba(37, 99, 235, 0.05)');
    root.style.setProperty('--color-button-text', '#ffffff');
  } else if (isNeon) {
    root.style.setProperty('--color-card', '#060d1f');
    root.style.setProperty('--color-card-muted', '#08142c');
    root.style.setProperty('--color-card-border', 'rgba(0, 240, 255, 0.3)');
    root.style.setProperty('--color-text-muted', '#94a3b8');
    root.style.setProperty('--color-text-dim', '#64748b');
    root.style.setProperty('--color-nav-bg', 'rgba(3, 7, 18, 0.95)');
    root.style.setProperty('--color-nav-border', 'rgba(0, 240, 255, 0.25)');
    root.style.setProperty('--color-badge-bg', 'rgba(0, 240, 255, 0.12)');
    root.style.setProperty('--color-badge-text', '#00f0ff');
    root.style.setProperty('--color-badge-border', 'rgba(0, 240, 255, 0.45)');
    root.style.setProperty('--color-grid', 'rgba(0, 240, 255, 0.07)');
    root.style.setProperty('--color-button-text', '#030712');
  } else {
    // Default Josh Dark
    root.style.setProperty('--color-card', '#081022');
    root.style.setProperty('--color-card-muted', '#0a1428');
    root.style.setProperty('--color-card-border', '#1e293b');
    root.style.setProperty('--color-text-muted', '#94a3b8');
    root.style.setProperty('--color-text-dim', '#64748b');
    root.style.setProperty('--color-nav-bg', 'rgba(5, 8, 17, 0.92)');
    root.style.setProperty('--color-nav-border', 'rgba(30, 41, 59, 0.8)');
    root.style.setProperty('--color-badge-bg', 'rgba(0, 229, 255, 0.1)');
    root.style.setProperty('--color-badge-text', '#00e5ff');
    root.style.setProperty('--color-badge-border', 'rgba(0, 229, 255, 0.3)');
    root.style.setProperty('--color-grid', 'rgba(0, 229, 255, 0.04)');
    root.style.setProperty('--color-button-text', '#050811');
  }

  // Button Color token
  const buttonColor = theme.button_color || (isNeon ? '#00f0ff' : theme.accent_color);
  root.style.setProperty('--color-button', buttonColor);

  // Border Radius tokens
  switch (theme.border_radius) {
    case 'sharp':
      root.style.setProperty('--radius-base', '4px');
      root.style.setProperty('--radius-card', '6px');
      root.style.setProperty('--radius-button', '4px');
      break;
    case 'rounded':
      root.style.setProperty('--radius-base', '20px');
      root.style.setProperty('--radius-card', '24px');
      root.style.setProperty('--radius-button', '9999px');
      break;
    case 'medium':
    default:
      root.style.setProperty('--radius-base', '12px');
      root.style.setProperty('--radius-card', '16px');
      root.style.setProperty('--radius-button', '12px');
      break;
  }

  // Animation speed tokens
  switch (theme.animation_intensity) {
    case 'low':
      root.style.setProperty('--animation-duration-factor', '0.6');
      break;
    case 'high':
      root.style.setProperty('--animation-duration-factor', '1.4');
      break;
    case 'medium':
    default:
      root.style.setProperty('--animation-duration-factor', '1');
      break;
  }

  // Font family
  if (theme.font_family === 'Inter') {
    root.style.setProperty('--font-primary', "'Inter', -apple-system, sans-serif");
    root.style.setProperty('--font-bengali', "'Hind Siliguri', 'Inter', sans-serif");
  } else if (theme.font_family === 'Hind Siliguri') {
    root.style.setProperty('--font-primary', "'Hind Siliguri', 'Inter', sans-serif");
    root.style.setProperty('--font-bengali', "'Hind Siliguri', sans-serif");
  } else {
    // Inter + Hind Siliguri
    root.style.setProperty('--font-primary', "'Inter', 'Hind Siliguri', sans-serif");
    root.style.setProperty('--font-bengali', "'Hind Siliguri', 'Inter', -apple-system, sans-serif");
  }

  // DOM Data Attributes for CSS selectors
  root.setAttribute('data-theme', theme.preset);
  root.setAttribute('data-button-style', theme.button_style);
  root.setAttribute('data-border-radius', theme.border_radius);
  root.setAttribute('data-network-animation', theme.network_animation ? 'true' : 'false');
  root.setAttribute('data-grid', theme.background_grid ? 'true' : 'false');
  root.setAttribute('data-glow', theme.glow_effects ? 'true' : 'false');
  root.setAttribute('data-page-animations', theme.page_animations ? 'true' : 'false');

  // If light theme, remove 'dark' class from html; otherwise add 'dark'
  if (isLight) {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }

  // Favicon update if configured
  if (theme.favicon_url && theme.favicon_url.trim() !== '') {
    const existingFavicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (existingFavicon) {
      existingFavicon.href = theme.favicon_url.trim();
    }
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Try loading from localStorage first for instant, zero-flicker render
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          return { ...DEFAULT_THEME_JOSH_DARK, ...parsed };
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_THEME_JOSH_DARK;
  });

  const [previewTheme, setPreviewTheme] = useState<ThemeSettings | null>(null);
  const [loadingTheme, setLoadingTheme] = useState<boolean>(true);

  const effectiveTheme = useMemo(() => {
    return previewTheme || theme;
  }, [previewTheme, theme]);

  // Apply CSS tokens immediately on mount and whenever effectiveTheme changes
  useEffect(() => {
    applyThemeTokensToDOM(effectiveTheme);
  }, [effectiveTheme]);

  // Fetch active theme from Supabase
  const loadThemeFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoadingTheme(false);
      return;
    }

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoadingTheme(false);
        return;
      }

      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('id', 'active_theme')
        .maybeSingle();

      if (!error && data) {
        const loadedTheme: ThemeSettings = {
          id: data.id,
          preset: data.preset || 'josh_dark',
          primary_color: data.primary_color || DEFAULT_THEME_JOSH_DARK.primary_color,
          secondary_color: data.secondary_color || DEFAULT_THEME_JOSH_DARK.secondary_color,
          accent_color: data.accent_color || DEFAULT_THEME_JOSH_DARK.accent_color,
          background_color: data.background_color || DEFAULT_THEME_JOSH_DARK.background_color,
          text_color: data.text_color || DEFAULT_THEME_JOSH_DARK.text_color,
          button_color: data.button_color || data.accent_color || DEFAULT_THEME_JOSH_DARK.button_color,
          button_style: data.button_style || 'solid',
          border_radius: data.border_radius || 'medium',
          animation_intensity: data.animation_intensity || 'medium',
          network_animation: data.network_animation ?? true,
          background_grid: data.background_grid ?? true,
          glow_effects: data.glow_effects ?? true,
          page_animations: data.page_animations ?? true,
          announcement_enabled: data.announcement_enabled ?? true,
          floating_contact_enabled: data.floating_contact_enabled ?? true,
          font_family: data.font_family || 'Inter + Hind Siliguri',
          logo_url: data.logo_url || '',
          favicon_url: data.favicon_url || '',
          updated_at: data.updated_at,
          updated_by: data.updated_by,
        };

        setTheme(loadedTheme);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loadedTheme));
        } catch {
          // ignore storage error
        }
      }
    } catch (err) {
      console.warn('Could not load theme from Supabase, using cached/fallback theme:', err);
    } finally {
      setLoadingTheme(false);
    }
  }, []);

  useEffect(() => {
    loadThemeFromSupabase();
  }, [loadThemeFromSupabase]);

  // Update theme settings (Admin / Super Admin only)
  const updateTheme = useCallback(async (newSettings: Partial<ThemeSettings>): Promise<boolean> => {
    const merged: ThemeSettings = {
      ...theme,
      ...newSettings,
      id: 'active_theme',
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    };

    // Update local state and cache immediately
    setTheme(merged);
    setPreviewTheme(null); // clear preview upon save
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // ignore
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('theme_settings')
          .upsert({
            id: 'active_theme',
            preset: merged.preset,
            primary_color: merged.primary_color,
            secondary_color: merged.secondary_color,
            accent_color: merged.accent_color,
            background_color: merged.background_color,
            text_color: merged.text_color,
            button_style: merged.button_style,
            border_radius: merged.border_radius,
            animation_intensity: merged.animation_intensity,
            network_animation: merged.network_animation,
            background_grid: merged.background_grid,
            glow_effects: merged.glow_effects,
            page_animations: merged.page_animations,
            announcement_enabled: merged.announcement_enabled,
            floating_contact_enabled: merged.floating_contact_enabled,
            font_family: merged.font_family,
            logo_url: merged.logo_url,
            favicon_url: merged.favicon_url,
            updated_at: merged.updated_at,
            updated_by: user?.id,
          }, { onConflict: 'id' });

        if (error) {
          console.error('Failed to update theme in Supabase:', error);
          throw error;
        }

        // Record Audit Log: UPDATE_THEME
        try {
          await supabase.from('admin_audit_logs').insert([{
            admin_user_id: user?.id,
            admin_email: user?.email,
            action: 'UPDATE_THEME',
            table_name: 'theme_settings',
            record_id: 'active_theme',
            metadata: {
              preset: merged.preset,
              primary_color: merged.primary_color,
              accent_color: merged.accent_color,
              background_color: merged.background_color,
              button_style: merged.button_style,
              border_radius: merged.border_radius,
              timestamp: new Date().toISOString(),
            },
          }]);
        } catch (auditErr) {
          console.warn('Failed to record UPDATE_THEME audit log:', auditErr);
        }
      } catch (err) {
        console.error('Theme update network error:', err);
        throw err;
      }
    }

    return true;
  }, [theme, user]);

  // Reset to default JOSH DARK
  const resetToDefault = useCallback(async (): Promise<boolean> => {
    return await updateTheme({
      ...DEFAULT_THEME_JOSH_DARK,
      id: 'active_theme',
    });
  }, [updateTheme]);

  // Set live preview (or clear by passing null)
  const setPreview = useCallback((preview: ThemeSettings | null) => {
    setPreviewTheme(preview);
  }, []);

  // Quick apply preset
  const applyPreset = useCallback((preset: ThemePreset) => {
    const presetConfig = THEME_PRESETS_MAP[preset];
    if (presetConfig) {
      setPreviewTheme((prev) => ({
        ...(prev || theme),
        ...presetConfig,
      }));
    }
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    previewTheme,
    effectiveTheme,
    loadingTheme,
    updateTheme,
    setPreview,
    resetToDefault,
    applyPreset,
  }), [
    theme,
    previewTheme,
    effectiveTheme,
    loadingTheme,
    updateTheme,
    setPreview,
    resetToDefault,
    applyPreset,
  ]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
