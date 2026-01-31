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

  return ( // main code
    <div className="flex flex-col h-screen w-full bg-black text-white">
      
      <div className="flex flex-1 scrollbar-none overflow-auto">
        <div className="flex pl-0">
          {/* Left side */}
          <div className='h-screen  p-2 w-4xl flex flex-col overflow-hidden max-sm:ml-2'>
            <div className="flex  flex-row w-full pb-1 bg-black text-white">
              <div className="flex  flex-1  gap-3 text-sm">
                {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" className='text-white' viewBox="0 0 24 24"><path fill="currentColor" d="m17.713 10.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319a4.37 4.37 0 0 0 2.251-2.326l.253-.611a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251M2.828 12l4.243 4.243l-1.414 1.414L0 12l5.657-5.657L7.07 7.757zm15.515 5.657L24 12l-2.83-2.828l-1.414 1.414L21.171 12l-4.242 4.243z"/></svg>
                           </Link>
          <button
            onClick={handleSaveProject}
            disabled={isSaving || isGenerating}
            className="inline-flex gap-2 items-center justify-center px-4 py-2 rounded-full 
  hover:bg-[#0b1a00] 
  hover:text-lime-400 font-semibold text-xs"
          >
            {isSaving ? (
              <Loader2Icon size={14} className="animate-spin" />
            ) : (
              <SaveIcon size={14} />
            )}
            Save
          </button>

          <Link
            target="_blank"
            to={isGenerating ? '#' : `/preview/${projectId}`}
            className="inline-flex gap-2 items-center justify-center px-4 py-2 rounded-full 
  hover:bg-[#0b1a00] 
  hover:text-lime-400 font-semibold text-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 2048 2048"><path fill="currentColor" d="M1664 1664v-384h128v512h-512v-128zM1280 256h512v512h-128V384h-384zM256 768V256h512v128H384v384zm128 512v384h384v128H256v-512z"/></svg> Preview
          </Link>

          <button
            onClick={downloadCode}
            disabled={isGenerating}
            className="inline-flex gap-2 items-center justify-center px-4 py-2  rounded-full 
  hover:bg-[#0b1a00] 
  hover:text-lime-400 font-semibold text-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g class="download-outline"><g fill="currentColor" fill-rule="evenodd" class="Vector" clip-rule="evenodd"><path d="M7 22a5 5 0 0 1-5-5v-3a1 1 0 1 1 2 0v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3a1 1 0 1 1 2 0v3a5 5 0 0 1-5 5z"/><path d="M17.715 10.9a1 1 0 0 1-.016 1.415l-4.5 4.4a1 1 0 0 1-1.398 0l-4.5-4.4a1 1 0 1 1 1.398-1.43l2.801 2.739V5a1 1 0 1 1 2 0v8.624l2.8-2.739a1 1 0 0 1 1.415.016Z"/></g></g></svg> Download
          </button>

          <button
            onClick={handleTogglePublish}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 justify-center px-4 py-2 rounded-full 
  hover:bg-[#0b1a00] 
  hover:text-lime-400 font-semibold text-xs"
          >
            {isPublishing ? (
  <Loader2Icon size={14} className="animate-spin" />
) : isPublished ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"><path d="M22 8s-4 6-10 6S2 8 2 8"/><path stroke-linejoin="round" d="m15 13.5l1.5 2.5m3.5-5l2 2M2 13l2-2m5 2.5L7.5 16"/></g></svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M21 12s-1-8-9-8s-9 8-9 8"/></g></svg>
)}


           
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>

        {/* Device switch */}
        <div className="hidden  sm:flex  gap-2 bg-gray-950 p-1.5 rounded-md ">
          
          <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setDevice('phone')}
            className={`p-1 rounded cursor-pointer ${
              device === 'phone' ? 'bg-[#193704]' : ''
            }`} width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="16" height="22" x="4" y="1" rx="3"/><path d="M10 19h4"/></g></svg>
          
          <svg xmlns="http://www.w3.org/2000/svg"  onClick={() => setDevice('tablet')}
            className={`p-1 rounded cursor-pointer ${
              device === 'tablet' ? 'bg-[#193704]' : ''
            }`} width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M18.29 4.89c-1.028-.138-2.383-.14-4.29-.14h-4c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812S3.025 6.705 2.89 7.71c-.138 1.028-.14 2.382-.14 4.289s.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812s.677-1.003.812-2.009c.138-1.028.14-2.382.14-4.289s-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008s-1.003-.677-2.009-.812m.199-1.487c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153h4.112c1.838 0 3.294 0 4.433.153M8.25 17a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75" clip-rule="evenodd"/></svg>
        
        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setDevice('desktop')}
            className={`p-1 rounded cursor-pointer ${
              device === 'desktop' ? 'bg-[#193704] ' : ''
            }`} width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M21 19a1 1 0 0 1 .117 1.993L21 21H3a1 1 0 0 1-.117-1.993L3 19zM19 4a2 2 0 0 1 1.995 1.85L21 6v10a2 2 0 0 1-1.85 1.995L19 18H5a2 2 0 0 1-1.995-1.85L3 16V6a2 2 0 0 1 1.85-1.995L5 4zm0 2H5v10h14z"/></g></svg>
          
        </div>
            </div>
            <ProjectPreview
            ref={previewRef}
            project={project?.project || project}
            isGenerating={isGenerating}
            device={device}
          />
          </div>
          
          {/* right side */}
<div className="flex flex-col h-screen  p-2 overflow-hidden">

  {/* Header */}
  <div className="flex-shrink-0 bg-black text-white">
    <div className="flex items-center gap-2 sm:min-w-90 px-2 py-1">
      <div className="max-w-xs flex gap-2">
        <AtSign />
        <p className="truncate pb-1" title={project?.project?.name || project?.name}>{project?.project?.name || project?.name}</p>
      </div>

      <div className="sm:hidden flex-1 flex justify-end">
        {isMenuOpen ? (
          <MessageSquareIcon
            className="size-6 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          />
        ) : (
          <XIcon
            className="size-6 cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          />
        )}
      </div>
    </div>
  </div>

  {/* Sidebar container */}
  <div className="flex-1 overflow-hidden">
    <Sidebar
      isMenuOpen={isMenuOpen}
      project={project?.project || project}
      // setProject={setProject}
      
      isGenerating={loading || isGenerating}
      setIsGenerating={setIsGenerating}
    />
  </div>

</div>

          
        </div>
      </div>
   

    </div>
  );
};

export default Projects;