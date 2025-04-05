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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <h1 className="text-3xl font-bold text-[black] mb-6">Create Event</h1>
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <div className="p-2">
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
          <div className="p-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
          <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              id="organizer-name"
              name="organizerName"
              placeholder="Organizer Name"
              value={formData.organizerName}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
            <input
              type="email"
              id="organizer-email"
              name="organizerEmail"
              placeholder="Organizer Email"
              value={formData.organizerEmail}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
          <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="datetime-local"
              id="start-date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
            <input
              type="datetime-local"
              id="end-date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2"
              style={{ backgroundColor: "#f6f6f6" }}
            />
          </div>
          <div className="col-span-full mt-6 p-2">
            <button
              type="submit"
              className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full"
            >
              Register for Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
