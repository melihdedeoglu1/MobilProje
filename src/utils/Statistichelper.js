const DAYS_OF_WEEK = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export const formatDuration = (totalSeconds) => {
    if (totalSeconds < 0) return '00:00';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const calculateStats = (sessions) => {
    if (!sessions || sessions.length === 0) {
        return {
            totalToday: 0,
            totalAllTime: 0,
            totalDistractions: 0,
            categoryTotals: {},
            lastSevenDays: Array(7).fill(0),
        };
    }

    const today = new Date().toISOString().slice(0, 10);
    let totalToday = 0;
    let totalAllTime = 0;
    let totalDistractions = 0;
    
    const categoryTotals = {}; 
    const sevenDayData = Array(7).fill(0); 

    sessions.forEach(session => {
        totalAllTime += session.duration;
        totalDistractions += session.distractions;

        const sessionDateString = session.date.slice(0, 10);
        const sessionDate = new Date(session.date);
        
        if (sessionDateString === today) {
            totalToday += session.duration;
        }

        const category = session.category || 'Diğer';
        categoryTotals[category] = (categoryTotals[category] || 0) + session.duration;

        const diffTime = Math.abs(new Date() - sessionDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays <= 7) {
            let dayIndex = sessionDate.getDay();          
            let chartIndex = (dayIndex + 6) % 7;
            
            sevenDayData[chartIndex] += session.duration;
        }
    });

    return {
        totalToday: totalToday,
        totalAllTime: totalAllTime,
        totalDistractions: totalDistractions,
        categoryTotals: categoryTotals,
        lastSevenDays: sevenDayData,
    };
};