import { Link } from "react-router-dom";
import Button from "./Button";

const EmptyState = ({
  title,
  description,
  actionLabel,
  actionTo = "/",
}) => {
  return (
    <div className="py-20 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-textDark">{title}</h2>
      <p className="mt-3 text-gray-600 max-w-xl mx-auto">{description}</p>
      <div className="mt-6 flex justify-center">
        <Link to={actionTo}>
          <Button size="md">{actionLabel}</Button>
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
