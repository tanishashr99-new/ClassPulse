"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, MapPin } from "lucide-react";

interface TimetableSlot {
  id: string;
  class_name: string;
  subject: string;
  day: string;
  start_time: string;
  end_time: string;
  room_number: string;
}

export function MyTimetable({ teacherId }: { teacherId: string }) {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    async function fetchTimetable() {
      if (!teacherId) return;
      
      const { data, error } = await supabase
        .from("timetable")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching timetable:", error);
      } else {
        setTimetable(data || []);
      }
      setLoading(false);
    }

    fetchTimetable();
  }, [teacherId]);

  if (loading) {
    return <div className="p-8 text-center animate-pulse">Loading your timetable...</div>;
  }

  // Format time util
  const formatTime = (timeDb: string) => {
    // timeDb is like "09:00:00"
    const [h, m] = timeDb.split(":");
    let hours = parseInt(h);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${hours}:${m} ${ampm}`;
  };

  return (
    <div className="card p-6 overflow-hidden">
      <h3 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>My Weekly Timetable</h3>
      
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px] grid grid-cols-6 gap-4">
          {days.map((day) => {
            const daySlots = timetable.filter(t => t.day === day);
            return (
              <div key={day} className="flex flex-col gap-3">
                <div className="text-center font-bold py-2 rounded-xl bg-black/5 dark:bg-white/5" style={{ color: "var(--text-primary)" }}>
                  {day}
                </div>
                
                {daySlots.length === 0 ? (
                  <div className="text-center py-4 text-xs font-semibold opacity-40 uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                    Free
                  </div>
                ) : (
                  <div className="space-y-3">
                    {daySlots.map(slot => (
                      <div key={slot.id} className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/20 hover:border-blue-500/50 transition-colors shadow-sm relative overflow-hidden group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                        <h4 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{slot.class_name}</h4>
                        <p className="text-xs font-medium text-blue-500 mb-2">{slot.subject}</p>
                        
                        <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTime(slot.start_time)} - {formatTime(slot.end_time)}</span>
                        </div>
                        
                        {slot.room_number && (
                          <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Room {slot.room_number}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
