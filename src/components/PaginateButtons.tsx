import { cn } from "../lib/utils";

type PaginateButtonsProps = {
  currentPage: number;
  totalPages: number;
};
function PaginateButtons({ currentPage, totalPages }: PaginateButtonsProps) {
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="mx-auto max-w-96 flex flex-wrap gap-4 justify-center">
      {pageNumbers.map((num) => (
        <button
          className={cn(
            "bg-zinc-50 p-2 border border-zinc-950/15 rounded-md min-w-11 min-h-11",
            { "bg-emerald-500 text-emerald-50": num === currentPage },
          )}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

export default PaginateButtons;
