import React, { useState } from "react";

interface CreateEventProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (eventData: {
        date: string;
        title: string;
        description: string;
        doc_id: string;
    }) => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSave = async () => {
        if (date && title && description) {
            const doc_id = title.replace(/\s+/g, "_").toLowerCase(); // Generate doc_id from the title
            const eventData = {
                doc_id,
                date,
                title,
                description,
            };

            try {
                // Send the event data to the database via an API call
                const response = await fetch("/api/firebase/events", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(eventData),
                });

                if (!response.ok) {
                    throw new Error("Failed to save the event");
                }

                // Call the onSave callback to update the parent component
                onSave(eventData);

                // Reset the form fields
                setDate("");
                setTitle("");
                setDescription("");

                // Close the modal
                onClose();
            } catch (error) {
                console.error("Error saving event:", error);
                alert("An error occurred while saving the event. Please try again.");
            }
        } else {
            alert("Please fill in all fields.");
        }
    };

    if (!isOpen) return null;

    return (
        <div
        className={`
          fixed inset-0 z-50 flex items-center justify-center
          bg-black/50 backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      >
        <div
          className={`
            bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl
            transition-transform duration-300 transform
            ${isOpen ? "scale-100" : "scale-95"}
          `}
          style={{ maxHeight: "80vh", overflowY: "auto" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Create Event</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
      
          <form className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
      
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
      
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
              />
            </div>
      
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      
    );
};

export default CreateEvent;
