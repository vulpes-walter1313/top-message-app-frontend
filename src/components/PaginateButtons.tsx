import { cn } from "../lib/utils";

type PaginateButtonsProps = {
  currentPage: number;
  totalPages: number;
  setDesiredPage: React.Dispatch<React.SetStateAction<number>>;
};
function PaginateButtons({
  currentPage,
  totalPages,
  setDesiredPage,
}: PaginateButtonsProps) {
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="mx-auto flex max-w-96 flex-wrap justify-center gap-4">
      {pageNumbers.map((num) => (
        <button
          className={cn(
            "min-h-11 min-w-11 rounded-md border border-zinc-950/15 bg-zinc-50 p-2",
            { "bg-emerald-500 text-emerald-50": num === currentPage },
          )}
          onClick={() => setDesiredPage(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

export default PaginateButtons;
