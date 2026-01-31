import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { iframeScript } from '../assets/assets'
import EditorPanel from './EditorPanel'
import { Loader2Icon } from 'lucide-react'

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} initial_prompt
 * @property {string} current_code
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} userId
 * @property {boolean} [isPublished]
 * @property {string} current_version_index
 * @property {Array<any>} conversation
 * @property {Array<any>} versions
 */

/**
 * @typedef {Object} ProjectPreviewRef
 * @property {() => (string | undefined)} getCode
 */

/**
 * @param {{
 *  project: Project,
 *  isGenerating: boolean,
 *  device?: 'phone' | 'tablet' | 'desktop',
 *  showEditorPanel?: boolean
 * }} props
 * @param {React.Ref<ProjectPreviewRef>} ref
 */
const ProjectPreview = forwardRef(
  (
    {
      project,
      isGenerating,
      device = 'desktop',
      showEditorPanel = true
    },
    ref
  ) => {
    const iframeRef = useRef(null)
    const [selectedElement, setSelectedElement] = useState(null)
    const loadingTexts = [
  'Creating your website…',
  'Adding AI magic…',
  'Designing layouts…',
  'Optimizing components…',
  'Almost there…',
  'This usually takes 5–10 minutes'
];

const [loadingTextIndex, setLoadingTextIndex] = useState(0);

    const resolutions = {
      phone: 'w-[412px]',
      tablet: 'w-[768px]',
      desktop: 'w-[1200px] w-full'
    }

    useImperativeHandle(ref, () => ({
      getCode: () => {
        const doc = iframeRef.current?.contentDocument
        if (!doc) return undefined

        doc
          .querySelectorAll('.ai-selected-element,[data-ai-selected]')
          .forEach((el) => {
            el.classList.remove('ai-selected-element')
            el.removeAttribute('data-ai-selected')
            el.style.outline = ''
          })

        doc.getElementById('ai-preview-style')?.remove()
        doc.getElementById('ai-preview-script')?.remove()

        return doc.documentElement.outerHTML
      }
    }))

    useEffect(() => {
  if (!isGenerating) return;

  const interval = setInterval(() => {
    setLoadingTextIndex((i) => (i + 1) % loadingTexts.length);
  }, 3000);

  return () => clearInterval(interval);
}, [isGenerating]);


    useEffect(() => {
      const handleMessage = (event) => {
        if (event.data?.type === 'ELEMENT_SELECTED') {
          setSelectedElement(event.data.payload)
        } else if (event.data?.type === 'CLEAR_SELECTION') {
          setSelectedElement(null)
        }
      }

      window.addEventListener('message', handleMessage)
      return () => window.removeEventListener('message', handleMessage)
    }, [])

    const handleUpdate = (updates) => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'UPDATE_ELEMENT',
          payload: updates
        },
        '*'
      )
    }

    const injectPreview = (html) => {
      if (!html) return ''
      if (!showEditorPanel) return html

      return html.includes('</body>')
        ? html.replace('</body>', iframeScript + '</body>')
        : html + iframeScript
    }

    return (
      <div className="flex-1 h-full w-full">
        {project.current_code ? (
          <>
            <iframe
              ref={iframeRef}
              srcDoc={injectPreview(project.current_code)}
              className={`h-full ${resolutions[device]} mx-auto`}
            />

            {showEditorPanel && selectedElement && (
              <EditorPanel
                selectedElement={selectedElement}
                onUpdate={handleUpdate}
                onClose={() => {
                  setSelectedElement(null)
                  iframeRef.current?.contentWindow?.postMessage(
                    { type: 'CLEAR_SELECTION_REQUEST' },
                    '*'
                  )
                }}
              />
            )}
          </>
        ) : (
          isGenerating && <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-indigo-200">
  <Loader2Icon className="size-7 animate-spin text-lime-600" />

  <p
    key={loadingTextIndex}
    className="text-sm font-medium tracking-wide text-indigo-200 animate-fade-in"
  >
    {loadingTexts[loadingTextIndex]}
  </p>
</div>

        )}
      </div>
    )
  }
)

export default ProjectPreview
