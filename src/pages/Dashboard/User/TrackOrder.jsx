import React from 'react';
import { useParams } from 'react-router';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';

const TrackOrder = () => {
    const { orderId } = useParams();
    const axiosSecure = useAxiosSecure();

    // Fetch tracking logs
    const { data: trackingLogs = [], isLoading, error } = useQuery({
        queryKey: ['tracking', orderId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/trackings/${orderId}/logs`);
            return res.data;
        }
    });

    // Mock order data - in real app, fetch from API
    const order = {
        id: orderId,
        productName: "Custom T-Shirt",
        quantity: 50,
        trackingId: `TRK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-ABC123`, // Mock tracking ID
    };

    // Transform tracking logs to timeline format
    const tracking = trackingLogs.map(log => ({
        step: log.details,
        date: new Date(log.createdAt).toLocaleString(),
        location: log.location || "Factory Location",
        coordinates: log.location ? { lat: 23.8103, lng: 90.4125 } : { lat: 23.8103, lng: 90.4125 }, // Mock coordinates
        notes: log.notes || null,
        status: log.status === 'shipped_out_for_delivery' ? 'in_progress' : 'completed'
    }));

    // Get current location from latest tracking
    const currentLocation = tracking.length > 0 ? tracking[tracking.length - 1].coordinates : { lat: 23.8103, lng: 90.4125 };

    const getStepIcon = (status) => {
        if (status === 'completed') {
            return <FaCheckCircle className="text-green-500 text-xl" />;
        } else if (status === 'in_progress') {
            return <FaTruck className="text-blue-500 text-xl" />;
        } else {
            return <FaClock className="text-gray-400 text-xl" />;
        }
    };

    const getStepColor = (status) => {
        if (status === 'completed') return 'border-green-500 bg-green-50';
        if (status === 'in_progress') return 'border-blue-500 bg-blue-50';
        return 'border-gray-300 bg-gray-50';
    };

    if (isLoading) return <Loading />;
    if (error) return <div className="text-center py-8">Error loading tracking information</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Track Order #{orderId}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Timeline Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Production Timeline</h2>
                    {tracking.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No tracking information available yet.
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Vertical line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                            <div className="space-y-6">
                                {tracking.map((item, index) => (
                                    <div key={index} className="relative flex items-start space-x-4">
                                        {/* Timeline dot */}
                                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${item.status === 'completed' ? 'bg-green-500 border-green-500' : item.status === 'in_progress' ? 'bg-blue-500 border-blue-500' : 'bg-gray-300 border-gray-300'}`}>
                                            {getStepIcon(item.status)}
                                        </div>
                                        {/* Content */}
                                        <div className={`flex-1 p-4 rounded-lg ${getStepColor(item.status)}`}>
                                            <h3 className="font-semibold text-lg">{item.step}</h3>
                                            <p className="text-sm text-gray-600">{item.date}</p>
                                            <p className="text-sm text-gray-700 mt-1">
                                                <FaMapMarkerAlt className="inline mr-1" />
                                                {item.location}
                                            </p>
                                            {item.notes && (
                                                <p className="text-sm text-gray-600 mt-2 italic">
                                                    {item.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Map Section */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold mb-4">Current Location</h2>
                    <div className="border rounded-lg overflow-hidden h-96">
                        <MapContainer
                            center={[currentLocation.lat, currentLocation.lng]}
                            zoom={12}
                            scrollWheelZoom={false}
                            className="h-full"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[currentLocation.lat, currentLocation.lng]}>
                                <Popup>
                                    <strong>Current Location</strong><br />
                                    {tracking.length > 0 ? tracking[tracking.length - 1].location : "Factory Location"}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    <div className="text-sm text-gray-600">
                        <p><strong>Product:</strong> {order.productName}</p>
                        <p><strong>Tracking ID:</strong> {order.trackingId}</p>
                        <p><strong>Quantity:</strong> {order.quantity} pieces</p>
                        <p><strong>Last Update:</strong> {tracking.length > 0 ? tracking[tracking.length - 1].date : 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;