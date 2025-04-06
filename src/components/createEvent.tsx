// components/CreateEvent.tsx
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Record<string, any>) => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    organizerName: "",
    organizerEmail: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const doc_id = uuidv4();

    const payload = {
      doc_id,
      date: formData.startDate, // Using startDate as the main event date
      title: formData.title,
      description: formData.description,
    };

    try {
      const response = await fetch("/api/firebase/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        alert(`Error: ${errorData.message || "Failed to save the event"}`);
        throw new Error("Failed to save the event");
      }

      onSave(formData);
      setFormData({
        title: "",
        description: "",
        organizerName: "",
        organizerEmail: "",
        startDate: "",
        endDate: "",
      });
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("An error occurred while saving the event. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-3xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient to match other components */}
        <div className="bg-gradient-to-r from-green-800 to-green-700 py-4 px-6 flex justify-between items-center">
          <h2 className="text-xl text-white font-serif">Create New Event</h2>
          <button
            className="text-green-100 hover:text-white transition-colors"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 px-4 py-2.5"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe your event"
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 px-4 py-2.5"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="organizer-name" className="block text-sm font-medium text-gray-700 mb-1">Organizer Name</label>
                <input
                  type="text"
                  id="organizer-name"
                  name="organizerName"
                  placeholder="Enter organizer name"
                  value={formData.organizerName}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 px-4 py-2.5"
                />
              </div>
              
              <div>
                <label htmlFor="organizer-email" className="block text-sm font-medium text-gray-700 mb-1">Organizer Email</label>
                <input
                  type="email"
                  id="organizer-email"
                  name="organizerEmail"
                  placeholder="Enter organizer email"
                  value={formData.organizerEmail}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 px-4 py-2.5"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  id="start-date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 px-4 py-2.5"
                />
              </div>
              
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  id="end-date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 px-4 py-2.5"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
