import { Navigate } from "react-router-dom";
import { verifyUser } from "../helpers/verifyUser";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, verifyAdmin = false }) => {
  const isAuthenticated = verifyUser(verifyAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // Redirige si no está autenticado
  }

  return children; // Si está autenticado, muestra la página
};

export default ProtectedRoute;
