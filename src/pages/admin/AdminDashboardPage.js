import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FiGrid, FiCalendar, FiFileText, FiUsers,
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiDownload,
  FiCheck, FiX, FiDollarSign, FiUserCheck, FiSettings,
  FiUpload, FiEye, FiImage,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import ContentPopup from '../../components/admin/ContentPopup';
import apiService from '../../services/api';

const contentTypes = [
  { id: 'projects', label: 'Projects', icon: FiGrid, popupType: 'project' },
  { id: 'events', label: 'Events', icon: FiCalendar, popupType: 'event' },
  { id: 'blogs', label: 'Blogs', icon: FiFileText, popupType: 'blog' },
  { id: 'reports', label: 'Reports & Publications', icon: FiFileText, popupType: 'report' },
  { id: 'volunteer', label: 'Volunteer Opportunities', icon: FiUsers, popupType: 'volunteer' },
  { id: 'volunteerApplications', label: 'Volunteer Applications', icon: FiUserCheck, popupType: null },
  { id: 'donations', label: 'Donations', icon: FiDollarSign, popupType: null },
  { id: 'donationSettings', label: 'Donation Settings', icon: FiSettings, popupType: null },
];

const tableColumns = {
  projects: ['title', 'category', 'status', 'location', 'progress', 'goal', 'raised'],
  events: ['title', 'type', 'date', 'location', 'capacity', 'registered'],
  blogs: ['title', 'category', 'author', 'date', 'readTime'],
  reports: ['title', 'type', 'year', 'publishedDate', 'pages', 'status'],
  volunteer: ['title', 'category', 'location', 'commitment', 'spots', 'status'],
  volunteerApplications: ['fullName', 'email', 'phone', 'city', 'skills', 'status', 'createdAt'],
  donations: ['name', 'email', 'phone', 'amount', 'type', 'project', 'transactionId', 'paymentStatus', 'createdAt'],
};

