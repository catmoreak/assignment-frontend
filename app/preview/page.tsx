'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserData {
  name: string;
  email: string;
  phone: string;
  position?: string;
  description?: string;
}

export default function Preview() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('pdfData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      router.push('/');
    }
  }, [router]);

  const handleDownload = async () => {
    if (!userData) return;

    setIsGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Set up the PDF styling
      doc.setFontSize(20);
      doc.text('User Details', 20, 30);

      doc.setFontSize(12);
      let yPosition = 60;

      // Add user details to PDF
      doc.setFont('helvetica', 'bold');
      doc.text('Name:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(userData.name, 60, yPosition);

      yPosition += 20;
      doc.setFont('helvetica', 'bold');
      doc.text('Email:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(userData.email, 60, yPosition);

      yPosition += 20;
      doc.setFont('helvetica', 'bold');
      doc.text('Phone Number:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(userData.phone, 60, yPosition);

      if (userData.position) {
        yPosition += 20;
        doc.setFont('helvetica', 'bold');
        doc.text('Position:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(userData.position, 60, yPosition);
      }

      if (userData.description) {
        yPosition += 20;
        doc.setFont('helvetica', 'bold');
        doc.text('Description:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        
        // Handle multiline description
        const splitDescription = doc.splitTextToSize(userData.description, 130);
        doc.text(splitDescription, 20, yPosition + 15);
      }

      doc.save('user-details.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (userData) {
      localStorage.setItem('pdfData', JSON.stringify(userData));
    }
    router.push('/');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-12 p-3 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={32} className="text-gray-600" />
        </Button>

        {/* PDF Preview Container */}
        <div className="flex justify-center">
          <div className="bg-white border-2 border-gray-300 rounded-lg p-16 w-full max-w-3xl shadow-sm">
            <div className="space-y-12">
              <div className="flex">
                <span className="font-bold text-black text-xl w-48 flex-shrink-0">Name:</span>
                <span className="text-gray-500 text-xl">{userData.name}</span>
              </div>

              <div className="flex">
                <span className="font-bold text-black text-xl w-48 flex-shrink-0">Email:</span>
                <span className="text-gray-500 text-xl">{userData.email}</span>
              </div>

              <div className="flex">
                <span className="font-bold text-black text-xl w-48 flex-shrink-0">Phone Number:</span>
                <span className="text-gray-500 text-xl">{userData.phone}</span>
              </div>

              {userData.position && (
                <div className="flex">
                  <span className="font-bold text-black text-xl w-48 flex-shrink-0">Position:</span>
                  <span className="text-gray-500 text-xl">{userData.position}</span>
                </div>
              )}

              {userData.description && (
                <div className="flex">
                  <span className="font-bold text-black text-xl w-48 flex-shrink-0">Description:</span>
                  <div className="text-gray-500 text-xl leading-relaxed">
                    {userData.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center mt-12">
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            className="h-16 px-12 text-xl font-semibold bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-colors duration-200 flex items-center justify-center gap-3"
          >
            <Download size={24} />
            {isGenerating ? 'Generating PDF...' : 'Download PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
}