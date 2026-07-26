export default function Searchbar({ searchTerm, setSearchTerm }) {
  return (
    <div className="w-full md:w-72">
      <input
        type="text"
        placeholder="Search auctions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white shadow-sm"
      />
    </div>
  );
}