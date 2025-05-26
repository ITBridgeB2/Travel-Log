// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const EditDeleteForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     country: '',
//     visitDate: '',
//     notes: '',
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) {
//       toast.error('Invalid destination ID.');
//       setLoading(false);
//       return;
//     }

//     axios.get(`http://localhost:5000/api/destinations/${id}`)
//       .then((res) => {
//         const data = res.data.data;

//         const formattedDate = data.visit_date
//           ? new Date(data.visit_date).toISOString().split('T')[0]
//           : '';

//         setFormData({
//           name: data.name || '',
//           country: data.country || '',
//           visitDate: formattedDate,
//           notes: data.notes || '',
//         });

//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error fetching destination:', err);
//         toast.error('Failed to load destination.');
//         setLoading(false);
//       });
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.name || !formData.country || !formData.visitDate) {
//       toast.error('Name, Country, and Visit Date are required.');
//       return;
//     }

//     const payload = {
//       name: formData.name,
//       country: formData.country,
//       visit_date: formData.visitDate,
//       notes: formData.notes,
//     };

//     axios
//       .put(`http://localhost:5000/api/destinations/${id}`, payload)
//       .then(() => {
//         toast.success('Destination updated successfully!');
//         navigate(`/`);
//       })
//       .catch((err) => {
//         console.error('PUT error:', err);
//         toast.error('Failed to update destination.');
//       });
//   };

//   if (loading) {
//     return <div className="text-center mt-10">Loading destination data...</div>;
//   }

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
//       <h2 className="text-2xl font-semibold text-teal-600 mb-6 text-center">Edit Destination</h2>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <input
//           type="text"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           placeholder="Name"
//           className="w-full p-3 border border-gray-300 rounded-lg"
//         />
//         <input
//           type="text"
//           name="country"
//           value={formData.country}
//           onChange={handleChange}
//           placeholder="Country"
//           className="w-full p-3 border border-gray-300 rounded-lg"
//         />
//         <input
//           type="date"
//           name="visitDate"
//           value={formData.visitDate}
//           onChange={handleChange}
//           className="w-full p-3 border border-gray-300 rounded-lg"
//           required
//         />
//         <textarea
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           placeholder="Notes"
//           rows="4"
//           className="w-full p-3 border border-gray-300 rounded-lg"
//         ></textarea>

//         <div className="flex justify-between">
//           <button
//             type="submit"
//             className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg"
//           >
//             Update
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-lg"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditDeleteForm;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditDeleteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    visitDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error('Invalid destination ID.');
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/destinations/${id}`)
      .then((res) => {
        const data = res.data.data;

        const formattedDate = data.visit_date
          ? new Date(data.visit_date).toISOString().split('T')[0]
          : '';

        setFormData({
          name: data.name || '',
          country: data.country || '',
          visitDate: formattedDate,
          notes: data.notes || '',
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching destination:', err);
        toast.error('Failed to load destination.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.country || !formData.visitDate) {
      toast.error('Name, Country, and Visit Date are required.');
      return;
    }

    const payload = {
      name: formData.name,
      country: formData.country,
      visit_date: formData.visitDate,
      notes: formData.notes,
    };

    axios
      .put(`http://localhost:5000/api/destinations/${id}`, payload)
      .then(() => {
        toast.success('Destination updated successfully!');
        // Delay navigation to allow toast to show
        setTimeout(() => {
          navigate(`/`);
        }, 500);
      })
      .catch((err) => {
        console.error('PUT error:', err);
        toast.error('Failed to update destination.');
      });
  };

  if (loading) {
    return <div className="text-center mt-10">Loading destination data...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-semibold text-teal-600 mb-6 text-center">Edit Destination</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="date"
          name="visitDate"
          value={formData.visitDate}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notes"
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg"
        ></textarea>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-black px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDeleteForm;
