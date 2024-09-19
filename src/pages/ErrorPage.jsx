import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-8">
      <img src="/assets/sn-complete-logo-gray.svg" alt="" />
      <h1 className="text-3xl font-bold">Oops!</h1>
      <p>¡Disculpá! Ocurrió un error inesperado.</p>
      <p className="text-gray-500">
        <i>{error.error.message || error.statusText}</i>
      </p>
    </div>
  );
}
