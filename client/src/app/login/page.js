"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";
import api from "../../lib/api";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import ErrorMessage from "../../components/ui/ErrorMessage";
import Loading from "../../components/ui/Loading";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace("/events");
    }
  }, [isLoggedIn, authLoading, router]);

  if (authLoading || isLoggedIn) {
    return <Loading message="Redirecting to events..." />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      const { token, user } = response.data.data;

      login(token, user);

      router.push("/events");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
            Local Meetup
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
            icon={<Mail className="w-5 h-5 text-slate-400" />}
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            required
            icon={<Lock className="w-5 h-5 text-slate-400" />}
          />

          <ErrorMessage message={error} />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>
      </div>
    </main>
  );
}