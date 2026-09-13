import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  PackageItem, 
  ServiceItem, 
  FAQItem, 
  AnnouncementItem, 
  WebsiteSettings, 
  AuditLogItem 
} from '../types';
import { 
  INITIAL_PACKAGES, 
  INITIAL_SERVICES, 
  INITIAL_FAQS, 
  INITIAL_ANNOUNCEMENTS, 
  DEFAULT_SETTINGS 
} from '../lib/constants';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface DataContextType {
  packages: PackageItem[];
  services: ServiceItem[];
  faqs: FAQItem[];
  announcements: AnnouncementItem[];
  settings: WebsiteSettings;
  auditLogs: AuditLogItem[];
  loading: boolean;
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
  // Packages CRUD
  createPackage: (pkg: Omit<PackageItem, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updatePackage: (id: string, pkg: Partial<PackageItem>) => Promise<boolean>;
  deletePackage: (id: string) => Promise<boolean>;
  togglePackageStatus: (id: string) => Promise<boolean>;
  // Services CRUD
  createService: (srv: Omit<ServiceItem, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateService: (id: string, srv: Partial<ServiceItem>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  toggleServiceStatus: (id: string) => Promise<boolean>;
  // FAQs CRUD
  createFAQ: (faq: Omit<FAQItem, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateFAQ: (id: string, faq: Partial<FAQItem>) => Promise<boolean>;
  deleteFAQ: (id: string) => Promise<boolean>;
  toggleFAQStatus: (id: string) => Promise<boolean>;
  // Announcements CRUD
  createAnnouncement: (ann: Omit<AnnouncementItem, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateAnnouncement: (id: string, ann: Partial<AnnouncementItem>) => Promise<boolean>;
  deleteAnnouncement: (id: string) => Promise<boolean>;
  toggleAnnouncementStatus: (id: string) => Promise<boolean>;
  // Settings
  updateSettings: (newSettings: Partial<WebsiteSettings>) => Promise<boolean>;
  // Refresh
  reloadData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const normalizePackages = useCallback((items: PackageItem[]): PackageItem[] => {
    return items.map((pkg) => {
      const match = INITIAL_PACKAGES.find((p) => p.name.toUpperCase() === pkg.name.toUpperCase());
      return {
        ...pkg,
        internet_speed: pkg.internet_speed || match?.internet_speed || '30 Mbps',
        service_speed: pkg.service_speed || match?.service_speed || '3.75 Mbps',
        duration: pkg.duration || '24 Hours',
      };
    });
  }, []);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Helper for logging audit events
  const recordAuditLog = useCallback(async (action: string, tableName: string, recordId?: string, metadata?: Record<string, unknown>) => {
    const logItem: AuditLogItem = {
      id: 'log-' + Date.now(),
      admin_user_id: user?.id || 'admin',
      admin_email: user?.email || 'admin@joshrambo.bd',
      action,
      table_name: tableName,
      record_id: recordId,
      metadata,
      created_at: new Date().toISOString(),
    };

    setAuditLogs((prev) => [logItem, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('admin_audit_logs').insert([{
          admin_user_id: user?.id,
          admin_email: user?.email,
          action,
          table_name: tableName,
          record_id: recordId,
          metadata,
        }]);
      } catch (e) {
        console.warn('Failed to record server audit log:', e);
      }
    }
  }, [user]);

  // Load all data
  const reloadData = useCallback(async () => {
    setLoading(true);
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        // Fetch Packages
        const { data: pkgData, error: pkgErr } = await supabase
          .from('packages')
          .select('*')
          .order('sort_order', { ascending: true });
        if (!pkgErr && pkgData && pkgData.length > 0) {
          setPackages(normalizePackages(pkgData as PackageItem[]));
        } else {
          setPackages(INITIAL_PACKAGES);
        }

        // Fetch Services
        const { data: srvData, error: srvErr } = await supabase
          .from('services')
          .select('*')
          .order('sort_order', { ascending: true });
        if (!srvErr && srvData) {
          setServices(srvData as ServiceItem[]);
        } else {
          setServices(INITIAL_SERVICES);
        }

        // Fetch FAQs
        const { data: faqData, error: faqErr } = await supabase
          .from('faqs')
          .select('*')
          .order('sort_order', { ascending: true });
        if (!faqErr && faqData) {
          setFaqs(faqData as FAQItem[]);
        } else {
          setFaqs(INITIAL_FAQS);
        }

        // Fetch Announcements
        const { data: annData, error: annErr } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });
        if (!annErr && annData) {
          setAnnouncements(annData as AnnouncementItem[]);
        } else {
          setAnnouncements(INITIAL_ANNOUNCEMENTS);
        }

        // Fetch Settings
        const { data: setData } = await supabase
          .from('settings')
          .select('*');
        if (setData && setData.length > 0) {
          const loadedSettings = { ...DEFAULT_SETTINGS };
          setData.forEach((item: { key: string; value: string }) => {
            if (item.key in loadedSettings) {
              (loadedSettings as Record<string, string>)[item.key] = item.value;
            }
          });
          setSettings(loadedSettings);
        } else {
          setSettings(DEFAULT_SETTINGS);
        }

        // Fetch Audit Logs (if admin)
        const { data: logsData } = await supabase
          .from('admin_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        if (logsData) {
          setAuditLogs(logsData as AuditLogItem[]);
        }
      } catch (err) {
        console.warn('Error fetching from Supabase, falling back to local data:', err);
        loadLocalFallback();
      }
    } else {
      loadLocalFallback();
    }
    setLoading(false);
  }, [normalizePackages]);

  const loadLocalFallback = () => {
    try {
      const storedPkgs = localStorage.getItem('JOSH_RAMBO_PACKAGES');
      const storedSrvs = localStorage.getItem('JOSH_RAMBO_SERVICES');
      const storedFaqs = localStorage.getItem('JOSH_RAMBO_FAQS');
      const storedAnns = localStorage.getItem('JOSH_RAMBO_ANNOUNCEMENTS');
      const storedSets = localStorage.getItem('JOSH_RAMBO_SETTINGS');
      const storedLogs = localStorage.getItem('JOSH_RAMBO_AUDIT_LOGS');

      if (storedPkgs) {
        try {
          const parsed = JSON.parse(storedPkgs);
          setPackages(normalizePackages(parsed));
        } catch {
          setPackages(INITIAL_PACKAGES);
        }
      } else {
        setPackages(INITIAL_PACKAGES);
      }

      setServices(storedSrvs ? JSON.parse(storedSrvs) : INITIAL_SERVICES);
      setFaqs(storedFaqs ? JSON.parse(storedFaqs) : INITIAL_FAQS);
      setAnnouncements(storedAnns ? JSON.parse(storedAnns) : INITIAL_ANNOUNCEMENTS);
      setSettings(storedSets ? JSON.parse(storedSets) : DEFAULT_SETTINGS);
      setAuditLogs(storedLogs ? JSON.parse(storedLogs) : [
        {
          id: 'log-seed-1',
          admin_user_id: 'system',
          admin_email: 'system@joshrambo.bd',
          action: 'System Initialized',
          table_name: 'system',
          metadata: { note: 'Initial seed configuration loaded successfully.' },
          created_at: new Date().toISOString(),
        }
      ]);
    } catch {
      setPackages(INITIAL_PACKAGES);
      setServices(INITIAL_SERVICES);
      setFaqs(INITIAL_FAQS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setSettings(DEFAULT_SETTINGS);
    }
  };

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Persist to local storage helper
  const saveLocalState = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  // PACKAGES CRUD
  const createPackage = async (pkg: Omit<PackageItem, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    const supabase = getSupabaseClient();
    const newId = 'pkg-' + Date.now();
    const newPackage: PackageItem = {
      ...pkg,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { id: _ignoredId, ...insertPayload } = newPackage;
        const { data, error } = await supabase.from('packages').insert([insertPayload]).select().single();
        if (error) throw error;
        setPackages((prev) => [...prev, data as PackageItem]);
        await recordAuditLog('Create Package', 'packages', data.id, { name: pkg.name, price: pkg.price });
        showToast('success', 'প্যাকেজ সফলভাবে তৈরি হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'ব্যর্থ হয়েছে';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = [...packages, newPackage];
      setPackages(updated);
      saveLocalState('JOSH_RAMBO_PACKAGES', updated);
      await recordAuditLog('Create Package (Local)', 'packages', newId, { name: pkg.name });
      showToast('success', 'প্যাকেজ সফলভাবে তৈরি হয়েছে!');
      return true;
    }
  };

  const updatePackage = async (id: string, pkg: Partial<PackageItem>): Promise<boolean> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('packages')
          .update({ ...pkg, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        setPackages((prev) => prev.map((item) => (item.id === id ? (data as PackageItem) : item)));
        await recordAuditLog('Update Package', 'packages', id, pkg);
        showToast('success', 'প্যাকেজ আপডেট হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'আপডেট ব্যর্থ';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = packages.map((item) => (item.id === id ? { ...item, ...pkg, updated_at: new Date().toISOString() } : item));
      setPackages(updated);
      saveLocalState('JOSH_RAMBO_PACKAGES', updated);
      await recordAuditLog('Update Package (Local)', 'packages', id, pkg);
      showToast('success', 'প্যাকেজ আপডেট হয়েছে!');
      return true;
    }
  };

  const deletePackage = async (id: string): Promise<boolean> => {
    const target = packages.find((p) => p.id === id);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('packages').delete().eq('id', id);
        if (error) throw error;
        setPackages((prev) => prev.filter((p) => p.id !== id));
        await recordAuditLog('Delete Package', 'packages', id, { name: target?.name });
        showToast('success', 'প্যাকেজ মুছে ফেলা হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'মুছতে ব্যর্থ';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = packages.filter((p) => p.id !== id);
      setPackages(updated);
      saveLocalState('JOSH_RAMBO_PACKAGES', updated);
      await recordAuditLog('Delete Package (Local)', 'packages', id, { name: target?.name });
      showToast('success', 'প্যাকেজ মুছে ফেলা হয়েছে!');
      return true;
    }
  };

  const togglePackageStatus = async (id: string): Promise<boolean> => {
    const target = packages.find((p) => p.id === id);
    if (!target) return false;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    return updatePackage(id, { status: newStatus });
  };

  // SERVICES CRUD
  const createService = async (srv: Omit<ServiceItem, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    const supabase = getSupabaseClient();
    const newId = 'srv-' + Date.now();
    const newService: ServiceItem = {
      ...srv,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('services').insert([newService]).select().single();
        if (error) throw error;
        setServices((prev) => [...prev, data as ServiceItem]);
        await recordAuditLog('Create Service', 'services', data.id, { title: srv.title });
        showToast('success', 'সার্ভিস যুক্ত করা হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'ব্যর্থ হয়েছে';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = [...services, newService];
      setServices(updated);
      saveLocalState('JOSH_RAMBO_SERVICES', updated);
      await recordAuditLog('Create Service (Local)', 'services', newId, { title: srv.title });
      showToast('success', 'সার্ভিস যুক্ত করা হয়েছে!');
      return true;
    }
  };

  const updateService = async (id: string, srv: Partial<ServiceItem>): Promise<boolean> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('services')
          .update({ ...srv, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        setServices((prev) => prev.map((item) => (item.id === id ? (data as ServiceItem) : item)));
        await recordAuditLog('Update Service', 'services', id, srv);
        showToast('success', 'সার্ভিস আপডেট হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'আপডেট ব্যর্থ';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = services.map((item) => (item.id === id ? { ...item, ...srv, updated_at: new Date().toISOString() } : item));
      setServices(updated);
      saveLocalState('JOSH_RAMBO_SERVICES', updated);
      await recordAuditLog('Update Service (Local)', 'services', id, srv);
      showToast('success', 'সার্ভিস আপডেট হয়েছে!');
      return true;
    }
  };

  const deleteService = async (id: string): Promise<boolean> => {
    const target = services.find((s) => s.id === id);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) throw error;
        setServices((prev) => prev.filter((s) => s.id !== id));
        await recordAuditLog('Delete Service', 'services', id, { title: target?.title });
        showToast('success', 'সার্ভিস মুছে ফেলা হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'মুছতে ব্যর্থ';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = services.filter((s) => s.id !== id);
      setServices(updated);
      saveLocalState('JOSH_RAMBO_SERVICES', updated);
      await recordAuditLog('Delete Service (Local)', 'services', id, { title: target?.title });
      showToast('success', 'সার্ভিস মুছে ফেলা হয়েছে!');
      return true;
    }
  };

  const toggleServiceStatus = async (id: string): Promise<boolean> => {
    const target = services.find((s) => s.id === id);
    if (!target) return false;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    return updateService(id, { status: newStatus });
  };

  // FAQS CRUD
  const createFAQ = async (faq: Omit<FAQItem, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    const supabase = getSupabaseClient();
    const newId = 'faq-' + Date.now();
    const newFAQ: FAQItem = {
      ...faq,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('faqs').insert([newFAQ]).select().single();
        if (error) throw error;
        setFaqs((prev) => [...prev, data as FAQItem]);
        await recordAuditLog('Create FAQ', 'faqs', data.id, { question: faq.question });
        showToast('success', 'FAQ সফলভাবে যুক্ত হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'ব্যর্থ হয়েছে';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = [...faqs, newFAQ];
      setFaqs(updated);
      saveLocalState('JOSH_RAMBO_FAQS', updated);
      await recordAuditLog('Create FAQ (Local)', 'faqs', newId, { question: faq.question });
      showToast('success', 'FAQ সফলভাবে যুক্ত হয়েছে!');
      return true;
    }
  };

  const updateFAQ = async (id: string, faq: Partial<FAQItem>): Promise<boolean> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('faqs')
          .update({ ...faq, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        setFaqs((prev) => prev.map((item) => (item.id === id ? (data as FAQItem) : item)));
        await recordAuditLog('Update FAQ', 'faqs', id, faq);
        showToast('success', 'FAQ আপডেট হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'আপডেট ব্যর্থ';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = faqs.map((item) => (item.id === id ? { ...item, ...faq, updated_at: new Date().toISOString() } : item));
      setFaqs(updated);
      saveLocalState('JOSH_RAMBO_FAQS', updated);
      await recordAuditLog('Update FAQ (Local)', 'faqs', id, faq);
      showToast('success', 'FAQ আপডেট হয়েছে!');
      return true;
    }
  };

  const deleteFAQ = async (id: string): Promise<boolean> => {
    const target = faqs.find((f) => f.id === id);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('faqs').delete().eq('id', id);
        if (error) throw error;
        setFaqs((prev) => prev.filter((p) => p.id !== id));
        await recordAuditLog('Delete FAQ', 'faqs', id, { question: target?.question });
        showToast('success', 'FAQ মুছে ফেলা হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'মুছতে ব্যর্থ';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = faqs.filter((f) => f.id !== id);
      setFaqs(updated);
      saveLocalState('JOSH_RAMBO_FAQS', updated);
      await recordAuditLog('Delete FAQ (Local)', 'faqs', id, { question: target?.question });
      showToast('success', 'FAQ মুছে ফেলা হয়েছে!');
      return true;
    }
  };

  const toggleFAQStatus = async (id: string): Promise<boolean> => {
    const target = faqs.find((f) => f.id === id);
    if (!target) return false;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    return updateFAQ(id, { status: newStatus });
  };

  // ANNOUNCEMENTS CRUD
  const createAnnouncement = async (ann: Omit<AnnouncementItem, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    const supabase = getSupabaseClient();
    const newId = 'ann-' + Date.now();
    const newAnnouncement: AnnouncementItem = {
      ...ann,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('announcements').insert([newAnnouncement]).select().single();
        if (error) throw error;
        setAnnouncements((prev) => [data as AnnouncementItem, ...prev]);
        await recordAuditLog('Create Announcement', 'announcements', data.id, { title: ann.title });
        showToast('success', 'নোটিশ পাবলিশ করা হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'ব্যর্থ হয়েছে';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = [newAnnouncement, ...announcements];
      setAnnouncements(updated);
      saveLocalState('JOSH_RAMBO_ANNOUNCEMENTS', updated);
      await recordAuditLog('Create Announcement (Local)', 'announcements', newId, { title: ann.title });
      showToast('success', 'নোটিশ পাবলিশ করা হয়েছে!');
      return true;
    }
  };

  const updateAnnouncement = async (id: string, ann: Partial<AnnouncementItem>): Promise<boolean> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .update({ ...ann, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        setAnnouncements((prev) => prev.map((item) => (item.id === id ? (data as AnnouncementItem) : item)));
        await recordAuditLog('Update Announcement', 'announcements', id, ann);
        showToast('success', 'নোটিশ আপডেট হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'আপডেট ব্যর্থ';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = announcements.map((item) => (item.id === id ? { ...item, ...ann, updated_at: new Date().toISOString() } : item));
      setAnnouncements(updated);
      saveLocalState('JOSH_RAMBO_ANNOUNCEMENTS', updated);
      await recordAuditLog('Update Announcement (Local)', 'announcements', id, ann);
      showToast('success', 'নোটিশ আপডেট হয়েছে!');
      return true;
    }
  };

  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    const target = announcements.find((a) => a.id === id);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('announcements').delete().eq('id', id);
        if (error) throw error;
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        await recordAuditLog('Delete Announcement', 'announcements', id, { title: target?.title });
        showToast('success', 'নোটিশ মুছে ফেলা হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'মুছতে ব্যর্থ';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      const updated = announcements.filter((a) => a.id !== id);
      setAnnouncements(updated);
      saveLocalState('JOSH_RAMBO_ANNOUNCEMENTS', updated);
      await recordAuditLog('Delete Announcement (Local)', 'announcements', id, { title: target?.title });
      showToast('success', 'নোটিশ মুছে ফেলা হয়েছে!');
      return true;
    }
  };

  const toggleAnnouncementStatus = async (id: string): Promise<boolean> => {
    const target = announcements.find((a) => a.id === id);
    if (!target) return false;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    return updateAnnouncement(id, { status: newStatus });
  };

  // SETTINGS MANAGEMENT
  const updateSettings = async (newSettings: Partial<WebsiteSettings>): Promise<boolean> => {
    const merged = { ...settings, ...newSettings };
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const upsertPromises = Object.entries(newSettings).map(([key, value]) =>
          supabase
            .from('settings')
            .upsert({ key, value: String(value), is_public: true, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        );
        await Promise.all(upsertPromises);
        setSettings(merged);
        await recordAuditLog('Update Website Settings', 'settings', undefined, newSettings);
        showToast('success', 'ওয়েবসাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'সংরক্ষণ ব্যর্থ';
        showToast('error', `ত্রুটি: ${msg}`);
        return false;
      }
    } else {
      setSettings(merged);
      saveLocalState('JOSH_RAMBO_SETTINGS', merged);
      await recordAuditLog('Update Settings (Local)', 'settings', undefined, newSettings);
      showToast('success', 'ওয়েবসাইট সেটিংস সংরক্ষিত হয়েছে!');
      return true;
    }
  };

  return (
    <DataContext.Provider
      value={{
        packages,
        services,
        faqs,
        announcements,
        settings,
        auditLogs,
        loading,
        toasts,
        showToast,
        removeToast,
        createPackage,
        updatePackage,
        deletePackage,
        togglePackageStatus,
        createService,
        updateService,
        deleteService,
        toggleServiceStatus,
        createFAQ,
        updateFAQ,
        deleteFAQ,
        toggleFAQStatus,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        toggleAnnouncementStatus,
        updateSettings,
        reloadData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
