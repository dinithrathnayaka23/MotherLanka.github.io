const ChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition z-50"
    >
      <i className="fas fa-comment-dots text-xl"></i>
    </button>
  );
};

export default ChatButton;
