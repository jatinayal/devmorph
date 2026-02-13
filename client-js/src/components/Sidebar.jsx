import React, { useEffect, useRef, useState } from 'react'
import {
  BotIcon,
  Loader2Icon,
  SendIcon,
  UserRound
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { createProjectRevision, createProjectRevisionCode, switchProjectVersion } from '../features/projectactions/pActionThunk'
import { updateProjectLocal } from '../features/project/projectSlice'
import toast from 'react-hot-toast'

const Sidebar = ({
  isMenuOpen,
  project,
  setProject,
  isGenerating,
  setIsGenerating
}) => {
  const messageRef = useRef(null)
  const [input, setInput] = useState('')
  const dispatch = useDispatch()
  const [tempMessages, setTempMessages] = useState([]);
  
    const { projectId } = useParams();

  if (!project) return null

  const conversations = project.conversations || []
  const versions = project.versions || []
 

  const handleRollback = async (versionId) => {

    const result = await dispatch(switchProjectVersion({versionId:versionId,projectId:project._id})).unwrap();
       
     dispatch(updateProjectLocal(result.project))
     toast('Version Changed')
  }

  const handleRevision = async (e) => {
   try{
     e.preventDefault()
    if (!input.trim()) return

    setIsGenerating(true)
      setInput('')
      
     toast('Enhancing Prompt...')
     
  const tempUserMessage = {
  _id: `temp-${Date.now()}`,
  role: 'user',
  content: input,
  timestamp: new Date().toISOString(),
  isTemp: true,
};
setTempMessages(prev => [...prev, tempUserMessage]);

          const result = await dispatch(createProjectRevision({input,projectId:project._id})).unwrap();
         setTempMessages(prev => prev.filter(msg => !msg.isTemp));
       
     dispatch(updateProjectLocal(result.project))
     toast('Making Changes...')
     const codeResult = await dispatch(createProjectRevisionCode({enhanceResponse: result.enhanceResponse ,projectId:project._id})).unwrap();
         
     dispatch(updateProjectLocal(codeResult.project))
     setIsGenerating(false)
   } catch(error){
    toast("Error Generating")
    console.log(error)
   }
  }


  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations.length, versions.length, isGenerating])
 

const timeline = React.useMemo(() => {
  return [...conversations, ...versions, ...tempMessages].sort(
    (a, b) =>
      new Date(a.timestamp || a.createdAt) -
      new Date(b.timestamp || b.createdAt)
  ); 
}, [conversations, versions, tempMessages]);


  return (
    <div
      className={`
        h-full sm:max-w-sm
        rounded-2xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        transition-all duration-300
        ${isMenuOpen ? 'max-sm:w-0 overflow-hidden' : 'w-full'}
      `}
    >
      <div className="flex flex-col h-full">

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-4 scrollbar-none scrollbar-thin scrollbar-thumb-white/10">

         {timeline.map((item, index) => {
  // 🟣 VERSION ITEM
  if (item.code && !item.role) {
    return (
      <div
        key={item._id || index}
        className="flex justify-center my-4"
      >
        <div
          className={`
    px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition
    border backdrop-blur
    ${
      item.code === project.current_code
        ? 'bg-violet-500/30 text-violet-200 border-violet-400 ring-2 ring-violet-400/50 pointer-events-none'
        : 'bg-violet-500/10 text-violet-300 border-violet-500/30 hover:bg-violet-500/20'
    }
  `}
          onClick={() => {
            handleRollback(item._id)
          }}
        >
          {item.description || 'Version'}
        </div>
      </div>
    );
  }

  // 🟢 NORMAL CHAT MESSAGE
  if (!item.content) return null;

  return (
    <div
      key={index}
      className={`flex gap-3 ${
        item.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Avatar */}
      <div
        className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${item.role === 'user'
            ? 'order-2 bg-white/10'
            : 'order-1 bg-lime-400/20 ring-1 ring-lime-400/40'}
        `}
      >
        {item.role === 'user'
          ? <svg xmlns="http://www.w3.org/2000/svg" className='text-white/80 p-1' width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></g></svg>
          : <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-lime-400" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/></g></svg>
        }
      </div>

      {/* Bubble */}
      <div
        className={`
          max-w-[80%]
          px-4 py-2
          rounded-2xl
          text-sm leading-relaxed
          ${item.role === 'user'
            ? 'order-1 bg-lime-400 text-black shadow-[0_0_12px_rgba(163,230,53,0.5)]'
            : 'order-2 bg-white/10 text-white/90'}
        `}
      >
        {item.content}
      </div>
    </div>
  );
})}



          {isGenerating && (
            <div className="flex gap-3 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4 text-lime-400" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM11 6.094l-.806 2.36a6 6 0 0 1-3.49 3.649l-.25.091l-2.36.806l2.36.806a6 6 0 0 1 3.649 3.49l.091.25l.806 2.36l.806-2.36a6 6 0 0 1 3.49-3.649l.25-.09l2.36-.807l-2.36-.806a6 6 0 0 1-3.649-3.49l-.09-.25zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/></g></svg>
        <div className="flex gap-1">
                <span className="size-2 bg-lime-400/60 rounded-full animate-bounce" />
                <span className="size-2 bg-lime-400/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="size-2 bg-lime-400/60 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messageRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleRevision}
          className="relative bg-white/10 backdrop-blur-lg border border-white/15 rounded-2xl m-2 p-2 focus-within:ring-2 ring-lime-400/50 transition"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            disabled={isGenerating}
            placeholder="Describe your website or request changes..."
            className="w-full resize-none bg-transparent outline-none text-white placeholder:text-white/40"
          />

          <button
            disabled={isGenerating || !input.trim()}
            className="absolute bottom-3 right-3 rounded-full bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.6)] hover:bg-lime-300 transition disabled:opacity-40"
          >
            {isGenerating ? (
              <Loader2Icon className="size-7 p-1.5 animate-spin" />
            ) : (
              <SendIcon className="size-7 p-1.5" />
            )}
          </button>
        </form>

      </div>
    </div>
  )
}

export default Sidebar