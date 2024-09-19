import { useEffect, useState } from "react";
import Files from "react-files";
// import axios from "axios";

// eslint-disable-next-line react/prop-types
export default function FileInput({ files, setFiles, setErrors }) {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  const handleChange = (newFiles) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      files: "",
    }));
    const totalFiles = [...files, ...newFiles];
    if (totalFiles.length > 2) {
      alert("Solo podés subir un máximo de 2 archivos.");
      return;
    }

    setFiles(totalFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const handleError = (error) => {
    if (error.code === 1) return alert("El tipo de archivo es inválido");
    if (error.code === 2) return alert("El archivo es demasiado grande");
  };

  const handleRemove = (index) => {
    // Elimina el archivo y su preview correspondiente
    // eslint-disable-next-line react/prop-types
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // Revocar la URL del objeto para liberar la memoria
    URL.revokeObjectURL(previews[index]);

    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <div className="col-span-2 mt-4">
      <label>
        Por favor, subí una foto del frente y otra del dorso de tu DNI*
      </label>
      <Files
        className="border p-3 rounded-md border-black cursor-pointer hover:bg-gray-100 transition-all"
        onChange={handleChange}
        onError={handleError}
        accepts={["image/jpeg", "image/png", "image/jpg"]}
        multiple
        maxFileSize={1000000}
        minFileSize={0}
        clickable
      >
        Arrastra archivos aquí o clickea para subir
        {previews.length > 0 && (
          <div className="mt-4">
            <div className="grid lg:grid-cols-2 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`preview ${index}`}
                    className="w-full h-auto hover:cursor-auto"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 hover:scale-110 transition-all"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Files>
    </div>
  );
}
