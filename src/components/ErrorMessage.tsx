type ErrorMessageProps = {
  message?: string;
};
function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="w-full rounded-md shadow-sm bg-red-100 p-4">
      <p className="text-mobxsp lg:text-deskxsp text-red-950">{message}</p>
    </div>
  );
}

export default ErrorMessage;
