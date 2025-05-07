import React from 'react'

function NomineePerticular({ formData, handleChange }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Nominees Particular</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="nomineeName"
            value={formData.nomineeName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Age</label>
          <input
            type="number"
            name="nomineeAge"
            value={formData.nomineeAge}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Relationship</label>
          <input
            type="text"
            name="nomineeRelationship"
            value={formData.nomineeRelationship}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="nomineeAddress"
            value={formData.nomineeAddress}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>
      </div>
    </div>
  )
}

export default NomineePerticular
