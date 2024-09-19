import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import LoginInput from "../components/LoginInput";
import NavBar from "../components/NavBar";
import scolarshipService from "../services/scolarships";
import loginService from "../services/login";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      "loggedScholarshipAppUser"
    );
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      scolarshipService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    scolarshipService.getAll().catch((error) => {
      if (error.message.includes("401")) {
        setUser(null);
        window.localStorage.removeItem("loggedScholarshipAppUser");
      }
    });
  }, [user]);

  const handleLogin = async (credentials) => {
    try {
      const response = await loginService.login(credentials);

      window.localStorage.setItem(
        "loggedScholarshipAppUser",
        JSON.stringify(response)
      );
      scolarshipService.setToken(response.token);
      setUser(response.user);

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-between">
      <NavBar />
      <div className="flex flex-col h-screen items-center justify-around">
        <img
          src="/assets/sn-complete-logo.svg"
          alt="Logo San Nicolás de los Arroyos"
          className="w-48"
        />
        <div className="w-3/4 md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">
            Inscripción a becas deportivas
          </h2>
          <p className="text-gray-600 text-justify text-pretty">
            En este sitio, tienes la oportunidad de aspirar a una beca deportiva
            o renovar tu beca actual completando un formulario con la
            información requerida.
          </p>
        </div>
        <LoginInput login={handleLogin} />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
