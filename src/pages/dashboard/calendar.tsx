import React from "react";
import Calendar from "@/components/calendar";
import Aside from "@/components/Aside";

const CalendarPage: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Aside />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">


        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">

            <div>
              <Calendar />

          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
