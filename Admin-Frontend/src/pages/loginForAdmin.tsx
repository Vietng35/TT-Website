import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForAdmin() {
  // State for email, password, login status, and message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"success" | "fail" | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  // Handle form submit for login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement

    // Get email and password from form inputs
    let email = (form.querySelector('input') as HTMLInputElement).value
    const password = (form.querySelector('input[type=password]') as HTMLInputElement).value
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      // Call login function from context
      if (await login(email, password)) {
        setStatus("success");
        setMessage("Login successful!");
      } else {
        setStatus("fail");
        setMessage("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.log(err);
      setStatus("fail");
      setMessage("Login failed. Please check your credentials.");
    }
    // Reset input fields after submit
    setEmail("");
    setPassword("");
  };

  // Handle "Done" button after successful login
  const handleDone = () => {
    router.push("/mainContent");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Show success message and Done button if login is successful */}
      {status === "success" ? (
        <div className="bg-white p-8 rounded shadow-md w-80 flex flex-col items-center">
          <div className="text-green-600 text-xl mb-4">Successfully</div>
          <button
            onClick={handleDone}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      ) : (
        // Login form
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-80"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          {/* Show error message if login failed */}
          {status === "fail" && (
            <div className="mt-4 text-red-600 text-center">
              {message}
            </div>
          )}
        </form>
      )}
    </div>
  );
}