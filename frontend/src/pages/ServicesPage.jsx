import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

function ServicesPage() {
    const [services, setServices] = useState([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/services/', {
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

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Available Services</h2>
            {services.length === 0 ? (
                <p>No services found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                        <div key={service.id} className="border p-4 rounded shadow">
                            <h3 className="text-xl font-semibold">{service.title}</h3>
                            <p>{service.description}</p>
                            <p className="text-green-600 font-bold">${service.price}</p>
                            <p>Category: {service.category.name}</p>
                            <p>Location: {service.worker_location}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ServicesPage;