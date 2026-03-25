import React, { useEffect, useMemo, useState } from 'react';
import {
  FiGrid, FiCalendar, FiFileText, FiUsers,
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiDownload
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import ContentPopup from '../../components/admin/ContentPopup';
import apiService from '../../services/api';

const contentTypes = [
  { id: 'projects', label: 'Projects', icon: FiGrid, popupType: 'project' },
  { id: 'events', label: 'Events', icon: FiCalendar, popupType: 'event' },
  { id: 'blogs', label: 'Blogs', icon: FiFileText, popupType: 'blog' },
  { id: 'reports', label: 'Reports & Publications', icon: FiFileText, popupType: 'report' },
  { id: 'volunteer', label: 'Volunteer Opportunities', icon: FiUsers, popupType: 'volunteer' },
];

const tableColumns = {
  projects: ['title', 'category', 'status', 'location', 'progress', 'goal', 'raised'],
  events: ['title', 'type', 'date', 'location', 'capacity', 'registered'],
  blogs: ['title', 'category', 'author', 'date', 'readTime'],
  reports: ['title', 'type', 'year', 'publishedDate', 'pages', 'status'],
  volunteer: ['title', 'category', 'location', 'commitment', 'spots', 'status'],
};

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [itemsByType, setItemsByType] = useState({
    projects: [],
    events: [],
    blogs: [],
    reports: [],
    volunteer: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadAllContent();
  }, []);

  const popupType = contentTypes.find((type) => type.id === activeTab)?.popupType || 'project';
  const items = useMemo(() => itemsByType[activeTab] || [], [itemsByType, activeTab]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return items;
    }

    return items.filter((item) =>
      Object.values(item).some((value) => {
        if (value === null || value === undefined) {
          return false;
        }

        return String(
          typeof value === 'object' ? JSON.stringify(value) : value
        ).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [items, searchTerm]);

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const [projects, events, blogs, reports, volunteer] = await Promise.all([
        apiService.getProjects(),
        apiService.getEvents(),
        apiService.getBlogs(),
        apiService.getReports(),
        apiService.getVolunteerOpportunities({ includeInactive: true }),
      ]);

      setItemsByType({ projects, events, blogs, reports, volunteer });
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
          Object.entries(item.impact || {})
            .filter(([key]) => key)
            .map(([key, value]) => [key, Number(value || 0)])
        ),
      };
    }

    if (type === 'event') {
      return {
        ...item,
        capacity: Number(item.capacity || 0),
        registered: Number(item.registered || 0),
        price: Number(item.price || 0),
      };
    }

    if (type === 'blog') {
      return {
        ...item,
        readTime: Number(item.readTime || 1),
      };
    }

    if (type === 'volunteer') {
      return {
        ...item,
        spots: Number(item.spots || 1),
        status: item.status || 'active',
      };
    }

    if (type === 'report') {
      return {
        ...item,
        pages: Number(item.pages || 0),
        downloads: Number(item.downloads || 0),
        views: Number(item.views || 0),
        featured: Boolean(item.featured),
        status: item.status || 'published',
      };
    }

    return item;
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setShowPopup(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowPopup(true);
  };

  const handleDelete = async (item) => {
    const label = popupType === 'volunteer' ? 'volunteer opportunity' : popupType;
    if (!window.confirm(`Are you sure you want to delete this ${label}?`)) {
      return;
    }

    try {
      if (activeTab === 'projects') {
        await apiService.deleteProjectAdmin(item.id);
      } else if (activeTab === 'events') {
        await apiService.deleteEventAdmin(item.id);
      } else if (activeTab === 'blogs') {
        await apiService.deleteBlogAdmin(item.id);
      } else if (activeTab === 'reports') {
        await apiService.deleteReportAdmin(item.id);
      } else if (activeTab === 'volunteer') {
        await apiService.deleteVolunteerOpportunityAdmin(item.id);
      }

      setItemsByType((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((entry) => entry.id !== item.id),
      }));
      toast.success('Deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleSave = async (newItem) => {
    setSaving(true);

    try {
      const payload = normalizePayload(popupType, newItem);
      let savedItem;

      if (activeTab === 'projects') {
        savedItem = selectedItem
          ? await apiService.updateProjectAdmin(selectedItem.id, payload)
          : await apiService.createProjectAdmin(payload);
      } else if (activeTab === 'events') {
        savedItem = selectedItem
          ? await apiService.updateEventAdmin(selectedItem.id, payload)
          : await apiService.createEventAdmin(payload);
      } else if (activeTab === 'blogs') {
        savedItem = selectedItem
          ? await apiService.updateBlogAdmin(selectedItem.id, payload)
          : await apiService.createBlogAdmin(payload);
      } else if (activeTab === 'reports') {
        savedItem = selectedItem
          ? await apiService.updateReportAdmin(selectedItem.id, payload)
          : await apiService.createReportAdmin(payload);
      } else if (activeTab === 'volunteer') {
        savedItem = selectedItem
          ? await apiService.updateVolunteerOpportunityAdmin(selectedItem.id, payload)
          : await apiService.createVolunteerOpportunityAdmin(payload);
      }

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

  const handleExport = () => {
    if (items.length === 0) {
      toast.info('Nothing to export');
      return;
    }

    const columns = tableColumns[activeTab];
    const csvRows = [
      columns.join(','),
      ...items.map((item) =>
        columns
          .map((column) => `"${String(item[column] ?? '').replace(/"/g, '""')}"`)
          .join(',')
      ),
    ];

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
    if (column === 'date') {
      return value ? new Date(value).toLocaleDateString() : '-';
    }

    if (column === 'goal' || column === 'raised' || column === 'price') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(Number(value || 0));
    }

    if (column === 'progress') {
      return `${value || 0}%`;
    }

    return value || '-';
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Create, edit, and delete the content shown on your public pages.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <FiDownload className="mr-2" />
              Export
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
            >
              <FiPlus className="mr-2" />
              Add New
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`p-4 rounded-lg shadow text-left transition-colors ${
                activeTab === type.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              <type.icon className="w-6 h-6 mb-3" />
              <div className="text-sm font-semibold">{type.label}</div>
              <div className={`text-xs mt-1 ${activeTab === type.id ? 'text-primary-100' : 'text-gray-500'}`}>
                {itemsByType[type.id]?.length || 0} items
              </div>
            </button>
          ))}
        </div>

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
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FiFileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No {activeTab} yet</h3>
              <p className="text-gray-500 mb-4">Create your first item and it will appear on the matching public page.</p>
              <button onClick={handleAdd} className="btn-primary">
                <FiPlus className="inline mr-2" />
                Add New
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {tableColumns[activeTab].map((column) => (
                      <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column.replace(/([A-Z])/g, ' $1').trim()}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {tableColumns[activeTab].map((column) => (
                        <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {renderCell(column, item[column])}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showPopup && (
          <ContentPopup
            type={popupType}
            item={selectedItem}
            onClose={() => {
              if (!saving) {
                setShowPopup(false);
                setSelectedItem(null);
              }
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
