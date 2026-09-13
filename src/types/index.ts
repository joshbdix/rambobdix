export type StatusType = 'active' | 'inactive';
export type AdminRole = 'admin' | 'super_admin' | 'editor';
export type AdminStatus = 'active' | 'inactive' | 'suspended';
export type AnnouncementType = 'info' | 'success' | 'warning' | 'important';

export interface PackageItem {
  id: string;
  name: string;
  internet_speed: string; // e.g. "30 Mbps"
  service_speed: string;  // e.g. "3.75 Mbps" (BDIX / Streaming Speed)
  price: string;          // e.g. "75" or "৳75"
  duration: string;       // e.g. "24 Hours"
  description: string;
  features: string[];
  badge?: string;
  status: StatusType;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: StatusType;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  status: StatusType;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  status: StatusType;
  sort_order?: number;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SettingItem {
  id?: string;
  key: string;
  value: string;
  is_public?: boolean;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  user_id?: string;
  email: string;
  full_name?: string;
  role: AdminRole;
  status: AdminStatus;
  created_at?: string;
  updated_at?: string;
}

export interface AdminRecord {
  id: string;
  email: string;
  full_name?: string;
  role: AdminRole;
  status: AdminStatus;
  created_at?: string;
  updated_at?: string;
}

export interface AuditLogRecord {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: string;
  created_at: string;
  ip_address?: string;
}

export interface AuditLogItem {
  id: string;
  admin_user_id?: string;
  admin_email: string;
  action: string;
  table_name?: string;
  entity_type?: string;
  record_id?: string;
  metadata?: Record<string, unknown>;
  details?: string;
  created_at: string;
}

export interface WebsiteSettings {
  brand_name: string;
  short_brand_name: string;
  tagline: string;
  hero_title: string;
  hero_description: string;
  about_text: string;
  support_text?: string;
  telegram_url: string;
  telegram_username: string;
  telegram_group_url: string;
  facebook_url: string;
  footer_text: string;
}

export * from './theme';
