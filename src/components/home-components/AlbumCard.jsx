import { Link } from "react-router-dom";

const AlbumCard = ({ to, imageSrc, title, date }) => {
  return (
    <Link
      to={to}
      className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
    >
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-3 text-center">
        <p className="font-semibold text-sm text-gray-700">{title}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </Link>
  );
};

export default AlbumCard;