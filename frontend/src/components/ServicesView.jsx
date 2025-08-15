import { useState, useEffect } from 'react';
import { Edit, Bell, Loader2, Plus } from 'lucide-react';
import { fetchServices, createService, updateService } from '../api/api';

export default function ServicesView({ services, setServices }) {
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  
  // Add Service Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    customerName: '',
    customerPhone: '',
    mobile: '',
    issue: '',
    status: 'In Progress',
    receivedDate: new Date().toISOString().slice(0, 10),
  });
  const [isSaving, setIsSaving] = useState(false);

  // Edit Service Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load services on mount if not already loaded
  useEffect(() => {
    if (!services || services.length === 0) {
      fetchServices()
        .then(res => setServices(res.data))
        .catch(() => setServices([]));
    }
  }, [setServices, services]);

  // Add Service form handlers
  const handleAddServiceClick = () => {
    setShowAddModal(true);
    setNewService({
      customerName: '',
      customerPhone: '',
      mobile: '',
      issue: '',
      status: 'In Progress',
      receivedDate: new Date().toISOString().slice(0, 10),
    });
  };
  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };
  const handleAddService = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const resp = await createService(newService);
      setServices(prev => [resp.data, ...prev]);
      setShowAddModal(false);
      setNotification({ show: true, message: 'Service added successfully!', type: 'success' });
    } catch {
      setNotification({ show: true, message: 'Error saving service!', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 2500);
    }
  };

  // Edit Service
  const handleEditClick = (service) => {
    setServiceToEdit({ ...service });
    setShowEditModal(true);
  };
  const handleEditServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceToEdit(prev => ({ ...prev, [name]: value }));
  };
  const handleEditService = async (e) => {
    e.preventDefault();
    setIsEditing(true);
    try {
      const resp = await updateService(serviceToEdit._id, serviceToEdit);
      setServices(prev => prev.map(s => (s._id === resp.data._id ? resp.data : s)));
      setShowEditModal(false);
      setNotification({ show: true, message: 'Service updated!', type: 'success' });
    } catch {
      setNotification({ show: true, message: 'Error updating service!', type: 'error' });
    } finally {
      setIsEditing(false);
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Service Management</h2>
        <button
          onClick={handleAddServiceClick}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          <Plus size={18} className="mr-2" /> Add Service
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Service ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Mobile & Issue</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Received</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr
                key={service._id || service.id}
                className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{service._id || service.id}</td>
                <td className="px-6 py-4">{service.customerName}</td>
                <td className="px-6 py-4">{service.customerPhone}</td>
                <td className="px-6 py-4">
                  <span className="font-semibold">{service.mobile}</span>
                  <div className="text-xs text-gray-500">{service.issue}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      service.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : service.status === 'Completed'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {service.status}
                  </span>
                </td>
                <td className="px-6 py-4">{service.receivedDate}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleEditClick(service)}
                    className="text-gray-500 hover:text-blue-500 p-1"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  {/* Add more action buttons here if desired */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add Service Request</h3>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={newService.customerName}
                  onChange={handleNewServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Phone</label>
                <input
                  type="text"
                  name="customerPhone"
                  value={newService.customerPhone}
                  onChange={handleNewServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Model</label>
                <input
                  type="text"
                  name="mobile"
                  value={newService.mobile}
                  onChange={handleNewServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issue Description</label>
                <input
                  type="text"
                  name="issue"
                  value={newService.issue}
                  onChange={handleNewServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Received Date</label>
                <input
                  type="date"
                  name="receivedDate"
                  value={newService.receivedDate}
                  onChange={handleNewServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition flex items-center"
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="animate-spin mr-2" size={18} />} Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && serviceToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Edit Service</h3>
            <form onSubmit={handleEditService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={serviceToEdit.customerName}
                  onChange={handleEditServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Phone</label>
                <input
                  type="text"
                  name="customerPhone"
                  value={serviceToEdit.customerPhone}
                  onChange={handleEditServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Model</label>
                <input
                  type="text"
                  name="mobile"
                  value={serviceToEdit.mobile}
                  onChange={handleEditServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issue Description</label>
                <input
                  type="text"
                  name="issue"
                  value={serviceToEdit.issue}
                  onChange={handleEditServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  name="status"
                  value={serviceToEdit.status}
                  onChange={handleEditServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                >
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Notified</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Received Date</label>
                <input
                  type="date"
                  name="receivedDate"
                  value={serviceToEdit.receivedDate}
                  onChange={handleEditServiceChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition flex items-center"
                  disabled={isEditing}
                >
                  {isEditing && <Loader2 className="animate-spin mr-2" size={18} />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification/Toast */}
      {notification.show && (
        <div className={`fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg flex items-center ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <Bell size={20} className="mr-3" />
          {notification.message}
        </div>
      )}
    </div>
  );
}