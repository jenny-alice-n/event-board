import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard from './EventCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import { isEventActive } from '../../utils/eventUtils';

const categories = ['all', 'cultural', 'technical', 'sports', 'workshop', 'other'];

const Noticeboard = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [category, setCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [category, searchTerm, events]);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/events');
            setEvents(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const filterEvents = () => {
        let result = events;
        if (category !== 'all') {
            result = result.filter(e => e.category === category);
        }
        if (searchTerm) {
            result = result.filter(e =>
                e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.clubName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredEvents(result);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="text-slate-400 animate-pulse">Loading Noticeboard...</p>
            </div>
        );
    }

    const activeEvents = filteredEvents.filter(isEventActive);
    const pastEvents = filteredEvents.filter(e => !isEventActive(e)).reverse().slice(0, 10);

    return (
        <div className="space-y-8 pb-20">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-24 z-40 py-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search events or clubs..."
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-6 py-2 rounded-full border transition-all whitespace-nowrap ${category === cat
                                    ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/30'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
                <AnimatePresence mode='popLayout'>
                    {activeEvents.map((event, index) => (
                        <EventCard key={event._id} event={event} index={index} />
                    ))}
                </AnimatePresence>
            </motion.div>

            {pastEvents.length > 0 && (
                <div className="mt-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <h2 className="text-2xl font-bold text-slate-400">Past Events</h2>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 opacity-75"
                    >
                        <AnimatePresence mode='popLayout'>
                            {pastEvents.map((event, index) => (
                                <EventCard key={event._id} event={event} index={index} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}

            {filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <p className="text-slate-400 text-lg">No events found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Noticeboard;
