import { useState } from 'react';
import { Heart, Trash2, Upload, Grid3X3, ArrowLeft, Camera } from 'lucide-react';
import Logo from '../../assets/NCC LOGO AKUTE.png'

const PhotoGalleryApp = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'gallery', 'upload'
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);

  
  type Photo = {
    id: number;
    url: string;
    name: string;
    likes: number;
    uploadDate: string;
  };
  

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validImages = files.filter((file) => file.type.startsWith("image/"));
  
    setSelectedFiles(validImages);
  
    const readers = validImages.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === "string") {
            resolve(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  
    Promise.all(readers).then(setPreviewUrls);
  };
  

    const handleUpload = () => {
      const newPhotos = selectedFiles.map((file, index) => ({
        id: Date.now() + index,
        url: previewUrls[index],
        name: file.name,
        likes: 0,
        uploadDate: new Date().toLocaleDateString(),
      }));
    
      setPhotos([...photos, ...newPhotos]);
      setSelectedFiles([]);
      setPreviewUrls([]);
      setCurrentView('gallery');
    };
   

  const handleLike = (photoId: number) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ));
  };

  const handleDelete = (photoId: number) => {
    setPhotos(photos.filter(photo => photo.id !== photoId));
  };

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <div className="mb-8 flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-full p-8 shadow-2xl  border-white/20">
            <img src={Logo} alt="" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
          Photo<span className="text-cyan-400">Hub</span>
        </h1>
        <p className="text-xl text-white/80 max-w-md">
          Welcome to NCC'S AKUTE TEENAGER'S GALLERY
        </p>
      </div>

      <div className="flex gap-6">
        <button
          onClick={() => setCurrentView('gallery')}
          className="group bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 border border-white/20 hover:border-white/40 hover:shadow-2xl hover:scale-105 flex items-center gap-3"
        >
          <Grid3X3 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          View Gallery
        </button>
        <button
          onClick={() => setCurrentView('upload')}
          className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-3"
        >
          <Upload className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
          Upload Photos
        </button>
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentView('home')}
            className="bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h2 className="text-4xl font-bold text-white">Your Gallery</h2>
          <div className="w-32"></div>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-20 h-20 text-white/30 mx-auto mb-4" />
            <p className="text-2xl text-white/60 mb-4">No photos yet</p>
            <button
              onClick={() => setCurrentView('upload')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Upload Your First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNjM2MzYzIi8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHN2Zz4K';
                    }}
                  />
                </div>
                <div className="p-4">
                  <p className="text-white font-medium truncate mb-2">{photo.name}</p>
                  <p className="text-white/60 text-sm mb-3">{photo.uploadDate}</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleLike(photo.id)}
                      className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{photo.likes}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderUpload = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentView('home')}
            className="bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h2 className="text-4xl font-bold text-white">Upload Photo</h2>
          <div className="w-32"></div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-4">
              Choose a photo to upload
            </label>
            <div className="relative">
            <input
               type="file"
             accept="image/*"
              multiple
               onChange={handleFileSelect}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

              <div className="border-2 border-dashed border-white/30 hover:border-white/50 rounded-2xl p-12 text-center transition-all duration-300 hover:bg-white/5">
                <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 text-lg">
  {selectedFiles.length > 0 
    ? selectedFiles.map(file => file.name).join(', ') 
    : 'Click or drag to select photo(s)'}
</p>

              </div>
            </div>
          </div>

          {previewUrls.length > 0 && (
  <div className="mb-6">
    <h3 className="text-white text-lg font-semibold mb-3">Previews</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {previewUrls.map((url, idx) => (
        <div key={idx} className="bg-white/5 rounded-2xl p-4">
          <img
            src={url}
            alt={`Preview ${idx + 1}`}
            className="w-full max-h-80 object-contain rounded-xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNjM2MzYzIi8+CjxwYXRoIGQ9Ik0xMiA4VjE2TTggMTJIMTYiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHN2Zz4K';
            }}
          />
        </div>
      ))}
    </div>
  </div>
)}


          <div className="flex gap-4">
            <button
             onClick={() => {
              setSelectedFiles([]);
              setPreviewUrls([]);
            }}
            
              className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-white/20"
              disabled={selectedFiles.length === 0}
            >
              Clear
            </button>
            <button
              onClick={handleUpload}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedFiles.length === 0}
            >
              Upload Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {currentView === 'home' && renderHome()}
      {currentView === 'gallery' && renderGallery()}
      {currentView === 'upload' && renderUpload()}
    </>
  );
};


export default PhotoGalleryApp;