import React, { useState, useEffect } from 'react';
import { lostfoundApi } from '../../api/lostfoundApi';
import { ClaimStatus, ItemStatus, LostFoundClaim, LostFoundItem } from '../../types';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Tag,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AdminLostFoundPage: React.FC = () => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [claims, setClaims] = useState<LostFoundClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ITEMS' | 'CLAIMS'>('ITEMS');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingClaim, setReviewingClaim] = useState<LostFoundClaim | null>(null);
  const [reviewStatus, setReviewStatus] = useState<ClaimStatus>('APPROVED');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const itemList = await lostfoundApi.getItems();
      setItems(itemList);

      // Fetch claims for items that have claim pending or in general
      const pendingItems = itemList.filter((i) => i.status === 'CLAIM_PENDING' || i.itemType === 'FOUND');
      const allClaimsNested = await Promise.all(
        pendingItems.slice(0, 10).map((i) =>
          lostfoundApi.getItemClaims(i.id).catch(() => [] as LostFoundClaim[])
        )
      );
      setClaims(allClaimsNested.flat());
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to fetch lost and found desk data',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateItemStatus = async (id: number, status: ItemStatus) => {
    try {
      await lostfoundApi.updateStatus(id, status);
      setFeedback({ type: 'success', message: `Item marked as ${status}!` });
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingClaim) return;

    try {
      setSubmittingReview(true);
      await lostfoundApi.reviewClaim(reviewingClaim.id, reviewStatus, reviewNotes.trim() || undefined);
      setIsReviewModalOpen(false);
      setReviewingClaim(null);
      setReviewNotes('');
      setFeedback({
        type: 'success',
        message: `Claim review saved! Decision: ${reviewStatus}.`,
      });
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to process claim review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Search className="w-7 h-7 text-teal-400" />
            Lost & Found Moderation Desk
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review submitted ownership claims, verify identifying proof, and authorize property returns
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={loadData}>
          <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh Desk
        </Button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ITEMS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'ITEMS'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
              : 'bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Reported Items ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('CLAIMS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
            activeTab === 'CLAIMS'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
              : 'bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>Claim Verification Queue</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-teal-800 text-white">
            {claims.length}
          </span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton height="350px" />
      ) : activeTab === 'ITEMS' ? (
        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Item & Description</th>
                  <th className="px-5 py-3.5 font-semibold">Type</th>
                  <th className="px-5 py-3.5 font-semibold">Category</th>
                  <th className="px-5 py-3.5 font-semibold">Location</th>
                  <th className="px-5 py-3.5 font-semibold">Reported By</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                      No items in register.
                    </td>
                  </tr>
                ) : (
                  items.map((i) => (
                    <tr key={i.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="font-semibold text-white">{i.title}</div>
                        <div className="text-[11px] text-slate-400 truncate">{i.description}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={i.itemType === 'LOST' ? 'danger' : 'success'}>
                          {i.itemType}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-teal-300">{i.category}</td>
                      <td className="px-5 py-3.5 text-slate-300 truncate">{i.location}</td>
                      <td className="px-5 py-3.5 text-slate-400">{i.reportedByName}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            i.status === 'RESOLVED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : i.status === 'CLAIM_PENDING'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {i.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {i.status !== 'RESOLVED' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
                            onClick={() => handleUpdateItemStatus(i.id, 'RESOLVED')}
                          >
                            Mark Resolved
                          </Button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0B132B]/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Claimant</th>
                  <th className="px-5 py-3.5 font-semibold">Item Title</th>
                  <th className="px-5 py-3.5 font-semibold">Proof of Ownership Description</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-slate-500">
                      No active claim submissions in the verification queue.
                    </td>
                  </tr>
                ) : (
                  claims.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-5 py-3.5 font-semibold text-white">{c.claimantName}</td>
                      <td className="px-5 py-3.5 text-teal-300 font-medium">{c.itemTitle}</td>
                      <td className="px-5 py-3.5 text-slate-300 max-w-sm truncate">{c.descriptionProof}</td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={
                            c.status === 'APPROVED'
                              ? 'success'
                              : c.status === 'REJECTED'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {c.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {c.status === 'PENDING' ? (
                          <Button
                            size="sm"
                            variant="primary"
                            className="text-xs"
                            onClick={() => {
                              setReviewingClaim(c);
                              setIsReviewModalOpen(true);
                            }}
                          >
                            Review Claim
                          </Button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">{c.status}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Claim Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review Claim for ${reviewingClaim?.itemTitle}`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <p className="text-slate-400">
              Claimant: <strong className="text-white">{reviewingClaim?.claimantName}</strong>
            </p>
            <div>
              <p className="text-slate-400 font-semibold mb-1">Submitted Proof of Ownership:</p>
              <p className="text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 whitespace-pre-line leading-relaxed">
                {reviewingClaim?.descriptionProof}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Moderator Decision *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReviewStatus('APPROVED')}
                className={`py-2 rounded-xl text-xs font-semibold transition border ${
                  reviewStatus === 'APPROVED'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                Approve & Release Item
              </button>
              <button
                type="button"
                onClick={() => setReviewStatus('REJECTED')}
                className={`py-2 rounded-xl text-xs font-semibold transition border ${
                  reviewStatus === 'REJECTED'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                Reject Claim
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Resolution Notes</label>
            <textarea
              rows={3}
              placeholder="Provide reason or retrieval instructions for the claimant..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submittingReview}>
              {submittingReview ? 'Saving Decision...' : 'Confirm Decision'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
