import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, Upload, Trash2, Copy, Check, 
  ExternalLink, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';
import { fetchMediaList, uploadImage, deleteMediaFile, MediaItem } from '../../services/api';

export const AdminMedia: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchMediaList();
      setMediaList(items);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des médias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadImage(files[i], files[i].name);
      }
      await loadMedia();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l’envoi des fichiers');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopy = (url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (filename: string) => {
    if (window.confirm(`Supprimer définitivement l'image « ${filename} » du serveur ?`)) {
      try {
        await deleteMediaFile(filename);
        setMediaList((prev) => prev.filter((m) => m.filename !== filename));
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
        <div>
          <h2 className="font-serif-luxury text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-honey-gold" />
            <span>Médiathèque &amp; Hébergement d'Images</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Stockage permanent sur serveur cloud. Uploadez vos photos depuis votre téléphone ou ordinateur.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadMedia}
            disabled={loading}
            className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-honey-gold to-amber-500 hover:from-amber-500 hover:to-honey-gold text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Envoi en cours...' : 'Uploader des Photos'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/70 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center text-neutral-500 flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-honey-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Chargement de la médiathèque...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="py-16 text-center bg-neutral-900/40 border-2 border-dashed border-neutral-800 rounded-2xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-neutral-800 text-neutral-500 mx-auto flex items-center justify-center">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-bold text-sm">Aucune image hébergée pour le moment</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Cliquez sur « Uploader des Photos » pour envoyer des photos de créations, bannières ou ateliers depuis votre appareil.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold"
          >
            Sélectionner des fichiers
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {mediaList.map((item) => (
            <div
              key={item.filename}
              className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group hover:border-neutral-700 transition-all flex flex-col"
            >
              <div
                onClick={() => setPreviewImage(item.url)}
                className="relative aspect-square bg-neutral-950 cursor-pointer overflow-hidden"
              >
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                  Aperçu
                </div>
              </div>

              <div className="p-2 space-y-1 text-[10.5px]">
                <p className="text-neutral-300 truncate font-mono" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex items-center justify-between text-neutral-500 pt-1 border-t border-neutral-800">
                  <span>{(item.size / 1024).toFixed(0)} KB</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleCopy(item.url)}
                      className="p-1 hover:text-honey-gold transition-colors cursor-pointer"
                      title="Copier le lien"
                    >
                      {copiedUrl === item.url ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.filename)}
                      className="p-1 hover:text-red-400 transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Large Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900">
            <img
              src={previewImage}
              alt="Aperçu grand format"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
