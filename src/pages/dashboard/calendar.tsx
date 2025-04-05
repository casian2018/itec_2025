import React from "react";
import Calendar from "@/components/calendar";
import Aside from "@/components/Aside";

const CalendarPage: React.FC = () => {
    return (
        <div className="flex">
            <Aside />
            <div className="flex-1">
                <Calendar />
            </div>
        </div>
    );
};

export default CalendarPage;