import { X, Heart, Code2, ExternalLink, Send, Loader2 } from "lucide-react";
import { addProjectComment, getProjectComment } from "../features/projectactions/pActionThunk";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const ProjectModal = ({
  project,
  isOpen,
  onClose,
  onPreview,
}) => {
  if (!isOpen || !project) return null;
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);
  const [comments, setComments] = useState([]);
  const dispatch = useDispatch()
  
    const { user } = useSelector((state) => state.auth)

    const downloadCode = () => {
    const code = project?.current_code;

    if (!code) return;

    const blob = new Blob([code], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'index.html';
    link.click();
    toast('Downloading Code!');
};

    const handlePostComment = async ()=>{
      const tempComment = {
        _id: `temp-${Date.now()}`, 
         content,
         userId: {_id: user._id, name: user.name},
  createdAt: new Date().toISOString(),
      };
      setComments((prev) => [tempComment, ...prev]);
    
      setContent('')
      setIsPosting(true)
      if(content.trim()){

      dispatch(addProjectComment({projectId: project._id, content: content}));
    
      } 
      setIsPosting(false)
    }

    const getComments = async () => {
     const result = await dispatch(getProjectComment({projectId: project._id})).unwrap();
     setComments(result.comments)
     setIsLoading(false)
    }

    useEffect(()=>{
      getComments()
    },[])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
  {/* Modal Container */}
  <div
    className="
      relative
      w-[95%] max-w-7xl h-[90vh]
      rounded-3xl
      bg-white/5 backdrop-blur-xl
      border border-white/10
      overflow-hidden
      flex flex-col lg:flex-row
      shadow-[0_0_80px_rgba(163,230,53,0.15)]
    "
  >
    {/* Close */}
    <button
      onClick={onClose}
      className="
        absolute top-4 right-4 z-20
        p-2 rounded-full
        bg-white/10 hover:bg-white/20
        transition
      "
    >
      <X className="size-5 text-white" />
    </button>

    {/* Left – Website Preview */}
    <div
      className="
        flex-1 relative
        bg-black
        border-b lg:border-b-0 lg:border-r
        border-white/10
      "
    >
      {project.current_code ? (
        <iframe
          srcDoc={project.current_code}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full pointer-events-none"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-white/40">
          No preview available
        </div>
      )}

      {/* Subtle lime glow */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-tr
          from-lime-400/10
          via-transparent
          to-transparent
        "
      />
    </div>

    {/* Right – Details */}
    <div className="w-full lg:w-[420px] flex flex-col">
      {/* Header */}
      <div
        className="
          flex items-center gap-3
          px-5 py-4
          border-b border-white/10
        "
      >
        <div
          className="
            size-9 rounded-full
            bg-lime-400/20
            ring-1 ring-lime-400/40
            flex items-center justify-center
            text-lime-400 font-semibold text-sm
          "
        >
          {project.userId?.name?.[0] || "U"}
        </div>

        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">
            {project.userId?.name || "Unknown User"}
          </p>
          <p className="text-xs text-white/40">
            {new Date(project.createdAt).toDateString()}
          </p>
        </div>
      </div>

      {/* Project Info */}
      <div className="px-5 py-4">
        <h3 className="text-white text-base font-semibold leading-snug">
          {project.name}
        </h3>
        <p className="text-white/50 text-sm mt-2 leading-relaxed">
          {project.initial_prompt}
        </p>
      </div>

      {/* Actions */}
      <div
        className="
          flex items-center justify-between
          px-5 py-3
          border-t border-b border-white/10
        "
      >

        <div className="flex gap-2">
          <button
            onClick={downloadCode}
            className="
              px-4 py-2 rounded-full
              bg-white/10 hover:bg-white/20
              text-white text-sm
              transition
            "
          >
            Get Code
          </button>

          <button
            onClick={onPreview}
            className="
              px-4 py-2 rounded-full
              bg-lime-400 text-black
              hover:bg-lime-300
              text-sm font-medium
              transition
            "
          >
            Preview
          </button>
        </div>
      </div>

      {/* Comments */}
<div className="flex-1 scrollbar-none overflow-y-auto px-5 py-4 space-y-4">
  {isLoading ? (
    /* Loading state */
    <div className="flex justify-center py-6">
      <div className="w-5 h-5 border-2 border-white/20 border-t-lime-400 rounded-full animate-spin" />
    </div>
  ) : comments.length === 0 ? (
    /* Empty state */
    <p className="text-sm text-white/40 text-center py-6">
      No comments yet
    </p>
  ) : (
    /* Comments list */
    comments.map((comment) => (
      <div key={comment._id}>
        <p className="text-sm text-white/90 leading-relaxed ">
          <span className=" font-bold">
            @{comment.userId.name}
          </span>{" "}
          <span className="text-white/60">
            - {comment.content}
          </span>
        </p>
      </div>
    ))
  )}
</div>


      {/* Add Comment */}
      <div
        className="
          px-4 py-3
          border-t border-white/10
          flex items-center gap-2
        "
      >
        <input
        onChange={(e)=>setContent(e.target.value)}
          placeholder="Add a comment..."
          value={content}
          className="
            flex-1 bg-transparent
            text-sm text-white
            placeholder-white/40
            outline-none
          "
        />
        <button
        onClick={handlePostComment}
        disabled={isPosting || !content.trim()}
          className="
            text-lime-400 hover:text-lime-300
            transition disabled:cursor-not-allowed disabled:pointer-events-none
          "
        >
          {isPosting ? <Loader2 className="size-4 animate-spin"/> : <Send className="size-4" /> }
          
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default ProjectModal;
