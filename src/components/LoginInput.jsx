import { useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const LoginInput = ({ login }) => {
  const [dni, setDni] = useState("");
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (!dni) return setErrorText("Ingrese un número de documento válido.");
    if (dni > 100000000)
      return setErrorText("El dni no puede ser mayor a 100.000.000");
    if (dni < 3000000)
      return setErrorText("El dni no puede ser menor a 3.000.000");

    const { user } = await login(dni);

    if (user.role === "admin") return navigate("/admin");
    return navigate("/inscripcion");
  };

  const handleChange = (e) => {
    setDni(e.target.value);
    setErrorText("");
  };

  return (
    <div className="w-3/4 md:w-1/2">
      <h3 className="text-xl font-semibold mb-4">Inscripción/renovación</h3>
      <form className="flex flex-col">
        <label className="mb-1">Ingrese su DNI</label>
        <input
          type="number"
          placeholder="DNI"
          className={`border p-3 rounded-md border-black ${
            errorText ? "border-red-600 focus:outline-none" : ""
          }`}
          value={dni}
          onChange={handleChange}
        />
        {errorText && (
          <span className="text-red-600 text-xs py-2">{errorText}</span>
        )}
        <button
          onClick={handleClick}
          className={`bg-sn-blue mt-2 p-3 rounded-sm text-white font-semibold`}
        >
          Inscribirse
        </button>
      </form>
    </div>
  );
};

export default LoginInput;
