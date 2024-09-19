import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/CustomInput";
import FileInput from "../components/FileInput";
import {
  getCategories,
  getClubs,
  getNeigborhoods,
  getSchools,
  getSports,
  getTowns,
} from "../services/getDbData";
import scolarshipService from "../services/scolarships";
import axios from "axios";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function FormPage() {
  const [schools, setSchools] = useState([]);
  const [towns, setTowns] = useState([]);
  const [neigborhoods, setNeigborhoods] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [sports, setSports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [inputValues, setInputValues] = useState({
    province: "Buenos Aires",
    department: "Partido de San Nicolás",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      "loggedScholarshipAppUser"
    );
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      setInputValues((prev) => ({
        ...prev,
        dni: user.user.dni,
      }));
      scolarshipService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schools, towns, neighborhoods, clubs, sports, categories] =
          await Promise.all([
            getSchools(),
            getTowns(),
            getNeigborhoods(),
            getClubs(),
            getSports(),
            getCategories(),
          ]);

        setSchools(schools);
        setTowns(towns);
        setNeigborhoods(neighborhoods);
        setClubs(clubs);
        setSports(sports);
        setCategories(categories);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const applicantDetails = [
    {
      label: "Nombre*",
      placeholder: "Nombre",
      type: "text",
      name: "name",
    },
    {
      label: "Apellido*",
      placeholder: "Apellido",
      type: "text",
      name: "lastname",
    },
    {
      label: "DNI*",
      placeholder: "DNI",
      type: "text",
      name: "dni",
      disabled: true,
    },
    {
      label: "Fecha de nacimiento*",
      placeholder: "AAAA/MM/DD",
      type: "date",
      name: "birthday",
    },
    {
      label: "Género*",
      placeholder: "Género",
      type: "select",
      name: "genre",
      options: [
        { name: "Femenino", id: 1 },
        { name: "Masculino", id: 2 },
      ],
    },
    {
      label: "Colegio*",
      placeholder: "Colegio",
      type: "select",
      name: "schoolId",
      options: schools,
    },
    {
      label: "Teléfono celular*",
      placeholder: "Ej: 3364123456",
      type: "text",
      name: "phone",
    },
    {
      label: "Email*",
      placeholder: "Email",
      type: "email",
      name: "email",
    },
  ];

  const addressInformation = [
    {
      label: "Provincia*",
      placeholder: "Provincia",
      type: "text",
      name: "province",
      disabled: true,
    },
    {
      label: "Partido*",
      placeholder: "Partido",
      type: "text",
      name: "department",
      disabled: true,
    },
    {
      label: "Localidad*",
      placeholder: "Localidad",
      type: "select",
      name: "townId",
      options: towns,
    },
    {
      label: "Barrio*",
      placeholder: "Barrio",
      type: "select",
      name: "neighborhoodId",
      options: neigborhoods,
    },
    {
      label: "Calle*",
      placeholder: "Calle",
      type: "text",
      name: "street",
    },
    {
      label: "Altura*",
      placeholder: "Altura",
      type: "number",
      name: "streetNumber",
    },
    {
      label: "Piso (opcional)",
      placeholder: "Piso",
      type: "number",
      name: "floor",
    },
    {
      label: "Departamento (opcional)",
      placeholder: "Departamento",
      type: "text",
      name: "apartment",
    },
    {
      label: "Entre calle 1 (opcional)",
      placeholder: "Entre calle 1",
      type: "text",
      name: "between1",
    },
    {
      label: "Entre calle 2 (opcional)",
      placeholder: "Entre calle 2",
      type: "text",
      name: "between2",
    },
    {
      label: "Observaciones (opcional)",
      placeholder: "Observaciones a tener en cuenta",
      type: "text",
      name: "observations",
    },
  ];

  const sportsScholarshipData = [
    {
      label: "Nombre del club o entidad deportiva*",
      placeholder: "Nombre del club o entidad deportiva",
      type: "select",
      name: "clubId",
      options: clubs,
    },
    {
      label: "Deporte*",
      placeholder: "Deporte",
      type: "select",
      name: "sportId",
      options: sports,
    },
    {
      label: "Categoría*",
      placeholder: "Categoría",
      type: "select",
      name: "categoryId",
      options: categories,
    },
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? Number(value) : value;
    setInputValues((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let formErrors = {};

    // Validar campos obligatorios
    const requiredFields = [
      "name",
      "lastname",
      "dni",
      "birthday",
      "genre",
      "schoolId",
      "phone",
      "email",
      "province",
      "department",
      "townId",
      "neighborhoodId",
      "street",
      "streetNumber",
    ];

    requiredFields.forEach((field) => {
      if (!inputValues[field]) {
        formErrors[field] = `Este campo es obligatorio`;
      }
    });

    // Validar que el DNI sea un número
    if (inputValues.dni && (isNaN(inputValues.dni) || inputValues.dni < 0)) {
      formErrors.dni = "El DNI debe ser un número válido";
    }

    // Validar que el teléfono tenga el formato correcto
    const phonePattern = /^[0-9]{10}$/;
    if (inputValues.phone && !phonePattern.test(inputValues.phone)) {
      formErrors.phone = "El teléfono debe tener 10 dígitos.";
    }

    // Validar que el email sea válido
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (inputValues.email && !emailPattern.test(inputValues.email)) {
      formErrors.email = "Por favor ingrese un email válido";
    }

    if (files.length < 2) {
      formErrors.files = "Por favor, suba 2 archivos";
    }

    // Validar la sección de beca si la fecha de nacimiento y el género están completos
    if (inputValues.birthday && inputValues.genre) {
      const requiredScholarshipFields = ["clubId", "sportId", "categoryId"];
      requiredScholarshipFields.forEach((field) => {
        if (!inputValues[field]) {
          formErrors[field] = `Este campo de la beca es obligatorio`;
        }
      });
    }

    // Validar campos opcionales en caso de ser completados
    if (
      inputValues.floor &&
      (isNaN(inputValues.floor) || inputValues.floor < 0)
    ) {
      formErrors.floor = "Debe ser un número válido";
    }
    if (inputValues.apartment?.length > 10) {
      formErrors.apartment = "Demasiado largo (máximo 10 caracteres)";
    }
    if (inputValues.between1?.length > 30) {
      formErrors.between1 = "Demasiado largo (máximo 30 caracteres)";
    }
    if (inputValues.between2?.length > 30) {
      formErrors.between2 = "Demasiado largo (máximo 30 caracteres)";
    }
    if (inputValues.observations?.length > 254) {
      formErrors.observations =
        "Observación demasiado larga (máximo 255 caracteres)";
    }

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Guardar los errores en el estado
      return;
    }

    // Aquí puedes enviar los archivos al backend
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("file", file);
    });

    MySwal.fire({
      title: "Solicitando beca...",
      text: "Por favor, espera mientras procesamos tu solicitud.",
      allowOutsideClick: false,
      didOpen: () => {
        MySwal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        "http://localhost:3001/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status !== 200) {
        return alert(
          "Ocurrió un error con los archivos, por favor, intente nuevamente"
        );
      }
      const newInputValues = {
        ...inputValues,
        dniFront: response.data.ftpPaths[0],
        dniBack: response.data.ftpPaths[1],
      };

      setInputValues(newInputValues);

      const scolarshipResponse = await scolarshipService.create(newInputValues);
      console.log(scolarshipResponse);

      MySwal.fire({
        icon: "success",
        title: "Solicitud enviada",
        text: "Tu solicitud de beca ha sido enviada con éxito.",
      });
      navigate("/admin");
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error, intenta nuevamente.",
      });
    }
  };

  return (
    <>
      <NavBar />
      {isLoading ? (
        <div className="m-12 border p-12 rounded-lg shadow-md">
          <p className="text-center">Preparando formulario</p>
        </div>
      ) : (
        <div className="p-4 flex flex-col lg:w-3/4 m-auto">
          <div className="flex justify-between">
            <button
              className="w-8"
              onClick={() => {
                window.localStorage.removeItem("loggedScholarshipAppUser");
                navigate(-1);
              }}
            >
              <img src="/assets/left-arrow.svg" alt="" />
            </button>
            <button
              className="bg-sn-blue p-2 text-white text-sm rounded-md"
              onClick={() => navigate("/admin")}
            >
              Ver mis becas
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4">
            Inscripción a Becas Deportivas
          </h2>
          <div>
            <h3 className="text-gray-600 font-semibold mb-2">
              Datos del aspirante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {applicantDetails.map((input) => (
                <div key={input.name}>
                  <CustomInput
                    label={input.label}
                    type={input.type}
                    value={inputValues[input.name]}
                    name={input.name}
                    placeholder={input.placeholder}
                    handleChange={handleChange}
                    options={input.options}
                    disabled={input.disabled}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm">{errors[input.name]}</p>
                  )}
                </div>
              ))}
            </div>
            <FileInput
              files={files}
              setFiles={setFiles}
              setErrors={setErrors}
            />
            {errors.files && (
              <p className="text-red-500 text-sm">{errors.files}</p>
            )}

            <h3 className="text-gray-600 font-semibold mb-2 mt-6">
              Información de Domicilio
            </h3>
            <div className="grid md:grid-cols-2 gap-2">
              {addressInformation.map((input) => (
                <div key={input.name}>
                  <CustomInput
                    label={input.label}
                    type={input.type}
                    value={inputValues[input.name]}
                    name={input.name}
                    placeholder={input.placeholder}
                    handleChange={handleChange}
                    options={input.options}
                    disabled={input.disabled}
                  />
                  {errors[input.name] && (
                    <p className="text-red-500 text-sm">{errors[input.name]}</p>
                  )}
                </div>
              ))}
            </div>
            <h3 className="text-gray-600 font-semibold mb-2 mt-6">
              Datos de la beca{" "}
              <span className="text-xs">
                (*tener en cuenta completar fecha de nacimiento y género para
                activar esta sección)
              </span>
            </h3>
            {inputValues.birthday && inputValues.genre && (
              <div className="grid gap-2">
                {sportsScholarshipData.map((input) => (
                  <div key={input.name}>
                    <CustomInput
                      label={input.label}
                      type={input.type}
                      value={inputValues[input.name]}
                      name={input.name}
                      placeholder={input.placeholder}
                      handleChange={handleChange}
                      options={input.options}
                    />
                    {errors[input.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[input.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className={`bg-sn-blue mt-4 p-3 rounded-sm text-white font-semibold`}
            onClick={handleSubmit}
          >
            Inscribirse
          </button>
          {Object.keys(errors).length > 0 && (
            <p className="text-red-500 text-sm text-center">
              Por favor, complete todos los campos obligatorios
            </p>
          )}
        </div>
      )}
    </>
  );
}
