import React, { useState, useEffect } from 'react';
import { 
  FiGrid, FiCalendar, FiFileText, FiUsers, FiHeart,
  FiStar, FiBarChart2, FiSettings, FiPlus, FiEdit2,
  FiTrash2, FiEye, FiSearch, FiFilter, FiDownload
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import ContentPopup from '../../components/admin/ContentPopup';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupType, setPopupType] = useState('project');

  // Content types configuration
  const contentTypes = [
    { id: 'projects', label: 'Projects', icon: FiGrid, color: 'blue', count: 0 },
    { id: 'events', label: 'Events', icon: FiCalendar, color: 'purple', count: 0 },
    { id: 'blogs', label: 'Blog Posts', icon: FiFileText, color: 'green', count: 0 },
    { id: 'volunteer', label: 'Volunteer Opportunities', icon: FiUsers, color: 'orange', count: 0 },
    { id: 'testimonials', label: 'Testimonials', icon: FiStar, color: 'yellow', count: 0 },
    { id: 'team', label: 'Team Members', icon: FiUsers, color: 'indigo', count: 0 },
    { id: 'reports', label: 'Reports', icon: FiBarChart2, color: 'red', count: 0 },
    { id: 'donations', label: 'Donations', icon: FiHeart, color: 'pink', count: 0 }
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm]);

  const loadData = () => {
    setLoading(true);
    
    // Mock data based on active tab
    const mockData = {
      projects: [
        { id: 1, title: 'Education for All', category: 'Education', status: 'ongoing', progress: 75, location: 'Chennai', startDate: '2023-01-15' },
        { id: 2, title: 'Healthcare Initiative', category: 'Healthcare', status: 'ongoing', progress: 60, location: 'Mumbai', startDate: '2023-03-10' },
        { id: 3, title: 'Women Empowerment', category: 'Women Empowerment', status: 'ongoing', progress: 45, location: 'Delhi', startDate: '2023-06-20' },
        { id: 4, title: 'Environment Campaign', category: 'Environment', status: 'ongoing', progress: 80, location: 'Bangalore', startDate: '2023-02-20' },
        { id: 5, title: 'Child Nutrition Program', category: 'Child Welfare', status: 'completed', progress: 100, location: 'Pune', startDate: '2022-08-01' }
      ],
      events: [
        { id: 1, title: 'Annual Fundraising Gala', type: 'Fundraiser', date: '2024-03-15', location: 'Chennai', capacity: 500, registered: 350 },
        { id: 2, title: 'Volunteer Orientation', type: 'Training', date: '2024-02-20', location: 'Online', capacity: 100, registered: 75 },
        { id: 3, title: 'Tree Plantation Drive', type: 'Community', date: '2024-02-25', location: 'Bangalore', capacity: 200, registered: 150 }
      ],
      blogs: [
        { id: 1, title: 'Celebrating 5 Years of Impact', author: 'Rajesh Kumar', date: '2024-01-15', category: 'Announcement' },
        { id: 2, title: 'Meet Our Volunteers', author: 'Priya Sharma', date: '2024-01-10', category: 'Volunteer Stories' },
        { id: 3, title: 'Education Initiative Update', author: 'Anand Patel', date: '2024-01-05', category: 'Impact Report' }
      ],
      volunteer: [
        { id: 1, title: 'Evening Tutor', location: 'Chennai', commitment: '2-3 hours/week', spots: 5, category: 'Education' },
        { id: 2, title: 'Healthcare Camp Assistant', location: 'Rural Areas', commitment: 'Weekends', spots: 3, category: 'Healthcare' },
        { id: 3, title: 'Social Media Volunteer', location: 'Remote', commitment: '5-7 hours/week', spots: 2, category: 'Communications' }
      ],
      testimonials: [
        { id: 1, name: 'Maya Krishnan', role: 'Beneficiary', rating: 5, date: '2024-01-20' },
        { id: 2, name: 'Arun Prasad', role: 'Volunteer', rating: 5, date: '2024-01-18' }
      ],
      team: [
        { id: 1, name: 'Dr. Suresh Kumar', role: 'Founder & Director', department: 'Administration' },
        { id: 2, name: 'Meena Rajan', role: 'Programs Director', department: 'Programs' }
      ],
      reports: [
        { id: 1, title: 'Annual Report 2023', type: 'annual', year: '2023', publishedDate: '2024-01-15' },
        { id: 2, title: 'Q4 Impact Report', type: 'quarterly', year: '2023', publishedDate: '2024-01-10' }
      ],
      donations: [
        { id: 1, donor: 'Rajesh Shah', amount: 10000, project: 'Education', date: '2024-01-20', status: 'completed' },
        { id: 2, donor: 'Priya Singh', amount: 5000, project: 'Healthcare', date: '2024-01-19', status: 'completed' }
      ]
    };

    setItems(mockData[activeTab] || []);
    setFilteredItems(mockData[activeTab] || []);
    setLoading(false);
  };

  const filterItems = () => {
    if (!searchTerm) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => {
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredItems(filtered);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setPopupType(activeTab === 'volunteer' ? 'volunteer' : 
                 activeTab === 'testimonials' ? 'testimonial' :
                 activeTab === 'team' ? 'team' :
                 activeTab === 'reports' ? 'report' :
                 activeTab.slice(0, -1)); // Remove 's' for singular
    setShowPopup(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setPopupType(activeTab === 'volunteer' ? 'volunteer' : 
                 activeTab === 'testimonials' ? 'testimonial' :
                 activeTab === 'team' ? 'team' :
                 activeTab === 'reports' ? 'report' :
                 activeTab.slice(0, -1));
    setShowPopup(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) {
      const updatedItems = items.filter(i => i.id !== item.id);
      setItems(updatedItems);
      toast.success('Deleted successfully');
    }
  };

  const handleSave = (newItem) => {
    if (selectedItem) {
      // Update existing
      const updatedItems = items.map(i => i.id === newItem.id ? newItem : i);
      setItems(updatedItems);
    } else {
      // Add new
      setItems([newItem, ...items]);
    }
  };

  const handleToggleStatus = (item) => {
    const updatedItems = items.map(i => 
      i.id === item.id 
        ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' }
        : i
    );
    setItems(updatedItems);
    toast.success('Status updated');
  };

  const handleExport = () => {
    const csv = [
      Object.keys(items[0] || {}).join(','),
      ...items.map(item => Object.values(item).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-export.csv`;
    a.click();
    toast.success('Exported successfully');
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      ongoing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      upcoming: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const renderTable = () => {
    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FiFileText className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No {activeTab} found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first {activeTab.slice(0, -1)}</p>
          <button
            onClick={handleAdd}
            className="btn-primary"
          >
            <FiPlus className="inline mr-2" />
            Add New {activeTab.slice(0, -1)}
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(filteredItems[0] || {}).map(key => (
                <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {Object.values(item).map((value, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof value === 'object' ? JSON.stringify(value) : value}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
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
    );
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage all your content from one place</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
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

        {/* Content Type Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {contentTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveTab(type.id)}
              className={`p-4 rounded-lg shadow transition-all ${
                activeTab === type.id
                  ? `bg-${type.color}-600 text-white`
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                activeTab === type.id ? 'text-white' : `text-${type.color}-600`
              }`} />
              <span className="text-xs font-medium">{type.label}</span>
            </button>
          ))}
        </div>

        {/* Search and Filter Bar */}
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
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <FiFilter className="mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            renderTable()
          )}
        </div>

        {/* Common Popup */}
        {showPopup && (
          <ContentPopup
            type={popupType}
            item={selectedItem}
            onClose={() => {
              setShowPopup(false);
              setSelectedItem(null);
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;