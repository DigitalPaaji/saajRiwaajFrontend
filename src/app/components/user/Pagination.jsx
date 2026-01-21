"use client"
const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-3 py-1 rounded border text-sm
          ${page === 1
            ? "cursor-not-allowed text-gray-400 border-gray-300"
            : "hover:bg-[#B67032] hover:text-white border-gray-400"
          }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded border text-sm
            ${page === p
              ? "bg-[#B67032] text-white border-[#B67032]"
              : "border-gray-400 hover:bg-gray-100"
            }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className={`px-3 py-1 rounded border text-sm
          ${page === pages
            ? "cursor-not-allowed text-gray-400 border-gray-300"
            : "hover:bg-[#B67032] hover:text-white border-gray-400"
          }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
