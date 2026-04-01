export const isEventActive = (event) => {
    if (!event || !event.date || !event.time) return false;
    
    // date is stored as ISO string, e.g., '2024-03-15T00:00:00.000Z'
    const dateStr = event.date.split('T')[0];
    const eventDateTime = new Date(`${dateStr}T${event.time}:00`);
    const now = new Date();
    
    return eventDateTime >= now;
};
