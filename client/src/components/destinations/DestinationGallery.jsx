const DestinationGallery = ({ images }) => {
  const fallbackImage = "/logoMotherLanka.png";
  const mainFallback = images[1] || images[2] || fallbackImage;

  const handleImageError = (fallback) => (event) => {
    if (!event?.currentTarget) return;
    if (event.currentTarget.src.endsWith(fallback)) return;
    event.currentTarget.src = fallback;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      
      {/* Main Image */}
      <div className="md:col-span-2 relative overflow-hidden rounded-3xl shadow-xl group">
        <img
          src={images[0]}
          alt="main"
          referrerPolicy="no-referrer"
          onError={handleImageError(mainFallback)}
          className="h-[320px] w-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Side Images */}
      <div className="grid grid-rows-2 gap-5">
        {images.slice(1, 3).map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-3xl shadow-xl group"
          >
            <img
              src={img}
              alt={`gallery-${i}`}
              referrerPolicy="no-referrer"
              onError={handleImageError(fallbackImage)}
              className="h-[150px] w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent"></div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DestinationGallery;
