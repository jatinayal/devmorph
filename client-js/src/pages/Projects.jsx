import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getProject } from '../features/project/projectThunk'
import { saveProject, togglePublish } from '../features/projectactions/pActionThunk'
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowBigDownDashIcon,
  AtSign,
  EyeIcon,
  EyeOffIcon,
  FullscreenIcon,
  LaptopIcon,
  Loader2Icon,
  MessageSquareIcon,
  PawPrint,
  SaveIcon,
  SmartphoneIcon,
  TabletIcon,
  Terminal,
  XIcon,
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import ProjectPreview from '../components/ProjectPreview';
import EditorPanel from '../components/EditorPanel';

const Projects = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
        const { project, loading } = useSelector((state) => state.project)

  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  // const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
  const [device, setDevice] = useState('desktop');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch()

  const previewRef = useRef(null);

  const [selectedElement, setSelectedElement] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'ELEMENT_SELECTED') {
        setSelectedElement(event.data.payload);
      } else if (event.data?.type === 'CLEAR_SELECTION') {
        setSelectedElement(null);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleUpdateElement = (updates) => {
    previewRef.current?.updateElement?.(updates);
  };

  const clearSelection = () => {
    setSelectedElement(null);
    previewRef.current?.clearSelection?.();
  };

  useEffect(() => {
    dispatch(getProject({ projectId }))
      .unwrap()
      .then((res) => {
        if (res.project?.current_code) {
          setIsGenerating(false);
        }
        setIsPublished(res.project?.isPublished);
      })
      .catch(() => {});
  }, [dispatch, projectId]);

// rename local function to avoid collision with thunk
const handleSaveProject = async () => {
  setIsSaving(true);

  try {
    let latestCode = previewRef.current?.getCode() || project?.current_code;

    // ensure DOCTYPE exists
    if (latestCode && !latestCode.startsWith('<!DOCTYPE html>')) {
      latestCode = '<!DOCTYPE html>\n' + latestCode;
    }

    // dispatch thunk with DIRECT value (not state)
    const result = await dispatch(
      saveProject({
        projectId,
        code: latestCode,
      })
    ).unwrap();

    // setProject(result.project);
  } catch (err) {
    console.error(err);
    toast('Project Not Saved');
  } finally {
    toast('Project Saved!');
    setIsSaving(false);
  }
};

const downloadCode = () => {
    const code =
      previewRef.current?.getCode?.() || project?.current_code;

    if (!code) return;

    const blob = new Blob([code], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'index.html';
    link.click();
    toast('Downloading Code!');
};

 const handleTogglePublish = async () => {
  setIsPublishing(true);

  try {
    await dispatch(togglePublish({ projectId })).unwrap();
  } catch (err) {
    console.error(err);
  } finally {
    setIsPublishing(false);
    setIsPublished(p=> !p);
    toast(`Project ${isPublished ? 'Unpublished': 'Published'}`);
  }
};

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-violet-200" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl text-gray-300">Unable to load project</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* 1. FIXED TOP TOOLBAR */}
      <header className="flex-none flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5 backdrop-blur-xl z-10 shadow-sm">
        
        {/* Left: Logo & Project Name */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className='text-white' viewBox="0 0 24 24"><path fill="currentColor" d="m17.713 10.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M2.828 12l4.243 4.243l-1.414 1.414L0 12l5.657-5.657L7.07 7.757zm15.515 5.657L24 12l-2.83-2.828l-1.414 1.414L21.171 12l-4.242 4.243z"/></svg>
          </Link>
          <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
          <div className="flex items-center gap-2 max-w-[200px] sm:max-w-xs">
            <AtSign className="size-4 text-white/50" />
            <p className="truncate text-sm font-medium" title={project?.project?.name || project?.name}>
              {project?.project?.name || project?.name}
            </p>
          </div>
        </div>

        {/* Center: Device Controls (Desktop only) */}
        <div className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
          <button 
            onClick={() => setDevice('phone')}
            className={`p-1.5 rounded-md transition-all ${device === 'phone' ? 'bg-[#193704] text-lime-400 shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            title="Mobile Preview"
          >
            <SmartphoneIcon className="size-4" />
          </button>
          <button 
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-md transition-all ${device === 'tablet' ? 'bg-[#193704] text-lime-400 shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            title="Tablet Preview"
          >
            <TabletIcon className="size-4" />
          </button>
          <button 
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-md transition-all ${device === 'desktop' ? 'bg-[#193704] text-lime-400 shadow-sm' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            title="Desktop Preview"
          >
            <LaptopIcon className="size-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveProject}
            disabled={isSaving || isGenerating}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2Icon size={14} className="animate-spin" /> : <SaveIcon size={14} />}
            <span className="hidden sm:inline">Save</span>
          </button>
          
          <Link
            target="_blank"
            to={isGenerating ? '#' : `/preview/${projectId}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-medium"
          >
            <EyeIcon size={14} />
            <span className="hidden sm:inline">Preview</span>
          </Link>

          <button
            onClick={downloadCode}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowBigDownDashIcon size={14} />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={handleTogglePublish}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-lime-400 text-black hover:bg-lime-500 transition-all text-xs font-semibold shadow-[0_0_10px_rgba(163,230,53,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <Loader2Icon size={14} className="animate-spin" />
            ) : isPublished ? (
              <EyeOffIcon size={14} />
            ) : (
              <PawPrint size={14} />
            )}
            <span className="hidden sm:inline">{isPublished ? 'Unpublish' : 'Publish'}</span>
          </button>

          {/* Mobile Menu Toggle for Chat */}
          <button 
            className="sm:hidden ml-2 p-1.5 rounded-md bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <XIcon size={18} /> : <MessageSquareIcon size={18} />}
          </button>
        </div>

      </header>

      {/* 2. MAIN EDITOR WORKSPACE */}
      <main className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Website Preview Area */}
        <section className={`flex-1 flex flex-col bg-black/20 p-2 sm:p-4 overflow-hidden relative ${isMenuOpen ? 'hidden sm:flex' : 'flex'}`}>
          <div className="flex-1 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-white relative">
            <ProjectPreview
              ref={previewRef}
              project={project?.project || project}
              isGenerating={isGenerating}
              device={device}
            />
          </div>
        </section>

        {/* Right Side: Fixed Chat Panel */}
        <aside className={`relative flex-none w-full sm:w-[400px] border-l border-white/10 bg-[#0a0a0a] flex flex-col overflow-hidden transition-all duration-300 ${!isMenuOpen ? 'hidden sm:flex' : 'flex'}`}>
          {selectedElement && (
            <EditorPanel
              selectedElement={selectedElement}
              onUpdate={handleUpdateElement}
              onClose={clearSelection}
            />
          )}
          <Sidebar
            isMenuOpen={false}
            project={project?.project || project}
            isGenerating={loading || isGenerating}
            setIsGenerating={setIsGenerating}
          />
        </aside>

      </main>

    </div>
  );
};

export default Projects;