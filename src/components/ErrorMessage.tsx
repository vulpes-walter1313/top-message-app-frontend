type ErrorMessageProps = {
  message?: string;
};
function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="w-full rounded-md bg-red-100 p-4 shadow-sm">
      <p className="text-mobxsp text-red-950 lg:text-deskxsp">{message}</p>
    </div>
  );
}

export default ErrorMessage;
