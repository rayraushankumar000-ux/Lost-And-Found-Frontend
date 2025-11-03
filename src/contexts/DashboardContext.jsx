// src/contexts/DashboardContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth(); // optional, we still fetch even if user is null
  const [stats, setStats] = useState({
    totalLost: 0,
    totalFound: 0,
    matches: 0,
    successRate: 0,
    // legacy keys expected by Dashboard.jsx so it doesn't render blanks before first fetch
    lostItems: 0,
    foundItems: 0,
    successfulReturns: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [summaryRes, userRes, recentRes] = await Promise.all([
        api.get('/dashboard/summary').catch(() => ({ data: null })),
        api.get('/admin/user-dashboard').catch(() => ({ data: null })),
        api.get('/dashboard/recent', { params: { limit: 8 } }).catch(() => ({ data: [] }))
      ]);

      // Prefer global summary if it returns meaningful numbers; otherwise, fallback to user dashboard
      const s = summaryRes?.data || {};
      const userData = userRes?.data?.data || {};

      let totalLost = s.totalLost ?? 0;
      let totalFound = s.totalFound ?? 0;
      let matchesCount = s.matchesCount ?? 0;
      let totalItems = s.totalItems ?? (Number(totalLost) + Number(totalFound));

      const summaryLooksEmpty = [totalLost, totalFound, matchesCount].every(v => !v || Number(v) === 0);
      if (summaryLooksEmpty && (userData.lostItems || userData.foundItems || userData.matches || userData.successfulReturns)) {
        totalLost = userData.lostItems || 0;
        totalFound = userData.foundItems || 0;
        matchesCount = userData.matches || 0;
        totalItems = totalLost + totalFound;
      }

      // As a final fallback, compute counts from items search
      if ([totalLost, totalFound].every(v => Number(v) === 0)) {
        try {
          const itemsRes = await api.get('/items/search');
          const items = itemsRes.data?.data || itemsRes.data?.items || [];
          if (Array.isArray(items) && items.length > 0) {
            const lostCt = items.filter(it => (it.status || '').toLowerCase() === 'lost').length;
            const foundCt = items.filter(it => (it.status || '').toLowerCase() === 'found').length;
            totalLost = lostCt;
            totalFound = foundCt;
            totalItems = lostCt + foundCt;
            matchesCount = Math.min(lostCt, foundCt);
          }
        } catch (_) {
          // ignore fallback errors
        }
      }

      // Normalize stats to support both current and legacy Dashboard consumers
      setStats({
        // primary
        totalLost,
        totalFound,
        matches: matchesCount,
        successRate: totalItems ? Math.round((matchesCount / totalItems) * 100) : 0,
        // legacy keys expected by some components
        lostItems: totalLost,
        foundItems: totalFound,
        successfulReturns: matchesCount
      });

      let recent = (recentRes.data || []).map(it => ({
        id: it._id,
        title: it.title,
        type: it.type || it.status || 'lost',
        status: it.status || 'active',
        reporter: it.reporter?.name || it.reporter?.email || 'Unknown',
        createdAt: it.createdAt
      }));
      // Fallback 1: user dashboard recent activity
      if (!recent || recent.length === 0) {
        const ua = Array.isArray(userData.recentActivity) ? userData.recentActivity : [];
        if (ua.length > 0) {
          recent = ua.map(a => ({
            id: a.id,
            title: a.item,
            type: a.type,
            status: a.status,
            reporter: 'You',
            createdAt: a.date
          }));
        }
      }

      // Fallback 2: derive from items/search
      if (!recent || recent.length === 0) {
        try {
          const itemsRes = await api.get('/items/search');
          const items = itemsRes.data?.data || itemsRes.data?.items || [];
          recent = items.slice(0, 8).map(it => ({
            id: it._id,
            title: it.title || it.description || 'Item',
            type: it.status || 'lost',
            status: it.status || 'active',
            reporter: it.reporter?.name || it.reporter?.email || 'Unknown',
            createdAt: it.createdAt
          }));
        } catch (_) {
          // ignore
        }
      }

      setRecentItems(recent);

      // Provide recentActivity shape expected by Dashboard page
      setRecentActivity(recent.map(r => ({
        id: r.id,
        item: r.title,
        date: typeof r.createdAt === 'string' ? r.createdAt : (r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : ''),
        status: r.status,
        type: r.type
      })));
    } catch (err) {
      console.error('Dashboard fetch error', err);
      // keep previous state; show empty if fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetch on mount, and when user changes (so admin login will refresh)
    fetchDashboard();
    // you could also set an interval or socket to refresh periodically
  }, [user]);

  return (
    <DashboardContext.Provider value={{
      stats,
      recentItems,
      recentActivity,
      loading,
      // keep both names for compatibility with existing pages
      refresh: fetchDashboard,
      refreshDashboard: fetchDashboard
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
export default DashboardContext;
