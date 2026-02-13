const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
};

export default Loader;
