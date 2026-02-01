const View = () => {
  const { projectId } = useParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchCode = async () => {
    try {
      const {
        project: { code }
      } = await dispatch(getPublishedProject({ projectId })).unwrap();

      setCode(code);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCode();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-200" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      {code && (
        <ProjectPreview
          project={{ current_code: code }}
          isGenerating={false}
          showEditorPanel={false}
        />
      )}
    </div>
  );
};
