'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useRouter } from 'next/navigation';

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [date, setDate] = useState(new Date());
  const router = useRouter();

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      interface ApiEvent {
  id: string;
  title: string;
  start: string;
  end: string;
}

// ...

      setEvents(data.map((event: ApiEvent) => ({ ...event, start: new Date(event.start), end: new Date(event.end) })));
    } catch (error) { console.error(error); }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleSelectEvent = (event: Event) => {
    router.push(`/tasks/${event.id}`);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-[80vh]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          date={date}
          onNavigate={handleNavigate}
          defaultView="month"
          selectable
        />
      </div>
    </div>
  );
}
