import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { useNavigate } from 'react-router-dom';

function AddDestination({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: '',
    country: '',
    visit_date: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const escHandler = (e) => e.key === 'Escape' && isOpen && onClose();
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    setErrors(validate(updated));
  };

  const validate = (data) => {
    const err = {};
    if (!data.name.trim()) err.name = 'Name is required';
    if (!data.country.trim()) err.country = 'Country is required';
    if (!data.visit_date) err.visit_date = 'Visit date is required';
    else if (new Date(data.visit_date) > new Date()) err.visit_date = 'Date cannot be in the future';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    try {
      await axios.post('http://localhost:5000/destinations', form);
      toast.success('Destination added!');
      setForm({ name: '', country: '', visit_date: '', notes: '' });
      onClose();
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch {
      toast.error('Failed to add destination');
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <FocusTrap>
              <motion.div
                className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeIn' }}
              >
                <h2 className="text-xl font-semibold text-teal-600 mb-4">Add Destination</h2>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="name"
                      aria-label="Destination Name"
                      placeholder="Name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                  </div>

                  <div className="mb-4">
                    <input
                      type="text"
                      name="country"
                      aria-label="Country"
                      placeholder="Country"
                      value={form.country}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.country && <p className="text-red-600 text-sm">{errors.country}</p>}
                  </div>

                  <div className="mb-4">
                    <input
                      type="date"
                      name="visit_date"
                      aria-label="Visit Date"
                      value={form.visit_date}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${
                        errors.visit_date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.visit_date && <p className="text-red-600 text-sm">{errors.visit_date}</p>}
                  </div>

                  <div className="mb-4">
                    <textarea
                      name="notes"
                      aria-label="Notes"
                      placeholder="Notes"
                      value={form.notes}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded resize-none"
                      rows="3"
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      type="submit"
                      className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </FocusTrap>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AddDestination;
