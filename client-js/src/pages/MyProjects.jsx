import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, getUserProject } from '../features/project/projectThunk'
import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { deleteProject } from '../features/projectactions/pActionThunk';
import toast from 'react-hot-toast'


const MyProjects = () => {
  const [loading, setLoading] = useState(true);
  const [pagee, setPagee] = useState(1)
  const dispatch = useDispatch();
// const [projects, setProjects ] = useState([]);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [toDelete, setToDelete] = useState(null);
  const { list, page, hasMore } = useSelector((state) => state.projects)

const handleFetchProjects = async () => {
     try{
              const result = await dispatch(
              fetchProjects({ pagee, limit: 3 })
            ).unwrap();
    
            } finally {  
              setLoading(false)
            } 
  };

  useEffect(() => {
    handleFetchProjects();
  }, [pagee]);

  const handleDeleteProject = (project) => {
  setToDelete(project);
  setShowDeleteModal(true);
  document.body.style.overflow = 'hidden';
};

const closeDeleteModal = () => {
  setShowDeleteModal(false);
  setToDelete(null);
  document.body.style.overflow = 'auto';
};

const handleConfirmDelete = () => {
 dispatch(deleteProject(toDelete._id))
  closeDeleteModal();
 handleFetchProjects()
         toast('Project Deleted!');
};
 


  return (
    <>
  <div className="px-4 md:px-16 mt-16 lg:px-24 xl:px-32 py-10 min-h-[80vh]">
    
    {loading ? (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2Icon className="size-7 animate-spin text-indigo-200" />
      </div>
    ) : list.length > 0 ? (
      <>
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Explore <br /> Your Creations
          </h2>
        </div>

        {/* Card Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {list.map((project) => (
    <div
      key={project._id}
      onClick={() =>  window.open(`/projects/${project._id}`, '_blank')}
      className="
        group relative cursor-pointer
        rounded-3xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        hover:border-lime-400/60
        transition-all duration-300
        hover:-translate-y-1
      "
    >
      {/* Floating Preview */}
      <div className="
        relative
        mx-4 mt-4
        h-36
        rounded-2xl
        overflow-hidden
        bg-black
        ring-1 ring-white/10
        shadow-[0_0_40px_rgba(163,230,53,0.15)]
      ">
        {project.current_code ? (
          <iframe
            srcDoc={project.current_code}
            className="absolute top-0 left-0 w-[1150px] h-[700px] origin-top-left pointer-events-none"
            sandbox="allow-scripts allow-same-origin"
            style={{ transform: 'scale(0.25)' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/40 text-sm">
            No Preview Available
          </div>
        )}

        {/* Lime overlay glow */}
        <div className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-t
          from-lime-400/10
          to-transparent
        " />
      </div>

      {/* Content */}
      <div className="px-5 pt-5 pb-4">
        <h5 className="
          text-white font-semibold
          text-base leading-snug
          line-clamp-2
        ">
          {project.name}
        </h5>

        <p className="
          text-white/60 text-sm
          mt-2 line-clamp-2
        ">
          {project.initial_prompt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between mt-4 text-xs text-white/40">
          <span>{new Date(project.createdAt).toDateString()}</span>

          <span className="
            px-3 py-1 rounded-full
            bg-lime-400/10
            text-lime-400
            border border-lime-400/20
          ">
            AI Project
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={(e) => {
              e.stopPropagation()
               window.open(`/preview/${project._id}`, '_blank');
            }}
            className="
              flex-1 py-2 rounded-xl
              bg-white/10
              text-white text-sm
              hover:bg-white/20
              transition
            "
          >
            Preview
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
               window.open(`/projects/${project._id}`, '_blank');
            }}
            className="
              flex-1 py-2 rounded-xl
              bg-lime-400
              text-black text-sm font-semibold
              shadow-[0_0_15px_rgba(163,230,53,0.5)]
              hover:bg-lime-300
              transition
            "
          >
            Open
          </button>
        </div>
      </div>

      {/* Delete (subtle, professional) */}
      <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => {
          e.stopPropagation()
          handleDeleteProject(project)
        }}
         className="
        bg-black/40 rounded-full p-2
          absolute top-4 right-4

          text-white/40
          hover:text-red-400
          transition
        "
         width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="m19.5 5.5l-.62 10.025c-.158 2.561-.237 3.842-.88 4.763a4 4 0 0 1-1.2 1.128c-.957.584-2.24.584-4.806.584c-2.57 0-3.855 0-4.814-.585a4 4 0 0 1-1.2-1.13c-.642-.922-.72-2.205-.874-4.77L4.5 5.5M3 5.5h18m-4.944 0l-.683-1.408c-.453-.936-.68-1.403-1.071-1.695a2 2 0 0 0-.275-.172C13.594 2 13.074 2 12.035 2c-1.066 0-1.599 0-2.04.234a2 2 0 0 0-.278.18c-.395.303-.616.788-1.058 1.757L8.053 5.5"/></svg>
     
    </div>
  ))}
</div>

      </>
    ) : (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-3xl font-semibold text-gray-300">
          You have no projects yet!
        </h1>
        <button
          onClick={() => navigate('/')}
          className="text-black font-extrabold px-5 py-3 mt-5 rounded-full bg-lime-500 hover:bg-lime-600 transition"
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
    disabled={page === 1}
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
      {page}
    </p> 

  <button
    onClick={() => setPagee(page + 1)}
    disabled={!hasMore}
    className={`px-6 py-4.5 rounded-full text-xs font-semibold
      border border-white/15 text-white/70 disabled:opacity-40 disabled:pointer-events-none
      hover:bg-[#0b1a00] hover:text-lime-400 `} 
  >
    Next
  </button>
</div>

  {showDeleteModal && toDelete && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Black backdrop */}
    <div
      className="absolute inset-0 bg-black/80"
      onClick={closeDeleteModal}
    />

    {/* Modal */}
    <div
      className="
        relative z-10 w-[360px]
        rounded-2xl
        bg-[#0b0b0b]
        border border-white/10
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        p-5
        text-white
        animate-fade-in
      "
    >
      <h3 className="text-sm font-semibold mb-3">
        Delete Project
      </h3>

      <div className="text-xs text-white/60 space-y-1 mb-4">
        <p>
          <span className="text-white/40">Name:</span>{' '}
          <span className="font-medium">{toDelete.name}</span>
        </p>
        <p>
          <span className="text-white/40">Published:</span>{' '}
          {toDelete.isPublished ? 'Yes' : 'No'}
        </p>
        <p>
          <span className="text-white/40">Created:</span>{' '}
          {new Date(toDelete.createdAt).toLocaleDateString()}
        </p>
      </div>

      <p className="text-xs text-red-400 mb-5">
        This action is permanent and cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={closeDeleteModal}
          className="
            px-3 py-1.5 rounded-full
            text-xs font-semibold
            text-white/60
            hover:text-white
          "
        >
          Cancel
        </button>

        <button
          onClick={handleConfirmDelete}
          className="
            px-4 py-1.5 rounded-full
            text-xs font-semibold
            bg-red-500/15
            text-red-400
            hover:bg-red-500/25
          "
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

  <Footer />
</>

  );
};

export default MyProjects;
