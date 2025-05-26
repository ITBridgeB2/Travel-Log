import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet marker icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [rating, setRating] = useState(3);
  const [position, setPosition] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:5000/destinations/${id}`)

      .then(res => {
        const dest = res.data;

        setDestination(dest);
        setRating(dest.rating || 3);

        if (dest.country) {
          axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
              q: dest.country,
              format: 'json',
              limit: 1,
              addressdetails: 1,
            },
            headers: { 'Accept-Language': 'en' },
          })
          .then(mapRes => {
            if (mapRes.data.length > 0) {
              const { lat, lon, display_name } = mapRes.data[0];
              setPosition([parseFloat(lat), parseFloat(lon)]);
              setDisplayName(display_name);
            } else {
              setMapError('No map location found');
            }
          })
          .catch(() => setMapError('Map error'));
        }
      })
      .catch(err => {
        console.error('Failed to fetch destination:', err);
        setDestination(null);
      });
  }, [id]);

  const handleRatingChange = async (newRating) => {
    setRating(newRating);
    try {
      await axios.patch(`http://localhost:5000/destinations/${id}`, { rating: newRating });

    } catch (err) {
      console.error('Failed to update rating:', err);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      axios.delete(`http://localhost:5000/destinations/${id}`)

        .then(() => {
          alert('Destination deleted successfully!');
          navigate('/');
        })
        .catch(err => console.error('Delete failed:', err));
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  if (!destination) return <div className="text-center py-10">Destination deleted or not found.</div>;

  return (
    <div className="bg-gray-100 min-h-screen overflow-auto">
      <div className="flex justify-center py-10 px-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-2xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">{destination.name}</h2>

          <div className="text-gray-700 space-y-2">
            <p><span className="font-semibold">Country:</span> {destination.country}</p>
            <p><span className="font-semibold">Visit Date:</span>{' '}{new Date(destination.visit_date).toLocaleDateString()}</p>
            <p><span className="font-semibold">Notes:</span> {destination.notes}</p>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={rating}
              onChange={(e) => handleRatingChange(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="text-center text-sm text-gray-500 my-2 space-x-4">
              {['★', '★★', '★★★', '★★★★', '★★★★★'].map((stars, i) => (
                <span key={i} className={i + 1 === rating ? 'text-yellow-500 font-bold' : ''}>
                  {stars}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Location</h3>
            {mapError && <p className="text-red-600">{mapError}</p>}
            {!position && !mapError && <p>Loading map...</p>}
            {position && (
              <div style={{ height: '300px', width: '100%' }}>
                <MapContainer
                  center={position}
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                  dragging={false}
                  doubleClickZoom={false}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={position}>
                    <Popup>{displayName}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>

          {/* Edit and Delete Buttons */}
          <div className="flex justify-start mt-6 space-x-4">
            <button
              className="text-green-600 hover:text-green-800 font-medium"
              onClick={handleEdit}
            >
              Edit Destination
            </button>
            <button
              className="text-red-600 hover:text-red-800 font-medium"
              onClick={handleDelete}
            >
              Delete Destination
            </button>
          </div>

          {/* Centered Back Button */}
          <div className="mt-8 flex justify-center">
            <button
              className="text-green-600 hover:text-red-800 font-medium"
              onClick={() => navigate('/')}
            >
              Back to Destinations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;