import React, { useState, useCallback } from 'react';
import { MapPin, User, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import LiveCamera from './LiveCamera';

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

interface PhotoCaptureProps {
  onPhotoCapture: (photo: PhotoData) => void;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ onPhotoCapture }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const { toast } = useToast();

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Using Nominatim (OpenStreetMap) for reverse geocoding - free service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`
      );
      const data = await response.json();
      
      if (data.display_name) {
        return data.display_name;
      }
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  };

  const getCurrentLocation = useCallback((): Promise<{ latitude: number; longitude: number; address: string }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung oleh browser ini'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const address = await reverseGeocode(latitude, longitude);
          resolve({ latitude, longitude, address });
        },
        (error) => {
          reject(new Error('Tidak dapat mengakses lokasi. Pastikan GPS aktif dan izin lokasi diberikan.'));
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 60000 
        }
      );
    });
  }, []);

  const handleCameraCapture = async (imageDataUrl: string) => {
    setIsCapturing(true);
    setIsLoadingLocation(true);

    try {
      // Get location
      const location = await getCurrentLocation();
      setIsLoadingLocation(false);

      // Create photo data
      const photoData: PhotoData = {
        id: Date.now().toString(),
        imageUrl: imageDataUrl,
        timestamp: new Date().toLocaleString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        uploaderName: uploaderName.trim() || undefined,
        location
      };

      onPhotoCapture(photoData);
      
      toast({
        title: "Foto berhasil diambil!",
        description: `Lokasi: ${location.address.split(',')[0]}`,
        variant: "default"
      });

      // Reset uploader name if it was used
      if (uploaderName.trim()) {
        setUploaderName('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengambil foto",
        variant: "destructive"
      });
      setIsLoadingLocation(false);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Card className="card-glow bg-gradient-to-br from-card to-secondary/50">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Kamera Langsung</h2>
            <p className="text-muted-foreground">
              Timestamp dan lokasi otomatis dari sistem
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-left">
              <label htmlFor="uploader" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Nama Uploader (opsional)
              </label>
              <Input
                id="uploader"
                type="text"
                placeholder="Masukkan nama Anda"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <LiveCamera 
              onCapture={handleCameraCapture}
              isCapturing={isCapturing}
            />

            {isLoadingLocation && (
              <div className="flex items-center justify-center text-sm text-primary bg-primary/10 rounded-lg p-3">
                <MapPin className="h-4 w-4 mr-2 animate-pulse" />
                <span>Mengambil lokasi...</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Timestamp: {new Date().toLocaleString('id-ID')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoCapture;