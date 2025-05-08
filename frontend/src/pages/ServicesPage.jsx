import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

function ServicesPage() {
    const [services, setServices] = useState([]);
    const [bookingError, setBookingError] = useState('');
    const { token, user } = useContext(AuthContext);
    const [bookingLoading, setBookingLoading] = useState(null);


    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/services/services/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setServices(response.data);
            } catch (error) {
                console.error('Failed to fetch services:', error.response?.data);
                setServices([]);
            }
        };
        if (token) fetchServices();
    }, [token]);

    const handleBookService = async (serviceId) => {
        setBookingLoading(serviceId);
        try {
            await axios.post(
                'http://localhost:8000/api/v1/bookings/create/',
                { service: serviceId, date: new Date().toISOString().split('T')[0] }, // use YYYY-MM-DD
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Booking created!');
            setBookingError('');
        } catch (error) {
            console.error('Booking failed:', error.response?.data);
            setBookingError('Failed to create booking: ' + (error.response?.data?.detail || 'Unknown error'));
        } finally {
            setBookingLoading(null);
        }
    };



    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Available Services</h2>
            {bookingError && <p className="text-red-500 mb-4 text-center">{bookingError}</p>}
            {services.length === 0 ? (
                <p>No services found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                        <div key={service.id} className="border p-6 rounded-lg shadow-md hover:shadow-xl transition bg-white">
                            <h3 className="text-xl font-semibold text-blue-600">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                            <p className="text-green-600 font-bold">${service.price}</p>
                            <p className="text-gray-500">Category: {service.category.name}</p>
                            <p className="text-gray-500">Location: {service.worker_location}</p>
                            {user && user.email && (
                                <button
                                    onClick={() => handleBookService(service.id)}
                                    disabled={bookingLoading === service.id}
                                    className={`mt-2 text-white p-2 rounded-lg transition ${bookingLoading === service.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {bookingLoading === service.id ? 'Booking...' : 'Book Now'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ServicesPage;