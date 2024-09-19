/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import scolarshipService from "../services/scolarships";

import NavBar from "../components/NavBar";
import { getUsers } from "../services/getDbData";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const ImageDisplay = ({ dniFront, dniBack }) => {
  const imageBaseUrl = "http://localhost:3001/api/upload/";

  return (
    <div className="flex">
      <img
        src={`${imageBaseUrl}${dniFront.split("/uploads/")[1]}`}
        alt="Foto de DNI"
        className=""
      />
      <img
        src={`${imageBaseUrl}${dniBack.split("/uploads/")[1]}`}
        alt="Foto de DNI"
      />
    </div>
  );
};

export default function ScholarshipAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scholarships, setScholarships] = useState([]);
  const [users, setUsers] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loggedUserJSON = window.localStorage.getItem(
    "loggedScholarshipAppUser"
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Todas");

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      "loggedScholarshipAppUser"
    );
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      scolarshipService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    getUsers().then((res) => {
      setUsers(res);
    });
    scolarshipService.getAll().then((res) => {
      setScholarships(res);
    });
  }, []);

  useEffect(() => {
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      setIsAdmin(user?.user.role === "admin");
      setLoggedUserId(user?.user.id);
    }
  }, [loggedUserJSON]);

  const filteredUsers = users.filter((user) =>
    user.dni.toString().includes(searchTerm)
  );

  const handleStatusChange = async (scholarshipId, newStatus) => {
    await scolarshipService.changeStatus(scholarshipId, newStatus);

    setScholarships(
      scholarships.map((scholarship) =>
        scholarship.id === scholarshipId
          ? { ...scholarship, status: newStatus }
          : scholarship
      )
    );
  };

  const handleAddComment = async (scholarshipId) => {
    const comment = newComments[scholarshipId];
    if (!comment) return;

    await scolarshipService.addComment(scholarshipId, comment);

    if (comment && comment.trim()) {
      setScholarships(
        scholarships.map((scholarship) =>
          scholarship.id === scholarshipId
            ? {
                ...scholarship,
                comments: (scholarship.comments += comment.trim() + "|"),
              }
            : scholarship
        )
      );
      setNewComments({ ...newComments, [scholarshipId]: "" });
    }
  };

  const openScholarshipDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setIsModalOpen(true);
  };

  // Filtrar las becas según el filtro de estado seleccionado
  const filteredScolarships = scholarships.filter((scholarship) => {
    if (filterStatus === "Todas") return true;
    return scholarship.status === filterStatus;
  });

  return (
    <>
      <NavBar />

      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <button
            className="w-8"
            onClick={() => {
              window.localStorage.removeItem("loggedScholarshipAppUser");
              navigate(-1);
            }}
          >
            <img src="/assets/left-arrow.svg" alt="" />
          </button>
          {!isAdmin && (
            <button
              className="bg-sn-blue p-2 text-white text-sm rounded-md"
              onClick={() => navigate("/inscripcion")}
            >
              Solicitar beca
            </button>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-4">Administración de becas</h1>
        {isAdmin && (
          <div className="flex justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Buscar usuario por DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded mb-4"
            >
              <option value="Todas">Todas</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aceptada">Aceptada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
          </div>
        )}
        {isAdmin ? (
          // Mostrar todas las becas para administradores
          filteredUsers.map((user) =>
            user.dni === 40668973 ? null : (
              <div
                key={user.id}
                className="mb-6 bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div className="bg-gray-100 px-4 py-2">
                  <h2 className="text-xl font-semibold">DNI: {user.dni}</h2>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Beca</th>
                        <th className="px-4 py-2 text-left">Estado</th>
                        <th className="px-4 py-2 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredScolarships
                        .filter((scholarship) => scholarship.userId === user.id)
                        .map((scholarship) => (
                          <tr key={scholarship.id} className="border-t">
                            <td className="px-4 py-2">
                              {scholarship.sport.name} - {scholarship.club.name}
                            </td>
                            <td className="px-4 py-2">
                              <select
                                value={scholarship.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    scholarship.id,
                                    e.target.value
                                  )
                                }
                                className={`p-1 border ${
                                  scholarship.status === "Pendiente"
                                    ? "border-yellow-400"
                                    : scholarship.status === "Rechazada"
                                    ? "border-red-600"
                                    : "border-green-600"
                                } rounded`}
                              >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Aceptada">Aceptada</option>
                                <option value="Rechazada">Rechazada</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 flex flex-col">
                              <button
                                onClick={() =>
                                  openScholarshipDetails(scholarship)
                                }
                                className="px-4 py-2 text-sn-blue hover:underline self-end"
                              >
                                Ver detalles
                              </button>
                              <textarea
                                placeholder="Agregar comentario..."
                                value={newComments[scholarship.id] || ""}
                                onChange={(e) => {
                                  if (
                                    e.target.value === "|" ||
                                    e.target.value.includes("|")
                                  )
                                    return;
                                  setNewComments({
                                    ...newComments,
                                    [scholarship.id]: e.target.value,
                                  });
                                }}
                                className="w-full p-2 mt-2 border border-gray-300 rounded resize-none"
                              />
                              <button
                                onClick={() => handleAddComment(scholarship.id)}
                                className="bg-sn-blue text-white px-4 py-2 rounded hover:bg-sn-blue/80"
                              >
                                Agregar comentario
                              </button>
                              {scholarship.comments?.length > 0 && (
                                <div className="mt-2">
                                  <strong>Comentarios:</strong>
                                  <ul className="list-disc pl-5">
                                    {scholarship.comments
                                      .substring(
                                        0,
                                        scholarship.comments.length - 1
                                      )
                                      .split("|")
                                      .map((comment, index) => (
                                        <li key={index}>{comment}</li>
                                      ))}
                                  </ul>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )
        ) : (
          <div className="mb-6 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2">
              <h2 className="text-xl font-semibold">Mis Becas</h2>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Beca</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {scholarships
                    .filter(
                      (scholarship) => scholarship.userId === loggedUserId
                    )
                    .map((scholarship) => (
                      <tr key={scholarship.id} className="border-t">
                        <td className="px-4 py-2">
                          {scholarship.sport.name} - {scholarship.club.name}
                        </td>
                        <td className="px-4 py-2">{scholarship.status}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => openScholarshipDetails(scholarship)}
                            className="px-4 py-2 text-sn-blue hover:underline"
                          >
                            Ver detalles
                          </button>
                          {scholarship.comments?.length > 0 && (
                            <div className="mt-2">
                              <strong>Comentarios:</strong>
                              <ul className="list-disc pl-5">
                                {scholarship.comments
                                  .substring(0, scholarship.comments.length - 1)
                                  .split("|")
                                  .map((comment, index) => (
                                    <li key={index}>{comment}</li>
                                  ))}
                              </ul>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedScholarship && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-sn-blue">
                {selectedScholarship.sport.name} -{" "}
                {selectedScholarship.club.name}
              </h2>
              <h3 className="text-xl font-bold mb-4">Datos del aplicante</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p>
                  <strong>Nombre:</strong> {selectedScholarship.name}{" "}
                  {selectedScholarship.lastname}
                </p>
                <p>
                  <strong>Fecha de nacimiento: </strong>
                  {new Date(selectedScholarship.birthday).toLocaleDateString()}
                </p>
                <p>
                  <strong>DNI:</strong> {selectedScholarship.dni}
                </p>
                <p>
                  <strong>Género:</strong> {selectedScholarship.genre}
                </p>
                <p className="md:col-span-2">
                  <strong>Contacto:</strong>{" "}
                  <a
                    href={`tel:${selectedScholarship.phone}`}
                    className="text-sn-blue hover:underline"
                  >
                    {selectedScholarship.phone}
                  </a>{" "}
                  -{" "}
                  <a
                    href={`mailto:${selectedScholarship.email}`}
                    className="text-sn-blue hover:underline"
                  >
                    {selectedScholarship.email}
                  </a>
                </p>
              </div>
              <h3 className="text-xl font-bold my-4">Datos del domicilio</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p>
                  <strong>Localidad:</strong> {selectedScholarship.town.name}
                </p>
                <p>
                  <strong>Barrio:</strong>{" "}
                  {selectedScholarship.neighborhood.name}
                </p>
                <p>
                  <strong>Domicilio:</strong> {selectedScholarship.street}{" "}
                  {selectedScholarship.streetNumber}{" "}
                  {selectedScholarship.floor
                    ? `- ${selectedScholarship.floor}`
                    : ""}{" "}
                  {selectedScholarship.apartment
                    ? `- ${selectedScholarship.apartment}`
                    : ""}
                </p>
                {selectedScholarship.observations && (
                  <p className="md:col-span-2">
                    <strong>Observaciones:</strong>{" "}
                    {selectedScholarship.observations}
                  </p>
                )}
              </div>
              <h3 className="text-xl font-bold my-4">Datos de la beca</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p>
                  <strong>Fecha de solicitud: </strong>
                  {new Date(selectedScholarship.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Estado:</strong> {selectedScholarship.status}{" "}
                  {selectedScholarship.status === "Pendiente"
                    ? "🕐"
                    : selectedScholarship.status === "Aceptada"
                    ? "✅"
                    : "❌"}
                </p>
                <p>
                  <strong>Colegio:</strong> {selectedScholarship.school.name}
                </p>
                <p>
                  <strong>Club: </strong> {selectedScholarship.club.name}
                </p>
                <p>
                  <strong>Deporte: </strong> {selectedScholarship.sport.name}
                </p>
                <p>
                  <strong>Categoría:</strong>{" "}
                  {selectedScholarship.category.name}
                </p>
              </div>

              <h3 className="text-xl font-bold mt-4 mb-2">Archivos</h3>
              <ImageDisplay
                dniBack={selectedScholarship.dniBack}
                dniFront={selectedScholarship.dniFront}
              />
              <h3 className="text-xl font-bold mt-4 mb-2">Comentarios</h3>
              {selectedScholarship.comments?.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedScholarship.comments
                    .substring(0, selectedScholarship.comments.length - 1)
                    .split("|")
                    .map((comment, index) => (
                      <li key={index}>{comment}</li>
                    ))}
                </ul>
              ) : (
                <p>Sin comentarios por el momento.</p>
              )}
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
