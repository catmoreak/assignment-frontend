'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Icon SVGs will be used as <img> tags below
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  position: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: typeof window !== 'undefined' && localStorage.getItem('pdfData')
      ? JSON.parse(localStorage.getItem('pdfData')!)
      : undefined,
  });

  const generatePDF = async (data: FormData, download = false) => {
    setIsGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text('User Details', 20, 30);

      doc.setFontSize(12);
      let yPosition = 60;

      doc.setFont('helvetica', 'bold');
      doc.text('Name:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(data.name, 60, yPosition);

      yPosition += 20;
      doc.setFont('helvetica', 'bold');
      doc.text('Email:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(data.email, 60, yPosition);

      yPosition += 20;
      doc.setFont('helvetica', 'bold');
      doc.text('Phone Number:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(data.phone, 60, yPosition);

      if (data.position) {
        yPosition += 20;
        doc.setFont('helvetica', 'bold');
        doc.text('Position:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(data.position, 60, yPosition);
      }

      if (data.description) {
        yPosition += 20;
        doc.setFont('helvetica', 'bold');
        doc.text('Description:', 20, yPosition);
        doc.setFont('helvetica', 'normal');
        const splitDescription = doc.splitTextToSize(data.description, 130);
        doc.text(splitDescription, 20, yPosition + 15);
      }

      if (download) {
        doc.save('user-details.pdf');
      } else {
        localStorage.setItem('pdfData', JSON.stringify(data));
        router.push('/preview');
        // Only clear pdfData after successful submit, not on preview back
        // localStorage.removeItem('pdfData');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = (data: FormData) => {
    generatePDF(data, false);
  };

  const handleDownload = () => {
    const values = getValues();
    const validation = formSchema.safeParse(values);
    if (validation.success) {
      generatePDF(validation.data, true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-black mb-16">
          Add Your details
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Name Field */}
          <div className="relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-6 py-2 shadow-sm">
              <img src="/Icons/user.svg" alt="User" className="text-gray-400 mr-4 flex-shrink-0" width={24} height={24} />
              <div className="flex-1">
                <label className="block text-lg font-semibold text-black mb-1">
                  Name
                </label>
                <Input
                  {...register('name')}
                  placeholder="e.g. John Doe"
                  className="border-0 p-0 text-base text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent"
                />
              </div>
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-2 ml-4">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
              <img src="/Icons/mail.svg" alt="Mail" className="text-gray-400 mr-4 flex-shrink-0" width={24} height={24} />
              <div className="flex-1">
                <label className="block text-lg font-semibold text-black mb-1">
                  Email
                </label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="e.g. Johndoe@gmail.com"
                  className="border-0 p-0 text-base text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent"
                />
              </div>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-2 ml-4">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
              <img src="/Icons/phone-call.svg" alt="Phone" className="text-gray-400 mr-4 flex-shrink-0" width={24} height={24} />
              <div className="flex-1">
                <label className="block text-lg font-semibold text-black mb-1">
                  Phone Number
                </label>
                <Input
                  {...register('phone')}
                  type="tel"
                  placeholder="e.g. (220) 222 -20002"
                  className="border-0 p-0 text-base text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent"
                />
              </div>
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-2 ml-4">{errors.phone.message}</p>
            )}
          </div>

          {/* Position Field */}
          <div className="relative">
            <div className="flex items-center bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm">
              <img src="/Icons/position.svg" alt="Position" className="text-gray-400 mr-4 flex-shrink-0" width={24} height={24} />
              <div className="flex-1">
                <label className="block text-lg font-semibold text-black mb-1">
                  Position
                </label>
                <Input
                  {...register('position')}
                  placeholder="e.g. Junior Front end Developer"
                  className="border-0 p-0 text-base text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div className="relative">
            <div className="flex bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <img src="/Icons/Description.svg" alt="Description" className="text-gray-400 mr-4 flex-shrink-0 mt-1" width={24} height={24} />
              <div className="flex-1">
                <label className="block text-lg font-semibold text-black mb-1">
                  Description
                </label>
                <Textarea
                  {...register('description')}
                  placeholder="e.g. Work experiences"
                  rows={3}
                  className="border-0 p-0 text-base text-gray-500 placeholder-gray-400 focus:ring-0 focus:outline-none bg-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
            <Button
              type="submit"
              disabled={isGenerating}
              className="h-16 text-xl font-semibold bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-colors duration-200"
            >
              {isGenerating ? 'Generating...' : 'View PDF'}
            </Button>
            <Button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="h-16 text-xl font-semibold bg-green-600 hover:bg-green-700 text-white rounded-2xl transition-colors duration-200 flex items-center justify-center gap-3"
            >
              <img src="/Icons/Download.svg" alt="Download" width={24} height={24} />
              Download PDF
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}