import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

const EventCard = ({ event, index }) => {
    // Each card bobs at a slightly different speed/phase
    const floatingDuration = 5 + (index % 3);
    const floatingDelay = index * 0.2;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{
                opacity: 1,
                y: [0, -10, 0],
            }}
            transition={{
                initial: { delay: index * 0.1 },
                y: {
                    duration: floatingDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: floatingDelay
                }
            }}
            whileHover={{
                scale: 1.05,
                y: -15,
                transition: { duration: 0.3 }
            }}
            onClick={() => window.open(event.registrationLink, '_blank')}
            className="group glass-card overflow-hidden cursor-pointer relative"
        >
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/10 transition-colors duration-500" />

            <div className="relative p-4">
                {/* Poster Image */}
                <div className="relative overflow-hidden rounded-xl aspect-[4/5] mb-4">
                    <img
                        src={`http://20.204.38.97:5000/api/events/${event._id}/image`}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
                        {event.category}
                    </div>
                </div>

                {/* Event Details */}
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">
                    {event.name}
                </h3>

                <p className="text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {event.caption}
                </p>

                <div className="flex flex-col gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-400" />
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-indigo-400" />
                        <span>{event.venue}</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                        by {event.clubName}
                    </span>
                    <div className="p-2 rounded-full bg-white/10 group-hover:bg-indigo-600 transition-colors">
                        <ExternalLink size={14} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;
