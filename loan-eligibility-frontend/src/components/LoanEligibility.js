import { useState } from "react";

export default function LoanEligibility() {
  const [formData, setFormData] = useState({});
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);

  const addField = () => {
    if (key && value) {
      setFormData({ ...formData, [key]: value });
      setKey("");
      setValue("");
    }
  };

  const checkEligibility = async () => {
    const response = await fetch("http://localhost:8000/loan-eligibility/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_data: formData }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Loan Eligibility Checker</h1>
      <div className="mb-4 p-4 border rounded">
        <input
          type="text"
          placeholder="Field Name (e.g., Salary)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="mb-2 border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Value (e.g., 50000)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mb-2 border p-2 w-full"
        />
        <button onClick={addField} className="w-full bg-blue-500 text-white p-2">
          Add Field
        </button>
      </div>
      <button onClick={checkEligibility} className="w-full bg-green-500 text-white p-2">
        Check Eligibility
      </button>
      {result && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-lg font-bold">Result</h2>
          <p>Score: {result["Loan Eligibility Score"]}%</p>
          <p>Recommendation: {result.Recommendation}</p>
        </div>
      )}
    </div>
  );
}
