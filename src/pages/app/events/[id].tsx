'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteField } from 'firebase/firestore';
import { db, user } from '@/pages/api/firebase/firebase';
import { useDropzone } from 'react-dropzone';
import Cookies from 'js-cookie';
import Aside from '@/components/Aside';
import firebase from 'firebase/compat/app';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  attendees?: string[];
  uploadedFiles?: string[];
  fileSummaries?: Record<string, string>;
  videoCallLink?: string;
}

const EventDetails: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [removingFile, setRemovingFile] = useState<string | null>(null);
  const [fileSummaries, setFileSummaries] = useState<Record<string, string>>({});
  const [summarizing, setSummarizing] = useState<Record<string, boolean>>({});

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

          if (eventData.fileSummaries) {
            setFileSummaries(eventData.fileSummaries);
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

      await updateDoc(doc(db, 'users', userUid), {
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

        // Automatically summarize the uploaded files
        filenames.forEach(async (filename) => {
          await summarizeFile(filename);
        });

        alert('Files uploaded successfully!');
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload files.');
      }
    },
    [id]
  );

  // Function to summarize a file using our API
  const summarizeFile = async (filename: string) => {
    try {
      setSummarizing(prev => ({ ...prev, [filename]: true }));
      
      const response = await fetch('/api/gemini/summarizeFile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filePath: filename }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to summarize file');
      }

      const data = await response.json();
      
      // Update local state
      setFileSummaries(prev => ({ ...prev, [filename]: data.summary }));
      
      // Update in Firestore
      const eventDocRef = doc(db, 'events', id);
      await updateDoc(eventDocRef, {
        [`fileSummaries.${filename}`]: data.summary
      });
      
    } catch (error: any) {
      console.error('Error summarizing file:', error);
    } finally {
      setSummarizing(prev => ({ ...prev, [filename]: false }));
    }
  };

  const handleRemoveFile = async (fileName: string) => {
    if (!id || !fileName) return;
    
    try {
      setRemovingFile(fileName);
      setIsRemoving(true);
      
      const eventDocRef = doc(db, 'events', id);
      await updateDoc(eventDocRef, {
        uploadedFiles: arrayRemove(fileName),
        [`fileSummaries.${fileName}`]: deleteField()
      });

      // Update local state
      setUploadedFiles(prev => prev.filter(name => name !== fileName));
      setFileSummaries(prev => {
        const newSummaries = { ...prev };
        delete newSummaries[fileName];
        return newSummaries;
      });
      
      // Optional: You could also delete the file from storage here
      // This would require additional Firebase Storage imports and functions
      
    } catch (error) {
      console.error('Error removing file:', error);
      alert('Failed to remove the file.');
    } finally {
      setIsRemoving(false);
      setRemovingFile(null);
    }
  };

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
              
              {/* Join Meeting Button - Only visible when attending */}
              {attending && event.videoCallLink && (
                <button
                  onClick={() => router.push(event.videoCallLink)}
                  className="mt-4 px-6 py-3 rounded-lg font-medium text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Join Meeting
                </button>
              )}
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
              {isRemoving && (
                <div className="flex justify-center mb-4">
                  <div className="animate-pulse flex items-center">
                    <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500"></div>
                    <span className="text-sm text-gray-600">Removing {removingFile}...</span>
                  </div>
                </div>
              )}
              
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
                      <div className="flex items-center">
                        <a
                          href={`/uploads/${name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium mr-3"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleRemoveFile(name)}
                          disabled={isRemoving}
                          className="text-red-500 hover:text-red-700 focus:outline-none transition-colors"
                          title="Remove file"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                  No files uploaded yet
                </div>
              )}
            </div>
            
            {/* File Summaries Section */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-green-800 mb-3">File Summaries</h2>
              {uploadedFiles.length > 0 ? (
                <div className="space-y-4">
                  {uploadedFiles.map((name, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="bg-green-100 px-4 py-2 flex justify-between items-center">
                        <h3 className="font-medium text-green-800 truncate">{name}</h3>
                        {summarizing[name] ? (
                          <div className="flex items-center text-sm text-green-700">
                            <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500"></div>
                            <span>Summarizing...</span>
                          </div>
                        ) : !fileSummaries[name] ? (
                          <button 
                            onClick={() => summarizeFile(name)}
                            className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Summarize
                          </button>
                        ) : null}
                      </div>
                      {fileSummaries[name] ? (
                        <div className="p-4">
                          <div 
                            className="prose prose-sm max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: fileSummaries[name] }}
                          />
                        </div>
                      ) : !summarizing[name] ? (
                        <div className="p-4 text-center text-gray-500">
                          No summary available. Click "Summarize" to generate one.
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Generating summary...
                        </div>
                      )}
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