import { Link } from "react-router-dom";

export default function Favorites() {
    return (
        <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">My Favorites</h1>
        <div className="p-8 text-center border rounded">
            <p className="text-gray-700">You have no favorites yet.</p>
            <p className="text-sm text-gray-500">Save products to find them faster later.</p>
            <Link to="/" className="inline-block mt-3 px-4 py-2 rounded bg-blue-600 text-white">Explore</Link>
        </div>
        </div>
    );
}
