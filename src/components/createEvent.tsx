import React, { useState } from "react";

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: {
    date: string;
    title: string;
    description: string;
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

  const handleSave = () => {
    if (date && title && description) {
      onSave({ date, title, description });
      setDate("");
      setTitle("");
      setDescription("");
      onClose();
    } else {
      alert("Please fill in all fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay fixed inset-0 bg-black bg-opacity-5 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`modal-content bg-white rounded-lg shadow-lg p-8 transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        style={{
          width: "50%",
          maxWidth: "600px",
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Create Event</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <form>
          <div className="form-group mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="modal-actions flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
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
