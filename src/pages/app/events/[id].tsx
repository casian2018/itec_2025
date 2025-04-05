'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/pages/api/firebase/firebase';
import { useDropzone } from 'react-dropzone';
import Cookies from 'js-cookie';
import Aside from '@/components/Aside';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  attendees?: string[];
  uploadedFiles?: string[];
}

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
      'application/pdf': ['.pdf'],
    },
  });

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Aside />
        <div className="flex-1 min-h-screen bg-gray-50 p-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-green-100 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-green-50 rounded w-1/3 mx-auto mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-green-50 rounded"></div>
                <div className="h-4 bg-green-50 rounded w-5/6"></div>
                <div className="h-4 bg-green-50 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen">
        <Aside />
        <div className="flex-1 min-h-screen bg-gray-50 p-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
            <button 
              onClick={() => window.location.href = "/events"}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Aside />
      
      <div className="flex-1 min-h-screen bg-gray-50 p-4 md:p-8 overflow-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          {/* Event Header */}
          <div className="bg-green-700 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{event.title}</h1>
            <div className="flex items-center text-green-100 mt-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{event.date ? new Date(event.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Invalid date'}</span>
            </div>
          </div>
          
          {/* Event Content */}
          <div className="p-6">
            <div className="prose max-w-none text-gray-700 mb-8">
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
            
            {/* Attend Button */}
            <div className="mb-8">
              <button
                onClick={handleAttend}
                disabled={attending}
                className={`px-6 py-3 rounded-lg font-medium text-center transition-colors ${
                  attending 
                    ? "bg-green-100 text-green-800 border border-green-300 cursor-not-allowed" 
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {attending ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    You're Attending
                  </span>
                ) : (
                  "Attend This Event"
                )}
              </button>
            </div>
            
            {/* File Upload Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-green-800 mb-3">Upload Files</h2>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600">
                    {isDragActive ? 
                      "Drop the files here" : 
                      "Drag & drop files here, or click to select"}
                  </p>
                  <p className="text-sm text-gray-500">Supports: JPG, PNG, PDF</p>
                </div>
              </div>
            </div>
            
            {/* Uploaded Files Section */}
            <div>
              <h2 className="text-lg font-semibold text-green-800 mb-3">Uploaded Files</h2>
              {uploadedFiles.length > 0 ? (
                <div className="space-y-2">
                  {uploadedFiles.map((name, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-700 truncate max-w-xs">{name}</span>
                      </div>
                      <a
                        href={`/uploads/${name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                  No files uploaded yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;