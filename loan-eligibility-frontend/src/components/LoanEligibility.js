import { useState } from "react";

export default function LoanEligibility() {
  const [formData, setFormData] = useState({
    "Credit Score": "",
    "Annual Income": "",
    "Employment Status": "",
    "Existing Loans": "",
    "Debt-to-Income Ratio": "",
    "Savings": "",
  });

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);

  // Function to add a field to formData dynamically
  const addField = () => {
    if (key && value) {
      setFormData({ ...formData, [key]: value }); // Dynamically add key-value pairs
      setKey(""); // Clear field name input
      setValue(""); // Clear field value input
    }
  };

  // Function to check eligibility
  const checkEligibility = async () => {
    const response = await fetch("http://localhost:8000/loan-eligibility/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_data: formData }), // Send data to backend
    });
    const data = await response.json();
    setResult(data); // Set result after receiving response from backend
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Loan Eligibility Checker</h1>

      <div className="mb-4 p-4 border rounded">
        <div className="space-y-2">
          {Object.keys(formData).map((field) => (
            <div key={field} className="flex justify-between">
              <label className="text-sm">{field}:</label>
              <input
                type="text"
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                placeholder={`Enter ${field}`}
                className="border p-2 w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 p-4 border rounded">

        <input
          type="text"
          placeholder="Field Name"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="mb-2 border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mb-2 border p-2 w-full"
        />
        <button onClick={addField} className="w-full bg-blue-500 text-white p-2">
          Add Custom Field
        </button>
      </div>

      <div className="mb-4">
        <button onClick={checkEligibility} className="w-full bg-green-500 text-white p-2">
          Check Eligibility
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-bold">Result</h2>
          <p>Loan Eligibility Score: {result["Loan Eligibility Score"]}%</p>
          <p>Recommendation: {result.Recommendation}</p>
        </div>
      )}
    </div>
  );
}
