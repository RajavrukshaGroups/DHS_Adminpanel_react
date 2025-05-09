import React from 'react'

function NomineePerticular({ formData, handleChange ,formErrors }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h2 className="text-xl font-bold mb-4">Nominees Particular</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="nomineeName"
            placeholder="Nominee Name"
            value={formData.nomineeName}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.nomineeName && <p className="text-red-500 text-sm">{formErrors.nomineeName}</p>}

        </div>
        <div>
          <label className="block font-medium mb-1">Age</label>
          <input
            type="number"
            name="nomineeAge"
            placeholder="Nominee Age"
            value={formData.nomineeAge}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.nomineeAge && <p className="text-red-500 text-sm">{formErrors.nomineeAge}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Relationship</label>
          <input
            type="text"
            name="nomineeRelationship"
            placeholder="Nominee Relationship"
            value={formData.nomineeRelationship}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.nomineeRelationship && <p className="text-red-500 text-sm">{formErrors.nomineeRelationship}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="nomineeAddress"
            placeholder="Nominee Address"
            value={formData.nomineeAddress}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
          />
          {formErrors.nomineeAddress && <p className="text-red-500 text-sm">{formErrors.nomineeAddress}</p>}
        </div>
      </div>
    </div>
  )
}

export default NomineePerticular
