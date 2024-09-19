/* eslint-disable react/prop-types */
const CustomInput = ({
  label,
  type,
  placeholder,
  name,
  value,
  handleChange,
  options,
  disabled,
}) => {
  return (
    <div className="flex flex-col">
      <label className="my-1" htmlFor={name}>
        {label}
      </label>
      {type === "select" ? (
        <select
          name={name}
          defaultValue="default"
          className="border p-3 rounded-md border-black"
          id={name}
          onChange={handleChange}
        >
          <option value="default" disabled>
            Seleccione
          </option>
          {options.map((opt) => (
            <option value={opt.id} key={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ""}
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
          className="border p-3 rounded-md border-black"
          id={name}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default CustomInput;
