import React, { useState, useEffect, useRef } from "react";
import Calendar from "@/components/calendar";
import Aside from "@/components/Aside";
import { ChevronDownIcon, CalendarIcon, FilterIcon, PlusIcon } from '@heroicons/react/outline';

const CalendarPage: React.FC = () => {
  const [view, setView] = useState<'month' | 'week' | 'agenda'>('month');
  const [filter, setFilter] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [yearFilterOpen, setYearFilterOpen] = useState(false);
  const [academicYear, setAcademicYear] = useState('2023-2024');

  const filterRef = useRef<HTMLDivElement>(null);
  const yearFilterRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
      if (
        yearFilterRef.current &&
        !yearFilterRef.current.contains(event.target as Node)
      ) {
        setYearFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-green-50">
      <Aside />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto ml-48">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-green-800 to-green-700 h-3"></div>
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-serif text-green-800 mb-1">Academic Calendar</h1>
              <p className="text-gray-600">View and manage your academic schedule</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                <PlusIcon className="h-5 w-5 mr-2" />
                <span>Add Event</span>
              </button>
              <button className="flex items-center px-4 py-2 bg-green-100 text-green-800 font-medium rounded-lg hover:bg-green-200 transition-colors">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">View</h3>
              <div className="flex bg-green-50 rounded-lg p-1 shadow-inner">
                {['month', 'week', 'agenda'].map((option) => (
                  <button
                    key={option}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                      ${view === option
                        ? 'bg-white text-green-800 shadow-sm transform scale-105'
                        : 'text-green-700 hover:text-green-900 hover:bg-green-100'}`}
                    onClick={() => setView(option as any)}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex gap-3">
              <div className="relative" ref={filterRef}>
                <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Filter by</h3>
                <button
                  onClick={(e) => { e.stopPropagation(); setFilterOpen(!filterOpen); }}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all w-36 justify-between"
                >
                  <div className="flex items-center">
                    <FilterIcon className="h-4 w-4 mr-2 text-green-600" />
                    <span>{filter === 'all' ? 'All Events' : filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${filterOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {/* Filter Dropdown */}
                {filterOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-slideDown">
                    {['all', 'classes', 'meetings', 'deadlines', 'exams'].map(option => (
                      <button
                        key={option}
                        className={`block px-4 py-2 text-sm w-full text-left hover:bg-green-50 ${filter === option ? 'bg-green-100 text-green-800 font-medium' : 'text-gray-700'}`}
                        onClick={() => { setFilter(option); setFilterOpen(false); }}
                      >
                        {option === 'all' ? 'All Events' : option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={yearFilterRef}>
                <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Academic Year</h3>
                <button
                  onClick={(e) => { e.stopPropagation(); setYearFilterOpen(!yearFilterOpen); }}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all w-48 justify-between"
                >
                  <span>{academicYear}</span>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${yearFilterOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {/* Year Dropdown */}
                {yearFilterOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-slideDown">
                    {['2023-2024', '2022-2023', '2021-2022'].map(year => (
                      <button
                        key={year}
                        className={`block px-4 py-2 text-sm w-full text-left hover:bg-green-50 ${academicYear === year ? 'bg-green-100 text-green-800 font-medium' : 'text-gray-700'}`}
                        onClick={() => { setAcademicYear(year); setYearFilterOpen(false); }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Calendar */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gradient-to-r from-green-800 to-green-700 py-4 px-6 flex justify-between items-center">
            <h2 className="text-xl text-white font-serif flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 opacity-80" />
              {view === 'month' ? 'Monthly View' :
                view === 'week' ? 'Weekly View' : 'Agenda View'}
            </h2>

            <div className="flex items-center space-x-3">
              <div className="bg-green-700 bg-opacity-50 rounded-lg flex overflow-hidden">
                <button className="px-3 py-1 text-green-100 hover:text-white hover:bg-green-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="px-4 py-1 text-green-100 hover:text-white font-medium hover:bg-green-600 transition-colors border-l border-r border-green-600">
                  Today
                </button>
                <button className="px-3 py-1 text-green-100 hover:text-white hover:bg-green-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <span className="text-white bg-green-600 rounded-lg px-4 py-1 text-sm font-medium shadow-sm">
                September 2023
              </span>
            </div>
          </div>

          <div className="p-6">
            <Calendar />
          </div>
        </div>

        {/* Quick Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-600 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-green-800 mb-2">Upcoming Deadlines</h3>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">3</span>
            </div>
            <p className="text-gray-600 text-sm">Next: Research paper due in 5 days</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-amber-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-green-800 mb-2">Important Dates</h3>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">1</span>
            </div>
            <p className="text-gray-600 text-sm">Final exams begin October 14</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-green-800 mb-2">Office Hours</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">2</span>
            </div>
            <p className="text-gray-600 text-sm">Professor Smith: Tomorrow, 2-4 PM</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
            <h3 className="font-medium text-green-800 mb-2">Academic Progress</h3>
            <div className="mt-2 relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    Fall Semester
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    75%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-purple-100">
                <div style={{ width: "75%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
