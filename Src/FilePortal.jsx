import { useEffect, useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Trash2,
  Download,
  LogOut,
  ShieldCheck,
  User,
  FolderOpen,
  AlertCircle,
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

const BUCKET = 'shop-files';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function FilePortal() {
  const { profile, signOut } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const fileInputRef = useRef(null);

  const isManagement = profile?.role === 'management';

  const loadFiles = async () => {
    setLoading(true);
    setError('');
    const { data, fetchError } = await supabase
      .from('files')
      .select(
        'id, name, storage_path, size, content_type, created_at, uploaded_by, profiles(full_name)'
      )
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setFiles([]);
    } else {
      setFiles(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleFileSelect = async (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    setUploading(true);
    setError('');

    for (const file of selected) {
      const path = `${profile.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          contentType: file.type || 'application/octet-stream',
        });

      if (uploadError) {
        setError(`Upload failed for ${file.name}: ${uploadError.message}`);
        continue;
      }

      const { error: insertError } = await supabase.from('files').insert({
        name: file.name,
        storage_path: path,
        size: file.size,
        content_type: file.type || 'application/octet-stream',
        uploaded_by: profile.id,
      });

      if (insertError) {
        setError(
          `Could not save file record for ${file.name}: ${insertError.message}`
        );
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    loadFiles();
  };

  const handleDownload = async (f) => {
    const { data, error: dlError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(f.storage_path, 60);

    if (dlError) {
      setError(`Could not generate download link: ${dlError.message}`);
      return;
    }
    window.open(data.signedUrl, '_blank');
  };

  const handleDelete = async (f) => {
    setError('');
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([f.storage_path]);
    if (storageError) {
      setError(`Could not delete file from storage: ${storageError.message}`);
      return;
    }
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', f.id);
    if (dbError) {
      setError(`Could not remove file record: ${dbError.message}`);
      return;
    }
    setFiles((prev) => prev.filter((file) => file.id !== f.id));
  };

  const startRename = (f) => {
    setRenamingId(f.id);
    setRenameValue(f.name);
  };

  const confirmRename = async (f) => {
    const trimmed = renameValue.trim();
    setRenamingId(null);
    if (!trimmed || trimmed === f.name) return;

    const { error: updateError } = await supabase
      .from('files')
      .update({ name: trimmed })
      .eq('id', f.id);

    if (updateError) {
      setError(`Could not rename file: ${updateError.message}`);
      return;
    }
    setFiles((prev) =>
      prev.map((file) =>
        file.id === f.id ? { ...file, name: trimmed } : file
      )
    );
  };

  return (
    <div className="min-h-screen w-full bg-ink text-cream">
      <header className="border-b border-line sticky top-0 bg-ink/95 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-ink" />
            </div>
            <div>
              <h1
                className="font-semibold tracking-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Base 1 Club House
              </h1>
              <p className="text-xs text-muted">Shared shop files</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted">
              {isManagement ? (
                <ShieldCheck className="w-4 h-4 text-gold" />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span>
                {profile?.full_name} · {isManagement ? 'Management' : 'Staff'}
              </span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-cream border border-line rounded-md px-3 py-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-line rounded-xl py-10 cursor-pointer hover:border-gold hover:bg-panel transition-colors text-center ${
              uploading ? 'opacity-60 pointer-events-none' : ''
            }`}
          >
            <Upload className="w-6 h-6 text-gold" />
            <span className="text-sm font-medium">
              {uploading ? 'Uploading…' : 'Click to upload files'}
            </span>
            <span className="text-xs text-muted">
              Price lists, rotas, supplier docs, photos — anything the team
              needs
            </span>
          </label>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-danger bg-[#2A1F18] border border-[#4A3324] rounded-md px-3 py-2 mb-4">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
            {loading ? 'Loading files…' : `Files (${files.length})`}
          </h2>

          {!loading && files.length === 0 && (
            <div className="text-center py-12 border border-line rounded-xl">
              <FileText className="w-8 h-8 text-faint mx-auto mb-2" />
              <p className="text-sm text-muted">
                No files yet. Upload something for the team to find.
              </p>
            </div>
          )}

          <div className="space-y-2">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 bg-panel border border-line rounded-lg px-4 py-3"
              >
                <div className="w-9 h-9 rounded-md bg-ink border border-line flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  {renamingId === f.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => confirmRename(f)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') confirmRename(f);
                        if (e.key === 'Escape') setRenamingId(null);
                      }}
                      className="w-full bg-ink border border-gold rounded px-2 py-1 text-sm text-cream focus:outline-none"
                    />
                  ) : (
                    <p
                      className="text-sm font-medium truncate cursor-text"
                      onClick={() => startRename(f)}
                      title="Click to rename"
                    >
                      {f.name}
                    </p>
                  )}
                  <p className="text-xs text-muted truncate">
                    {formatBytes(f.size)} · uploaded by{' '}
                    {f.profiles?.full_name ?? 'Unknown'} ·{' '}
                    {formatDate(f.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleDownload(f)}
                    className="p-2 rounded-md text-muted hover:text-gold hover:bg-ink transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {isManagement && (
                    <button
                      onClick={() => handleDelete(f)}
                      className="p-2 rounded-md text-muted hover:text-danger hover:bg-ink transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-faint text-center mt-8">
          Files are shared with everyone signed in to this portal. Only
          Management can delete files.
        </p>
      </main>
    </div>
  );
}
