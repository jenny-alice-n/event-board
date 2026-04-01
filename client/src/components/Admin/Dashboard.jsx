import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Users, Calendar, BarChart3, ShieldCheck } from 'lucide-react';
import EventModal from './EventModal';
import ClubModal from './ClubModal';
import { isEventActive } from '../../utils/eventUtils';

const Dashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isClubModalOpen, setIsClubModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/events');
            if (user?.role === 'root') {
                setEvents(res.data);
            } else {
                setEvents(res.data.filter(e => e.organizer === user?._id));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await axios.delete(`http://localhost:5000/api/events/${id}`);
                fetchEvents();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedEvent(null);
        setIsEventModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Hello, {user?.clubName || 'Admin'}
                    </h1>
                    <p className="text-slate-400 mt-2">Manage your campus board presence</p>
                </div>
                <div className="flex gap-3">
                    {user?.role === 'root' && (
                        <button
                            onClick={() => setIsClubModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                        >
                            <Users size={20} />
                            <span>Manage Clubs</span>
                        </button>
                    )}
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        <span>Create Event</span>
                    </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Events', value: events.filter(isEventActive).length, icon: Calendar, color: 'text-blue-400' },
                    { label: 'Total Scans', value: '1.2k', icon: BarChart3, color: 'text-emerald-400' },
                    { label: 'System Status', value: 'Healthy', icon: ShieldCheck, color: 'text-amber-400' }
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="glass-card p-6 flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Events Table/List */}
            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold">Your Events</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-slate-400 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Event</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.map((event) => (
                                <tr key={event._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={`http://localhost:5000/api/events/${event._id}/image`} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                            <div>
                                                <p className="font-bold">{event.name}</p>
                                                <p className="text-xs text-slate-400">by {event.clubName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEventActive(event) ? (
                                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">Active</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-slate-500/10 text-slate-400 rounded-full text-xs font-medium">Past</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-300">
                                        {new Date(event.date).toLocaleDateString()}<br />{event.time}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs uppercase tracking-wider text-indigo-300">{event.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(event)} className="p-2 hover:bg-white/10 rounded-lg text-slate-300">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(event._id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {events.length === 0 && !loading && (
                    <div className="p-12 text-center text-slate-500">
                        No events found. Start by creating one!
                    </div>
                )}
            </div>

            <EventModal
                isOpen={isEventModalOpen}
                onClose={() => setIsEventModalOpen(false)}
                event={selectedEvent}
                onSave={fetchEvents}
            />

            <ClubModal
                isOpen={isClubModalOpen}
                onClose={() => setIsClubModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
