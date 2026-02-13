const StayGallery = ({ images }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {images.slice(0, 4).map((img, i) => (
        <div key={i} className="relative w-full overflow-hidden rounded-3xl">
          <img
            src={img}
            alt="stay"
            className="h-44 w-full object-cover sm:h-52 md:h-48 lg:h-56"
          />
        </div>
      ))}
    </div>
  );
};

export default StayGallery;
