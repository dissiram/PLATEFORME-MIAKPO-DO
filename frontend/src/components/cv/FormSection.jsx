import React from "react";

const FormSection = ({ section, data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData(section, { ...data, [name]: value });
  };

  return (
    <div className="mb-6 p-6 rounded-lg shadow-md bg-white">
      <h3 className="font-bold text-2xl mb-4 text-gray-700">{section}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(data).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="block font-medium mb-1 text-gray-600">{key}</label>
            <input
              type="text"
              name={key}
              value={data[key]}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormSection;
