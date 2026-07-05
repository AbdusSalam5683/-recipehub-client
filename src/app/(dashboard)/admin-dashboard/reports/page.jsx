// client/src/app/(dashboard)/admin-dashboard/reports/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { adminService } from '../../../../services/auth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  FlagIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Loader from '../../../../components/common/Loader';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getReports();
      if (response.success) {
        setReports(response.reports);
      } else {
        setError(response.message || 'Failed to load reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (reportId, action) => {
    setActionLoading(reportId);
    try {
      const response = await adminService.handleReport(reportId, action);
      if (response.success) {
        toast.success(`Report ${action === 'remove' ? 'resolved' : 'dismissed'} successfully`);
        setReports(reports.filter(r => r._id !== reportId));
      }
    } catch (error) {
      toast.error('Failed to handle report');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
          Failed to load
        </h3>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
          {error}
        </p>
        <button
          onClick={fetchReports}
          className="btn-primary mt-4 inline-flex items-center gap-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-charcoal-900 dark:text-cream-50">
          Reports
        </h1>
        <p className="font-body text-charcoal-500 dark:text-cream-400 mt-1">
          Review and manage user reports
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="font-display font-semibold text-xl text-charcoal-900 dark:text-cream-50">
            No pending reports
          </h3>
          <p className="font-body text-charcoal-500 dark:text-cream-400 mt-2">
            All reports have been reviewed and resolved.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report, index) => (
            <motion.div
              key={report._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/30 flex-shrink-0">
                      <FlagIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-charcoal-900 dark:text-cream-50">
                        {report.reason}
                      </h4>
                      <p className="font-body text-sm text-charcoal-500 dark:text-cream-400">
                        Reported by {report.reporterEmail}
                      </p>
                      {report.description && (
                        <p className="font-body text-sm text-charcoal-600 dark:text-cream-300 mt-1">
                          &quot;{report.description}&quot;
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <Link
                          href={`/recipe-details/${report.recipeId?._id}`}
                          className="text-xs text-paprika-600 dark:text-paprika-400 hover:underline flex items-center gap-1"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                          View Recipe
                        </Link>
                        <span className="text-xs text-charcoal-400 dark:text-cream-500">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleReport(report._id, 'remove')}
                    disabled={actionLoading === report._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 transition-colors text-sm font-body font-medium"
                  >
                    {actionLoading === report._id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <XCircleIcon className="h-4 w-4" />
                        Remove Recipe
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReport(report._id, 'dismiss')}
                    disabled={actionLoading === report._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 hover:bg-sage-200 transition-colors text-sm font-body font-medium"
                  >
                    {actionLoading === report._id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircleIcon className="h-4 w-4" />
                        Dismiss
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}