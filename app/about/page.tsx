'use client';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">About ShiftNote AI</h1>
          <p className="text-gray-600 mb-4">
            ShiftNote AI is an AI-powered shift note formatter designed specifically for Australian support workers. 
            It helps streamline the documentation process, ensuring notes are formatted according to industry standards.
          </p>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Professional NDIS and Aged Care templates.</li>
            <li>Real-time AI formatting and suggestions.</li>
            <li>Secure storage and easy access to shift notes.</li>
            <li>Intuitive and user-friendly interface.</li>
          </ul>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            Our mission is to empower support workers with the tools they need to efficiently handle their 
            documentation tasks, allowing them more time to focus on providing quality care.
          </p>
        </div>
      </div>
    </div>
  );
}

