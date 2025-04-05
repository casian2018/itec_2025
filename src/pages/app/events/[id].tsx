'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/pages/api/firebase/firebase';
import { useDropzone } from 'react-dropzone';
import Cookies from 'js-cookie';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  attendees?: string[];
  uploadedFiles?: string[];
}

const dropzoneStyle: React.CSSProperties = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

const EventDetails: React.FC = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const userId = Cookies.get('email') || '';
  const userName = Cookies.get('name') || '';
  const userUid = Cookies.get('uid') || '';

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || !userId) return;

      try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = { id: docSnap.id, ...docSnap.data() } as Event;
          setEvent(eventData);

          if (eventData.attendees?.includes(userId)) {
            setAttending(true);
          }

          if (eventData.uploadedFiles) {
            setUploadedFiles(eventData.uploadedFiles);
          }
        } else {
          console.error('No such event!');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, userId]);

  const handleAttend = async () => {
    if (!id || !event || !userId) return;

    try {
      const eventDocRef = doc(db, 'events', id);
      await updateDoc(eventDocRef, {
        attendees: arrayUnion(userId),
      });

      await updateDoc(doc(db, 'users', userId), {
        events_attended: arrayUnion({
          eventId: id,
          eventTitle: event.title,
          eventDate: event.date,
          attendedAt: new Date().toISOString(),
        }),
      });

      setAttending(true);
      alert('You are now attending this event!');
    } catch (err) {
      console.error('Error attending event:', err);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!id || acceptedFiles.length === 0) return;

      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('file', file);
      });

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!data.files || !Array.isArray(data.files)) {
          console.error('Unexpected upload response:', data);
          alert('Upload failed. Unexpected server response.');
          return;
        }

        const filenames: string[] = data.files.map((f: any) => f.newFilename);

        setUploadedFiles((prev) => [...prev, ...filenames]);

        const eventDocRef = doc(db, 'events', id);
        await updateDoc(eventDocRef, {
          uploadedFiles: arrayUnion(...filenames),
        });

        alert('Files uploaded successfully!');
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload files.');
      }
    },
    [id]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
      'application/pdf': ['.pdf'],
    },
  });

  if (loading) return <div className="p-4 text-center">Loading event...</div>;
  if (!event) return <div className="p-4 text-center">Event not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-6">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-600 mb-2">
          <strong>Date:</strong>{' '}
          {event.date ? new Date(event.date).toLocaleDateString() : 'Invalid date'}
        </p>
        <p className="text-gray-700 mb-4">{event.description}</p>

        <button
          onClick={handleAttend}
          disabled={attending}
          className={`px-4 py-2 rounded font-medium ${
            attending
              ? 'bg-green-100 text-green-800 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {attending ? 'You are attending' : 'Attend Event'}
        </button>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Upload Files</h2>
          <div {...getRootProps()} style={dropzoneStyle}>
            <input {...getInputProps()} />
            <p>Drag & drop files here, or click to select</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
          <ul className="list-disc pl-5">
            {uploadedFiles.length > 0 ? (
              uploadedFiles.map((name, idx) => (
                <li key={idx}>
                  <a
                    className="text-blue-600 underline"
                    href={`/uploads/${name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {name}
                  </a>
                </li>
              ))
            ) : (
              <li>No files uploaded yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
