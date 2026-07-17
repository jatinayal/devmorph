import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux';
import { getAllProject } from '../features/project/projectThunk'
import { Loader2Icon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ProjectModal from '../components/ProjectModal';

const Community = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
    const [pagee, setPagee] = useState(1)
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const iframeRefs = useRef([]);

  const fetchProjects = async () => {
     try{
              const result = await dispatch(
              getAllProject({ pagee, limit: 3 })
            ).unwrap();
    
            setProjects(result.projects)
            } finally {
              setLoading(false)
            }
  };

  useEffect(() => {
    fetchProjects();
  }, [pagee]);
   useEffect(() => {
    
        toast('View mode only');
  }, []);

  // Stop all iframes when modal opens
  useEffect(() => {
    if (isModalOpen) {
      // Stop all iframes by replacing srcDoc with empty content
      iframeRefs.current.forEach((iframe) => {
        if (iframe && iframe.contentWindow) {
          // Replace the iframe with a placeholder
          const placeholder = document.createElement('div');
          placeholder.className = 'flex items-center justify-center h-full text-gray-400';
          placeholder.textContent = 'Preview paused';
          
          iframe.parentNode.replaceChild(placeholder, iframe);
        }
      });
    } else {
      // Reset iframeRefs array when modal closes
      iframeRefs.current = [];
    }
  }, [isModalOpen]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Reset project after modal closes to prevent stale state
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <div className="px-4 md:px-16 mt-16 lg:px-24 xl:px-32 py-10 min-h-[80vh]">
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2Icon className="size-7 animate-spin text-indigo-200" />
          </div>
        ) : projects.length > 0 ? (
          <>
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                MorphSpace
              </h2>
            </div>

            {/* Community Card Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {projects.map((project, index) => (
  <div
    key={project._id}
    onClick={() => handleProjectClick(project)}
    className="
      group cursor-pointer
      rounded-2xl
      bg-white/5 backdrop-blur-xl
      border border-white/10
      hover:border-lime-400/50
      transition-all duration-300 ease-out
      hover:-translate-y-1
      hover:shadow-[0_10px_40px_rgba(163,230,53,0.12)]
      overflow-hidden
    "
  >
    {/* Header */}
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="
          w-8 h-8 rounded-full
          bg-lime-400/15
          ring-1 ring-lime-400/30
          flex items-center justify-center
          text-lime-400 font-medium text-xs
        ">
          {project.userId?.name?.charAt(0).toUpperCase()}
        </div>

        <span className="text-white/80 text-sm font-medium truncate">
          {project.userId?.name || 'Anonymous'}
        </span>
      </div>
    </div>

    {/* Preview */}
    <div className="
      relative mx-4
      aspect-video
      rounded-xl
      overflow-hidden
      bg-black
      ring-1 ring-white/5
    ">
      {project.current_code && !isModalOpen ? (
        <iframe
          ref={(el) => (iframeRefs.current[index] = el)}
          srcDoc={project.current_code}
          className="absolute top-0 left-0 origin-top-left pointer-events-none border-none"
          sandbox="allow-scripts allow-same-origin"
          style={{ width: '400%', height: '400%', transform: 'scale(0.25)' }}
          title={`Community project preview - ${project.name}`}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-white/40 text-xs">
          {project.current_code ? 'Preview paused' : 'No preview'}
        </div>
      )}

      {/* Subtle hover wash */}
      <div className="
        absolute inset-0 pointer-events-none
        bg-lime-400/10
        opacity-0 group-hover:opacity-100
        transition
      " />
    </div>

    {/* Project name */}
    <div className="px-4 pt-4">
      <h5 className="
        text-white
        text-sm font-semibold
        leading-snug
        line-clamp-2
      ">
        {project.name}
      </h5>
    </div>

    {/* Footer */}
    <div className="px-4 py-3 flex justify-end">
      <span className="
        text-lime-400 text-xs font-medium
        opacity-0 translate-y-1
        group-hover:opacity-100 group-hover:translate-y-0
        transition
      ">
        Open →
      </span>
    </div>
  </div>
))}

</div>

          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-3xl font-semibold text-gray-300">
              No projects found
            </h1>
            <button
              onClick={() => navigate('/')}
              className="text-white px-5 py-2 mt-5 rounded-full bg-lime-500/50 hover:bg-lime-600 transition"
            >
              Create New
            </button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
<div className="flex items-center justify-center gap-2 mt-6">
  <button
    onClick={() => setPagee((p) => Math.max(p - 1, 1))}
    disabled={pagee === 1}
    className={`px-6 py-4.5 rounded-full text-xs font-semibold
      border border-white/15 text-white/70
      hover:bg-[#0b1a00] hover:text-lime-400
      disabled:opacity-40 disabled:pointer-events-none`}
  >
    Prev
  </button>
    <p
      className={`px-5.5 py-4.5 rounded-full text-xs font-semibold
        border border-white/15 text-white/70 hover:bg-[#0b1a00] hover:text-lime-400`}
    >
      {pagee}
    </p> 

  <button
    onClick={() => setPagee(pagee + 1)}
    disabled={projects.length === 0}
    className={`px-6 py-4.5 rounded-full text-xs font-semibold
      border border-white/15 text-white/70 disabled:opacity-40 disabled:pointer-events-none
      hover:bg-[#0b1a00] hover:text-lime-400 `} 
  >
    Next
  </button>
</div>

      {/* Single ProjectModal outside the grid */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onPreview={() => window.open(`/view/${selectedProject?._id}`, "_blank")}
      />

      <Footer />
    </>
  );
};

export default Community;