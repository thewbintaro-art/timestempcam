import React from 'react';
import { Calendar, MapPin, User, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface PhotoGalleryProps {
  photos: PhotoData[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  if (photos.length === 0) {
    return (
      <Card className="card-glow bg-gradient-to-br from-card to-muted/30">
        <CardContent className="p-12 text-center">
          <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 mb-6">
            <ImageIcon className="h-16 w-16 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">
            Belum ada foto yang diunggah
          </h3>
          <p className="text-muted-foreground">
            Upload foto pertama Anda di atas
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold gradient-text mb-2">Galeri Foto</h3>
        <p className="text-muted-foreground">
          {photos.length} foto telah diunggah
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <Card key={photo.id} className="card-glow bg-gradient-to-br from-card to-secondary/30 overflow-hidden group">
            <div className="aspect-square overflow-hidden">
              <img
                src={photo.imageUrl}
                alt="Uploaded photo"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Waktu Upload</p>
                  <p className="text-xs text-muted-foreground">{photo.timestamp}</p>
                </div>
              </div>

              {photo.uploaderName && (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Uploader</p>
                    <Badge variant="secondary" className="text-xs">
                      {photo.uploaderName}
                    </Badge>
                  </div>
                </div>
              )}

              {photo.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Lokasi</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {photo.location.address}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Lat: {photo.location.latitude.toFixed(6)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Lng: {photo.location.longitude.toFixed(6)}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;