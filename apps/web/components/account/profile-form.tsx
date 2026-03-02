"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export function ProfileForm() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div style={{ padding: "40px 0" }}>
        <div style={{ display: "grid", gap: "24px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div style={{ height: "20px", background: "var(--line)", borderRadius: "4px", marginBottom: "8px", width: "100px" }} />
              <div style={{ height: "44px", background: "var(--line)", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <p style={{ color: "var(--mid)" }}>
          Не удалось загрузить профиль пользователя
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 0" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", letterSpacing: "0.05em", marginBottom: "40px", color: "var(--dark)" }}>
        Профиль
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "32px", maxWidth: "500px" }}>
        <div>
          <label htmlFor="name" style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px", color: "var(--dark)" }}>
            Имя
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              fontSize: "14px",
              background: "white",
              color: "var(--dark)",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
          />
        </div>

        <div>
          <label htmlFor="email" style={{ display: "block", fontSize: "13px", fontWeight: "500", marginBottom: "8px", color: "var(--dark)" }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              fontSize: "14px",
              background: "var(--line)",
              color: "var(--mid)",
              cursor: "not-allowed",
            }}
          />
          <div style={{ fontSize: "12px", color: "var(--mid)", marginTop: "4px" }}>
            Email нельзя изменить
          </div>
        </div>

        <div>
          <div style={{ fontSize: "13px", color: "var(--mid)", marginBottom: "16px" }}>
            <div>Аккаунт создан: {new Date(user.createdAt).toLocaleDateString("ru-RU")}</div>
            <div>ID пользователя: {user.id.slice(-8).toUpperCase()}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            type="submit"
            disabled={saving}
            className="button-primary"
            style={{
              padding: "12px 32px",
              background: saving ? "var(--line)" : "var(--dark)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "13px",
              letterSpacing: "0.02em",
              cursor: saving ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {saving ? "Сохранение..." : "Сохранить изменения"}
          </button>

          <button
            type="button"
            onClick={() => setFormData({ name: user.name, email: user.email })}
            disabled={saving}
            className="button-secondary"
            style={{
              padding: "12px 32px",
              background: "transparent",
              color: "var(--dark)",
              border: "1px solid var(--dark)",
              borderRadius: "4px",
              fontSize: "13px",
              letterSpacing: "0.02em",
              cursor: saving ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
