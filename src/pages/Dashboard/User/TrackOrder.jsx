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

    // Fetch order details
    const { data: order, isLoading: orderLoading } = useQuery({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders/${orderId}`);
            return res.data;
        }
    });

    // Fetch tracking logs
    const { data: trackingLogs = [], isLoading: trackingLoading, error } = useQuery({
        queryKey: ['tracking', orderId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/trackings/${orderId}/logs`);
            return res.data;
        }
    });

    // Bangladesh district coordinates mapping
    const districtCoordinates = {
        "Dhaka": { lat: 23.8103, lng: 90.4125 },
        "Chattogram": { lat: 22.3569, lng: 91.7832 },
        "Chittagong": { lat: 22.3569, lng: 91.7832 },
        "Sylhet": { lat: 24.8949, lng: 91.8687 },
        "Rajshahi": { lat: 24.3745, lng: 88.6042 },
        "Khulna": { lat: 22.8456, lng: 89.5403 },
        "Barisal": { lat: 22.7010, lng: 90.3535 },
        "Barishal": { lat: 22.7010, lng: 90.3535 },
        "Rangpur": { lat: 25.7439, lng: 89.2752 },
        "Mymensingh": { lat: 24.7471, lng: 90.4203 },
        "Comilla": { lat: 23.4607, lng: 91.1809 },
        "Cumilla": { lat: 23.4607, lng: 91.1809 },
        "Gazipur": { lat: 24.0022, lng: 90.4264 },
        "Narayanganj": { lat: 23.6238, lng: 90.5000 },
        "Jessore": { lat: 23.1697, lng: 89.2132 },
        "Jashore": { lat: 23.1697, lng: 89.2132 },
        "Bogra": { lat: 24.8465, lng: 89.3770 },
        "Bogura": { lat: 24.8465, lng: 89.3770 },
        "Pabna": { lat: 24.0064, lng: 89.2372 },
        "Tangail": { lat: 24.2513, lng: 89.9167 },
        "Jamalpur": { lat: 24.9375, lng: 89.9403 },
        "Dinajpur": { lat: 25.6217, lng: 88.6354 },
        "Sirajganj": { lat: 24.4533, lng: 89.7006 },
        "Sirajgonj": { lat: 24.4533, lng: 89.7006 },
        "Cox's Bazar": { lat: 21.4272, lng: 92.0058 },
        "Coxs Bazar": { lat: 21.4272, lng: 92.0058 },
        "Kushtia": { lat: 23.9012, lng: 89.1200 },
        "Faridpur": { lat: 23.6070, lng: 89.8429 },
        "Noakhali": { lat: 22.8696, lng: 91.0995 },
        "Feni": { lat: 23.0159, lng: 91.3976 },
        "Brahmanbaria": { lat: 23.9608, lng: 91.1115 },
        "Manikganj": { lat: 23.8644, lng: 90.0047 },
        "Munshiganj": { lat: 23.5422, lng: 90.5305 },
        "Madaripur": { lat: 23.1742, lng: 90.1897 },
        "Gopalganj": { lat: 23.0050, lng: 89.8266 },
        "Shariatpur": { lat: 23.2423, lng: 90.4348 },
        "Narsingdi": { lat: 23.9322, lng: 90.7151 },
        "Kishoreganj": { lat: 24.4260, lng: 90.7765 },
        "Netrokona": { lat: 24.8104, lng: 90.7277 },
        "Rangamati": { lat: 22.6533, lng: 92.1751 },
        "Bandarban": { lat: 22.1953, lng: 92.2183 },
        "Khagrachari": { lat: 23.1193, lng: 91.9847 },
        "Lakshmipur": { lat: 22.9447, lng: 90.8411 },
        "Chandpur": { lat: 23.2332, lng: 90.6712 },
        "Habiganj": { lat: 24.3745, lng: 91.4157 },
        "Moulvibazar": { lat: 24.4820, lng: 91.7774 },
        "Sunamganj": { lat: 25.0658, lng: 91.3950 },
        "Panchagarh": { lat: 26.3411, lng: 88.5541 },
        "Thakurgaon": { lat: 26.0336, lng: 88.4616 },
        "Nilphamari": { lat: 25.9317, lng: 88.8560 },
        "Lalmonirhat": { lat: 25.9923, lng: 89.4467 },
        "Kurigram": { lat: 25.8072, lng: 89.6295 },
        "Gaibandha": { lat: 25.3297, lng: 89.5430 },
        "Natore": { lat: 24.4206, lng: 89.0000 },
        "Naogaon": { lat: 24.8132, lng: 88.9418 },
        "Joypurhat": { lat: 25.0968, lng: 89.0227 },
        "Chapainawabganj": { lat: 24.5965, lng: 88.2775 },
        "Rajbari": { lat: 23.7574, lng: 89.6444 },
        "Magura": { lat: 23.4855, lng: 89.4198 },
        "Jhenaidah": { lat: 23.5450, lng: 89.1539 },
        "Narail": { lat: 23.1163, lng: 89.5840 },
        "Satkhira": { lat: 22.7185, lng: 89.0705 },
        "Meherpur": { lat: 23.7622, lng: 88.6318 },
        "Chuadanga": { lat: 23.6401, lng: 88.8412 },
        "Pirojpur": { lat: 22.5791, lng: 89.9759 },
        "Jhalokati": { lat: 22.6406, lng: 90.1987 },
        "Patuakhali": { lat: 22.3596, lng: 90.3298 },
        "Bhola": { lat: 22.6859, lng: 90.6482 },
        "Barguna": { lat: 22.1595, lng: 90.1121 },
        "Sherpur": { lat: 25.0204, lng: 90.0152 }
    };

    // Get coordinates based on order's delivery district
    const getDistrictCoordinates = () => {
        if (!order?.deliveryDistrict) {
            return { lat: 23.8103, lng: 90.4125 }; // Default to Dhaka
        }
        return districtCoordinates[order.deliveryDistrict] || { lat: 23.8103, lng: 90.4125 };
    };

    // Transform tracking logs to timeline format
    const tracking = trackingLogs.map(log => {
        // Format the status into a readable label
        const statusLabel = log.status 
            ? log.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            : 'Status Update';
        
        // Determine status type for icon/color
        let statusType = 'completed';
        if (log.status === 'shipped_out_for_delivery' || log.status === 'packed') {
            statusType = 'in_progress';
        }

        // Get coordinates for this tracking log's location
        const logLocation = log.location || order?.deliveryDistrict || "Factory Location";
        const logCoordinates = districtCoordinates[logLocation] || getDistrictCoordinates();

        return {
            step: statusLabel,
            date: new Date(log.timestamp || log.createdAt).toLocaleString(),
            location: logLocation,
            coordinates: logCoordinates,
            notes: log.note || log.notes || null,
            status: statusType
        };
    });

    // Get current location from latest tracking log or order's delivery district
    const currentLocation = tracking.length > 0 
        ? tracking[tracking.length - 1].coordinates 
        : getDistrictCoordinates();

    const getStepIcon = (status) => {
        if (status === 'completed') {
            return <FaCheckCircle className="text-success text-xl" />;
        } else if (status === 'in_progress') {
            return <FaTruck className="text-info text-xl" />;
        } else {
            return <FaClock className="text-base-content/40 text-xl" />;
        }
    };

    const getStepColor = (status) => {
        if (status === 'completed') return 'border-success bg-success/10';
        if (status === 'in_progress') return 'border-info bg-info/10';
        return 'border-base-content/30 bg-base-200';
    };

    if (orderLoading || trackingLoading) return <Loading />;
    if (error) return <div className="text-center py-8 text-error">Error loading tracking information</div>;

    return (
        <div className="bg-base-100 min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Track Order #{orderId}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Timeline Section */}
                    <div className="space-y-4 bg-base-200 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-base-content">Production Timeline</h2>
                        {tracking.length === 0 ? (
                            <div className="text-center py-8 text-base-content/70">
                                No tracking information available yet.
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-base-content/30"></div>
                                <div className="space-y-6">
                                    {tracking.map((item, index) => (
                                        <div key={index} className="relative flex items-start space-x-4">
                                            {/* Timeline dot */}
                                            <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${item.status === 'completed' ? 'bg-success border-success' : item.status === 'in_progress' ? 'bg-info border-info' : 'bg-base-content/30 border-base-content/30'}`}>
                                                {getStepIcon(item.status)}
                                            </div>
                                            {/* Content */}
                                            <div className={`flex-1 p-4 rounded-lg border-2 ${getStepColor(item.status)}`}>
                                                <h3 className="font-semibold text-lg text-base-content">{item.step}</h3>
                                                <p className="text-sm text-base-content/70">{item.date}</p>
                                                <p className="text-sm text-base-content/80 mt-1">
                                                    <FaMapMarkerAlt className="inline mr-1" />
                                                    {item.location}
                                                </p>
                                                {item.notes && (
                                                    <p className="text-sm text-base-content/70 mt-2 italic">
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
                    <div className="space-y-4 bg-base-200 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-base-content">Current Location</h2>
                        <div className="border border-base-content/20 rounded-lg overflow-hidden h-96">
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
                                        <strong>{tracking.length > 0 ? 'Current Location' : 'Delivery Location'}</strong><br />
                                        {tracking.length > 0 ? tracking[tracking.length - 1].location : (order?.deliveryDistrict || "Factory Location")}<br />
                                        {tracking.length > 0 && tracking[tracking.length - 1].notes && (
                                            <span className="text-xs italic">{tracking[tracking.length - 1].notes}</span>
                                        )}
                                        {tracking.length === 0 && order?.deliveryAddress && (
                                            <span className="text-xs">{order.deliveryAddress}</span>
                                        )}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                        <div className="text-sm text-base-content/70 space-y-1">
                            <p><strong className="text-base-content">Product:</strong> {order?.productName || order?.productTitle || 'N/A'}</p>
                            <p><strong className="text-base-content">Order ID:</strong> {orderId?.slice(-8)}</p>
                            <p><strong className="text-base-content">Quantity:</strong> {order?.orderQuantity || 0} pieces</p>
                            <p><strong className="text-base-content">Delivery District:</strong> {order?.deliveryDistrict || 'N/A'}</p>
                            <p><strong className="text-base-content">Last Update:</strong> {tracking.length > 0 ? tracking[tracking.length - 1].date : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;