const defaultBank = {
  accountHolder: 'Partha Sarathi V',
  bank: 'Canara Bank',
  branch: 'Pattiveeranpatti',
  accountNo: '110301563866',
  ifscCode: 'CNRB0008438',
};

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [itemsByType, setItemsByType] = useState({
    projects: [], events: [], blogs: [], reports: [],
    volunteer: [], volunteerApplications: [], donations: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [volunteerFilter, setVolunteerFilter] = useState('all');
  const [donationStatusFilter, setDonationStatusFilter] = useState('all');
  const [screenshotModal, setScreenshotModal] = useState(null);

  // Donation Settings state
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [qrImage, setQrImage] = useState('');
  const [bankDetails, setBankDetails] = useState({ ...defaultBank });
  const qrFileRef = useRef(null);

  useEffect(() => {
    loadAllContent();
  }, []);

  useEffect(() => {
    if (activeTab === 'donationSettings') {
      loadAdminSettings();
    }
  }, [activeTab]);

  const loadAdminSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await apiService.getAdminSettings();
      if (res?.data) {
        setQrImage(res.data.donationQrImage || '');
        setBankDetails({ ...defaultBank, ...res.data.bankDetails });
      }
    } catch (e) {
      toast.error('Failed to load settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleQrFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('QR image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setQrImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      await apiService.updateAdminSettings({ donationQrImage: qrImage, bankDetails });
      toast.success('Donation settings saved successfully!');
    } catch (e) {
      toast.error(e.message || 'Failed to save settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  const popupType = contentTypes.find((type) => type.id === activeTab)?.popupType || 'project';
  const items = useMemo(() => itemsByType[activeTab] || [], [itemsByType, activeTab]);

  const filteredItems = useMemo(() => {
    let list = items;

    if (activeTab === 'volunteerApplications' && volunteerFilter !== 'all') {
      list = list.filter((v) => v.status === volunteerFilter);
    }
    if (activeTab === 'donations' && donationStatusFilter !== 'all') {
      list = list.filter((d) => d.paymentStatus === donationStatusFilter);
    }

    if (!searchTerm) return list;

    return list.filter((item) =>
      Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return String(typeof value === 'object' ? JSON.stringify(value) : value)
          .toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [items, searchTerm, activeTab, volunteerFilter, donationStatusFilter]);

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const [projects, events, blogs, reports, volunteer, volunteersRes, donationsRes] = await Promise.all([
        apiService.getProjects(),
        apiService.getEvents(),
        apiService.getBlogs(),
        apiService.getReports(),
        apiService.getVolunteerOpportunities({ includeInactive: true }),
        apiService.getVolunteers(),
        apiService.getDonations(),
      ]);

      const volunteerApplications = Array.isArray(volunteersRes?.data) ? volunteersRes.data : [];
      const donations = Array.isArray(donationsRes?.data) ? donationsRes.data : [];

      setItemsByType({ projects, events, blogs, reports, volunteer, volunteerApplications, donations });
    } catch (error) {
      console.error('Failed to load admin content:', error);
      toast.error('Failed to load dashboard content');
    } finally {
      setLoading(false);
    }
  };

  const normalizePayload = (type, item) => {
    if (type === 'project') {
      return {
        ...item,
        progress: Number(item.progress || 0),
        goal: Number(item.goal || 0),
        raised: Number(item.raised || 0),
        livesImpacted: Number(item.livesImpacted || 0),
        volunteersEngaged: Number(item.volunteersEngaged || 0),
        impact: Object.fromEntries(
          Object.entries(item.impact || {}).filter(([key]) => key).map(([key, value]) => [key, Number(value || 0)])
        ),
      };
    }
    if (type === 'event') return { ...item, capacity: Number(item.capacity || 0), registered: Number(item.registered || 0), price: Number(item.price || 0) };
    if (type === 'blog') return { ...item, readTime: Number(item.readTime || 1) };
    if (type === 'volunteer') return { ...item, spots: Number(item.spots || 1), status: item.status || 'active' };
    if (type === 'report') return { ...item, pages: Number(item.pages || 0), downloads: Number(item.downloads || 0), views: Number(item.views || 0), featured: Boolean(item.featured), status: item.status || 'published' };
    return item;
  };

  const handleAdd = () => { setSelectedItem(null); setShowPopup(true); };
  const handleEdit = (item) => { setSelectedItem(item); setShowPopup(true); };

  const handleDelete = async (item) => {
    const label = popupType === 'volunteer' ? 'volunteer opportunity' : popupType;
    if (!window.confirm(`Are you sure you want to delete this ${label}?`)) return;
    try {
      if (activeTab === 'projects') await apiService.deleteProjectAdmin(item.id);
      else if (activeTab === 'events') await apiService.deleteEventAdmin(item.id);
      else if (activeTab === 'blogs') await apiService.deleteBlogAdmin(item.id);
      else if (activeTab === 'reports') await apiService.deleteReportAdmin(item.id);
      else if (activeTab === 'volunteer') await apiService.deleteVolunteerOpportunityAdmin(item.id);

      setItemsByType((prev) => ({ ...prev, [activeTab]: prev[activeTab].filter((entry) => entry.id !== item.id) }));
      toast.success('Deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleAcceptVolunteer = async (volunteer) => {
    try {
      await apiService.updateVolunteerStatus(volunteer._id || volunteer.id, 'approved');
      setItemsByType((prev) => ({
        ...prev,
        volunteerApplications: prev.volunteerApplications.map((v) =>
          (v._id || v.id) === (volunteer._id || volunteer.id) ? { ...v, status: 'approved' } : v
        ),
      }));
      toast.success(`${volunteer.fullName} has been accepted`);
    } catch (error) {
      toast.error('Failed to accept volunteer');
    }
  };

  const handleRejectVolunteer = async (volunteer) => {
    if (!window.confirm(`Reject and remove ${volunteer.fullName}? This cannot be undone.`)) return;
    try {
      await apiService.deleteVolunteer(volunteer._id || volunteer.id);
      setItemsByType((prev) => ({
        ...prev,
        volunteerApplications: prev.volunteerApplications.filter((v) => (v._id || v.id) !== (volunteer._id || volunteer.id)),
      }));
      toast.success(`${volunteer.fullName} has been rejected and removed`);
    } catch (error) {
      toast.error('Failed to reject volunteer');
    }
  };

  const handleAcceptDonation = async (donation) => {
    try {
      await apiService.updateDonationStatus(donation._id || donation.id, 'accepted');
      setItemsByType((prev) => ({
        ...prev,
        donations: prev.donations.map((d) =>
          (d._id || d.id) === (donation._id || donation.id) ? { ...d, paymentStatus: 'accepted' } : d
        ),
      }));
      toast.success(`Donation from ${donation.name} accepted`);
    } catch (error) {
      toast.error('Failed to accept donation');
    }
  };

  const handleRejectDonation = async (donation) => {
    if (!window.confirm(`Reject donation from ${donation.name}?`)) return;
    try {
      await apiService.updateDonationStatus(donation._id || donation.id, 'rejected');
      setItemsByType((prev) => ({
        ...prev,
        donations: prev.donations.map((d) =>
          (d._id || d.id) === (donation._id || donation.id) ? { ...d, paymentStatus: 'rejected' } : d
        ),
      }));
      toast.success(`Donation from ${donation.name} rejected`);
    } catch (error) {
      toast.error('Failed to reject donation');
    }
  };

  const handleSave = async (newItem) => {
    setSaving(true);
    try {
      const payload = normalizePayload(popupType, newItem);
      let savedItem;
      if (activeTab === 'projects') savedItem = selectedItem ? await apiService.updateProjectAdmin(selectedItem.id, payload) : await apiService.createProjectAdmin(payload);
      else if (activeTab === 'events') savedItem = selectedItem ? await apiService.updateEventAdmin(selectedItem.id, payload) : await apiService.createEventAdmin(payload);
      else if (activeTab === 'blogs') savedItem = selectedItem ? await apiService.updateBlogAdmin(selectedItem.id, payload) : await apiService.createBlogAdmin(payload);
      else if (activeTab === 'reports') savedItem = selectedItem ? await apiService.updateReportAdmin(selectedItem.id, payload) : await apiService.createReportAdmin(payload);
      else if (activeTab === 'volunteer') savedItem = selectedItem ? await apiService.updateVolunteerOpportunityAdmin(selectedItem.id, payload) : await apiService.createVolunteerOpportunityAdmin(payload);

      setItemsByType((prev) => ({
        ...prev,
        [activeTab]: selectedItem
          ? prev[activeTab].map((entry) => (entry.id === savedItem.id ? savedItem : entry))
          : [savedItem, ...prev[activeTab]],
      }));
    } finally {
      setSaving(false);
    }
  };

  const exportToExcel = (data, filename, columns, headers) => {
    if (data.length === 0) { toast.info('Nothing to export'); return; }
    const rows = data.map((item) =>
      columns.reduce((acc, col, i) => {
        acc[headers[i]] = Array.isArray(item[col]) ? item[col].join(', ') : (item[col] ?? '');
        return acc;
      }, {})
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
    toast.success('Exported to Excel');
  };

  const handleExport = () => {
    if (activeTab === 'volunteerApplications') {
      const approved = items.filter((v) => v.status === 'approved');
      if (approved.length === 0) { toast.info('No accepted volunteers to export'); return; }
      exportToExcel(approved, 'volunteer_applications', ['fullName', 'email', 'phone', 'city', 'state', 'occupation', 'skills', 'interests', 'hoursPerWeek', 'status', 'createdAt'], ['Full Name', 'Email', 'Phone', 'City', 'State', 'Occupation', 'Skills', 'Interests', 'Hours/Week', 'Status', 'Applied Date']);
      return;
    }
    if (activeTab === 'donations') {
      exportToExcel(filteredItems, 'donations', ['name', 'email', 'phone', 'amount', 'type', 'project', 'transactionId', 'paymentStatus', 'pan', 'city', 'state', 'createdAt'], ['Donor Name', 'Email', 'Phone', 'Amount (₹)', 'Type', 'Project', 'Transaction ID', 'Status', 'PAN', 'City', 'State', 'Date']);
      return;
    }
    if (items.length === 0) { toast.info('Nothing to export'); return; }
    const columns = tableColumns[activeTab];
    const csvRows = [columns.join(','), ...items.map((item) => columns.map((column) => `"${String(item[column] ?? '').replace(/"/g, '""')}"`).join(','))];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  const renderCell = (column, value) => {
    if (column === 'date' || column === 'createdAt' || column === 'publishedDate') {
      return value ? new Date(value).toLocaleDateString('en-IN') : '-';
    }
    if (column === 'goal' || column === 'raised' || column === 'price') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
    }
    if (column === 'amount') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
    }
    if (column === 'progress') return `${value || 0}%`;
    if (Array.isArray(value)) return value.join(', ') || '-';
    if (column === 'status') {
      const colors = { pending: 'bg-yellow-100 text-yellow-800', approved: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', completed: 'bg-blue-100 text-blue-800', active: 'bg-green-100 text-green-800', inactive: 'bg-gray-100 text-gray-800', published: 'bg-blue-100 text-blue-800', draft: 'bg-gray-100 text-gray-800', verified: 'bg-green-100 text-green-800' };
      return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-700'}`}>{value || '-'}</span>;
    }
    if (column === 'paymentStatus') {
      const colors = { pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800', completed: 'bg-blue-100 text-blue-800', failed: 'bg-red-100 text-red-800' };
      return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100 text-gray-700'}`}>{value || '-'}</span>;
    }
    if (column === 'transactionId') {
      return value ? <span className="font-mono text-xs text-gray-700">{value}</span> : <span className="text-gray-400">-</span>;
    }
    return value || '-';
  };

  const isSpecialTab = activeTab === 'volunteerApplications' || activeTab === 'donations' || activeTab === 'donationSettings';

  // ---- Donation Settings Panel ----
  if (activeTab === 'donationSettings') {
    return (
      <div className="pt-20 pb-16 min-h-screen bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage donation QR code and bank details shown on the public donation page.</p>
            </div>
          </div>

          {/* Tab cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => { setActiveTab(type.id); setSearchTerm(''); setVolunteerFilter('all'); setDonationStatusFilter('all'); }}
                className={`p-4 rounded-lg shadow text-left transition-colors ${activeTab === type.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:shadow-md'}`}
              >
                <type.icon className="w-6 h-6 mb-3" />
                <div className="text-sm font-semibold">{type.label}</div>
                <div className={`text-xs mt-1 ${activeTab === type.id ? 'text-primary-100' : 'text-gray-500'}`}>
                  {type.id === 'donationSettings' ? 'Configure' : (itemsByType[type.id]?.length || 0) + ' items'}
                </div>
              </button>
            ))}
          </div>

          {settingsLoading ? (
            <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* QR Code Upload */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><FiImage /> Donation QR Code</h2>
                <p className="text-sm text-gray-500 mb-5">Upload the QR code image that donators will scan to pay. This will appear on the public donation page.</p>

                <div
                  onClick={() => qrFileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors mb-4"
                >
                  {qrImage ? (
                    <div className="relative inline-block">
                      <img src={qrImage} alt="QR Preview" className="max-h-48 mx-auto rounded border border-gray-200" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setQrImage(''); if (qrFileRef.current) qrFileRef.current.value = ''; }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <FiUpload size={32} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">Click to upload QR image</p>
                      <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input ref={qrFileRef} type="file" accept="image/*" onChange={handleQrFileChange} className="hidden" />
              </div>

              {/* Bank Details */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><FiDollarSign /> Bank Account Details</h2>
                <p className="text-sm text-gray-500 mb-5">These details are shown on the donation page for direct bank transfers.</p>

                <div className="space-y-4">
                  {[
                    { key: 'accountHolder', label: 'Account Holder' },
                    { key: 'bank', label: 'Bank Name' },
                    { key: 'branch', label: 'Branch' },
                    { key: 'accountNo', label: 'Account Number' },
                    { key: 'ifscCode', label: 'IFSC Code' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                      <input
                        type="text"
                        value={bankDetails[key] || ''}
                        onChange={(e) => setBankDetails((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="lg:col-span-2">
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsSaving}
                  className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {settingsSaving ? 'Saving...' : 'Save Donation Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- Main Dashboard ----
  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Create, edit, and delete the content shown on your public pages.</p>
          </div>
          <div className="flex gap-3">
            {activeTab !== 'donationSettings' && (
              <button onClick={handleExport} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                <FiDownload className="mr-2" />
                {activeTab === 'volunteerApplications' ? 'Export Accepted (Excel)' : activeTab === 'donations' ? 'Export (Excel)' : 'Export'}
              </button>
            )}
            {!isSpecialTab && (
              <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center">
                <FiPlus className="mr-2" />
                Add New
              </button>
            )}
          </div>
        </div>

        {/* Tab cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => { setActiveTab(type.id); setSearchTerm(''); setVolunteerFilter('all'); setDonationStatusFilter('all'); }}
              className={`p-4 rounded-lg shadow text-left transition-colors ${activeTab === type.id ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:shadow-md'}`}
            >
              <type.icon className="w-6 h-6 mb-3" />
              <div className="text-sm font-semibold">{type.label}</div>
              <div className={`text-xs mt-1 ${activeTab === type.id ? 'text-primary-100' : 'text-gray-500'}`}>
                {type.id === 'donationSettings' ? 'Configure' : (itemsByType[type.id]?.length || 0) + ' items'}
              </div>
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
              />
            </div>
            {activeTab === 'volunteerApplications' && (
              <select value={volunteerFilter} onChange={(e) => setVolunteerFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            )}
            {activeTab === 'donations' && (
              <select value={donationStatusFilter} onChange={(e) => setDonationStatusFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            )}
          </div>
        </div>

        {/* Stats */}
        {activeTab === 'volunteerApplications' && !loading && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Applications', value: items.length, color: 'bg-blue-50 text-blue-700' },
              { label: 'Pending', value: items.filter((v) => v.status === 'pending').length, color: 'bg-yellow-50 text-yellow-700' },
              { label: 'Approved', value: items.filter((v) => v.status === 'approved').length, color: 'bg-green-50 text-green-700' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-lg p-4 ${stat.color}`}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'donations' && !loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total', value: items.length, color: 'bg-blue-50 text-blue-700' },
              { label: 'Pending', value: items.filter((d) => d.paymentStatus === 'pending').length, color: 'bg-yellow-50 text-yellow-700' },
              { label: 'Accepted', value: items.filter((d) => d.paymentStatus === 'accepted').length, color: 'bg-green-50 text-green-700' },
              {
                label: 'Total Amount',
                value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(items.filter((d) => d.paymentStatus === 'accepted').reduce((s, d) => s + Number(d.amount || 0), 0)),
                color: 'bg-purple-50 text-purple-700',
              },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-lg p-4 ${stat.color}`}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No {activeTab} yet</h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'volunteerApplications' ? 'No volunteer applications found.' : activeTab === 'donations' ? 'No donations recorded yet.' : 'Create your first item.'}
              </p>
              {!isSpecialTab && (
                <button onClick={handleAdd} className="btn-primary"><FiPlus className="inline mr-2" />Add New</button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {tableColumns[activeTab].map((column) => (
                      <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column === 'createdAt' ? 'Date' : column.replace(/([A-Z])/g, ' $1').trim()}
                      </th>
                    ))}
                    {activeTab === 'donations' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screenshot</th>
                    )}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item, idx) => (
                    <tr key={item._id || item.id || idx} className="hover:bg-gray-50">
                      {tableColumns[activeTab].map((column) => (
                        <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {renderCell(column, item[column])}
                        </td>
                      ))}
                      {activeTab === 'donations' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.paymentScreenshot ? (
                            <button
                              type="button"
                              onClick={() => setScreenshotModal(item.paymentScreenshot)}
                              className="flex items-center gap-1 text-primary-600 hover:text-primary-800 text-xs font-medium"
                              title="View screenshot"
                            >
                              <FiEye size={14} />
                              View
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs">None</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {activeTab === 'volunteerApplications' ? (
                          <div className="flex items-center justify-end space-x-2">
                            {item.status !== 'approved' && (
                              <button onClick={() => handleAcceptVolunteer(item)} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs font-medium">
                                <FiCheck size={14} /> Accept
                              </button>
                            )}
                            <button onClick={() => handleRejectVolunteer(item)} className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-medium">
                              <FiX size={14} /> Reject
                            </button>
                          </div>
                        ) : activeTab === 'donations' ? (
                          <div className="flex items-center justify-end space-x-2">
                            {item.paymentStatus === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleAcceptDonation(item)}
                                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs font-medium"
                                  title="Accept donation"
                                >
                                  <FiCheck size={14} /> Accept
                                </button>
                                <button
                                  onClick={() => handleRejectDonation(item)}
                                  className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-medium"
                                  title="Reject donation"
                                >
                                  <FiX size={14} /> Reject
                                </button>
                              </>
                            )}
                            {item.paymentStatus === 'accepted' && (
                              <span className="text-green-600 text-xs font-medium flex items-center gap-1"><FiCheck size={12} /> Accepted</span>
                            )}
                            {item.paymentStatus === 'rejected' && (
                              <span className="text-red-500 text-xs font-medium flex items-center gap-1"><FiX size={12} /> Rejected</span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-end space-x-3">
                            <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900" title="Edit"><FiEdit2 size={16} /></button>
                            <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900" title="Delete"><FiTrash2 size={16} /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showPopup && !isSpecialTab && (
          <ContentPopup
            type={popupType}
            item={selectedItem}
            onClose={() => { if (!saving) { setShowPopup(false); setSelectedItem(null); } }}
            onSave={handleSave}
          />
        )}

        {/* Screenshot Modal */}
        {screenshotModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={() => setScreenshotModal(null)}
          >
            <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setScreenshotModal(null)}
                className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100 shadow-lg z-10"
              >
                <FiX size={18} />
              </button>
              <img src={screenshotModal} alt="Payment Screenshot" className="w-full max-h-[80vh] object-contain rounded-lg shadow-xl" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
