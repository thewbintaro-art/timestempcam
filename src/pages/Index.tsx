import React, { useState } from 'react';
import PhotoCapture from '@/components/PhotoCapture';
import PhotoGallery from '@/components/PhotoGallery';

interface PhotoData {
  id: string;
  imageUrl: string;
  timestamp: string;
  uploaderName?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

const Index = () => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);

  const handlePhotoCapture = (photo: PhotoData) => {
    setPhotos(prevPhotos => [photo, ...prevPhotos]);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Laporan Foto</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload foto dengan timestamp otomatis dan lokasi lengkap dari sistem
          </p>
        </div>

        {/* Photo Capture Section */}
        <div className="mb-12">
          <PhotoCapture onPhotoCapture={handlePhotoCapture} />
        </div>

        {/* Photo Gallery Section */}
        <PhotoGallery photos={photos} />
      </div>
    </div>
  );
};

export default Index;
