import React, { useState, useEffect } from 'react';
import { lostfoundApi } from '../../api/lostfoundApi';
import { ItemCategory, ItemStatus, ItemType, LostFoundItem } from '../../types';
import {
  Search,
  PlusCircle,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Tag,
  ShieldAlert,
  User,
  Clock,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

const CATEGORIES: ('ALL' | ItemCategory)[] = [
  'ALL',
  'ELECTRONICS',
  'ID_CARDS',
  'BOOKS',
  'ACCESSORIES',
  'CLOTHING',
  'OTHER',
];

export const StudentLostFoundPage: React.FC = () => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'LOST' | 'FOUND' | 'MY'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ItemCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimingItem, setClaimingItem] = useState<LostFoundItem | null>(null);
  const [claimProof, setClaimProof] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  // New report form state
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    category: 'ELECTRONICS' as ItemCategory,
    itemType: 'LOST' as ItemType,
    location: '',
  });
  const [submittingReport, setSubmittingReport] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      if (activeTab === 'MY') {
        const data = await lostfoundApi.getMyItems();
        setItems(data);
      } else {
        const params: any = {};
        if (activeTab !== 'ALL') params.type = activeTab;
        if (selectedCategory !== 'ALL') params.category = selectedCategory;
        const data = await lostfoundApi.getItems(params);
        setItems(data);
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to load lost and found items',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab, selectedCategory]);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.description || !reportForm.location) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setSubmittingReport(true);
      await lostfoundApi.createItem({
        title: reportForm.title.trim(),
        description: reportForm.description.trim(),
        category: reportForm.category,
        itemType: reportForm.itemType,
        location: reportForm.location.trim(),
      });
      setIsReportModalOpen(false);
      setReportForm({
        title: '',
        description: '',
        category: 'ELECTRONICS',
        itemType: 'LOST',
        location: '',
      });
      setFeedback({
        type: 'success',
        message: 'Your report was successfully submitted and published to the campus board!',
      });
      fetchItems();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingItem || !claimProof.trim()) {
      alert('Please describe proof of ownership.');
      return;
    }

    try {
      setSubmittingClaim(true);
      await lostfoundApi.submitClaim(claimingItem.id, claimProof.trim());
      setIsClaimModalOpen(false);
      setClaimProof('');
      setClaimingItem(null);
      setFeedback({
        type: 'success',
        message: 'Claim proof submitted! Campus admin/moderator will review your claim shortly.',
      });
      fetchItems();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to submit claim');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Search className="w-7 h-7 text-teal-400" />
            Campus Lost & Found Desk
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Report missing belongings, turn in found property, and submit claims with verified proof
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsReportModalOpen(true)}
          className="shadow-lg shadow-teal-600/30 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Report Lost or Found Item
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

      {/* Navigation Tabs (All, Lost, Found, My) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          {(['ALL', 'LOST', 'FOUND', 'MY'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === tab
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'bg-[#0B132B] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab === 'ALL'
                ? 'All Feed'
                : tab === 'LOST'
                ? 'Lost Items'
                : tab === 'FOUND'
                ? 'Found Items'
                : 'My Reported'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items or location..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B132B] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      {activeTab !== 'MY' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Items List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton height="220px" />
          <LoadingSkeleton height="220px" />
          <LoadingSkeleton height="220px" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#0B132B]/80 border border-slate-800 text-center">
          <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Items Found</h3>
          <p className="text-xs text-slate-500 mt-1">No reports matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0B132B]/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between overflow-hidden group shadow-lg"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={item.itemType === 'LOST' ? 'danger' : 'success'}>
                    {item.itemType === 'LOST' ? 'LOST REPORT' : 'FOUND PROPERTY'}
                  </Badge>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      item.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.status === 'CLAIM_PENDING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>Category: <span className="font-semibold text-white">{item.category}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">Location: {item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Recorded: {item.dateRecorded || new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>By {item.reportedByName}</span>
                </div>

                {item.itemType === 'FOUND' && item.status !== 'RESOLVED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-teal-500/40 text-teal-300 hover:bg-teal-500/10 text-xs"
                    onClick={() => {
                      setClaimingItem(item);
                      setIsClaimModalOpen(true);
                    }}
                  >
                    Claim This
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report New Item Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Lost or Found Item"
      >
        <form onSubmit={handleCreateReport} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notice Type *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReportForm({ ...reportForm, itemType: 'LOST' })}
                className={`py-2 rounded-xl text-xs font-semibold transition border ${
                  reportForm.itemType === 'LOST'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                I Lost Something
              </button>
              <button
                type="button"
                onClick={() => setReportForm({ ...reportForm, itemType: 'FOUND' })}
                className={`py-2 rounded-xl text-xs font-semibold transition border ${
                  reportForm.itemType === 'FOUND'
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                I Found An Item
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Item Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Blue Dell Laptop Charger or Black Leather Wallet"
              value={reportForm.title}
              onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={reportForm.category}
                onChange={(e) => setReportForm({ ...reportForm, category: e.target.value as ItemCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500"
              >
                <option value="ELECTRONICS">ELECTRONICS</option>
                <option value="ID_CARDS">ID CARDS</option>
                <option value="BOOKS">BOOKS</option>
                <option value="ACCESSORIES">ACCESSORIES</option>
                <option value="CLOTHING">CLOTHING</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Library 2nd Floor Desk"
                value={reportForm.location}
                onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Provide distinctive features, brand, stickers, serial details or contents to help identification..."
              value={reportForm.description}
              onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submittingReport}>
              {submittingReport ? 'Submitting...' : 'Post Notice'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Claim Submission Modal */}
      <Modal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        title={`Claim Property: ${claimingItem?.title}`}
      >
        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-white">Item: {claimingItem?.title}</p>
            <p className="text-slate-400">Found At: {claimingItem?.location}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Proof of Ownership & Specific Identifiers *
            </label>
            <textarea
              required
              rows={4}
              placeholder="State confidential identifying marks, wallpaper, lock screen message, specific contents or purchase receipts that prove this item belongs to you..."
              value={claimProof}
              onChange={(e) => setClaimProof(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsClaimModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submittingClaim}>
              {submittingClaim ? 'Submitting Claim...' : 'Submit Claim Proof'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
