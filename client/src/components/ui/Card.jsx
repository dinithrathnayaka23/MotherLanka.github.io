const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
