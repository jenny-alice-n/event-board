import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Calendar, MapPin, Link as LinkIcon, Type, FileText, Tag, Save } from 'lucide-react';
import axios from 'axios';

const EventModal = ({ isOpen, onClose, event, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        venue: '',
        category: 'technical',
        caption: '',
        registrationLink: ''
    });
    const [poster, setPoster] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (event) {
            setFormData({
                name: event.name,
                date: event.date.split('T')[0],
                time: event.time,
                venue: event.venue,
                category: event.category,
                caption: event.caption,
                registrationLink: event.registrationLink
            });
            setPreview(`http://20.204.38.97:5000/api/events/${event._id}/image`);
        } else {
            setFormData({
                name: '',
                date: '',
                time: '',
                venue: '',
                category: 'technical',
                caption: '',
                registrationLink: ''
            });
            setPreview(null);
        }
    }, [event, isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPoster(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (poster) data.append('poster', poster);

        try {
            if (event) {
                await axios.patch(`http://20.204.38.97:5000/api/events/${event._id}`, data);
            } else {
                await axios.post('http://20.204.38.97:5000/api/events', data);
            }
            onSave();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-4xl max-h-[90vh] glass-card overflow-hidden flex flex-col relative z-50"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">{event ? 'Edit Event' : 'Create New Event'}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Side: Image Upload */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-300">Event Poster</label>
                                    <div
                                        onClick={() => document.getElementById('poster-upload').click()}
                                        className="relative aspect-[4/5] bg-white/5 border-2 border-dashed border-white/20 rounded-2xl overflow-hidden cursor-pointer group hover:border-indigo-500 transition-colors"
                                    >
                                        {preview ? (
                                            <>
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Upload size={32} />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                                <Upload size={48} className="mb-4" />
                                                <p>Click to upload poster</p>
                                                <p className="text-xs mt-2">(JPG, PNG max 5MB)</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        id="poster-upload"
                                        type="file"
                                        hidden
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                </div>

                                {/* Right Side: Fields */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Event Name</label>
                                        <div className="relative">
                                            <Type className="absolute left-3 top-3 text-slate-500" size={18} />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 text-slate-500" size={18} />
                                                <input
                                                    type="date"
                                                    required
                                                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50"
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Time</label>
                                            <input
                                                type="time"
                                                required
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Venue</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50"
                                                value={formData.venue}
                                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Category</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-3 text-slate-500" size={18} />
                                            <select
                                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="technical">Technical</option>
                                                <option value="cultural">Cultural</option>
                                                <option value="sports">Sports</option>
                                                <option value="workshop">Workshop</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Caption (2-3 lines)</label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 text-slate-500" size={18} />
                                            <textarea
                                                rows="3"
                                                required
                                                maxLength="200"
                                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50"
                                                value={formData.caption}
                                                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Registration Link</label>
                                        <div className="relative">
                                            <LinkIcon className="absolute left-3 top-3 text-slate-500" size={18} />
                                            <input
                                                type="url"
                                                required
                                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50"
                                                placeholder="https://forms.gle/..."
                                                value={formData.registrationLink}
                                                onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>{event ? 'Update Event' : 'Create Event'}</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EventModal;
