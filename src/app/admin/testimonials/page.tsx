"use client";

// /admin/testimonials — CRUD UI for testimonials.

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { apiFetch, ApiError } from "@/lib/api";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  order: number;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [text, setText] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch<Testimonial[]>("/api/public/content/testimonials");
      setItems(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await apiFetch("/api/admin/content/testimonials", {
        method: "POST",
        json: { name, role, text },
      });
      setName("");
      setRole("");
      setText("");
      await load();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await apiFetch(`/api/admin/content/testimonials/${id}`, { method: "DELETE" });
      await load();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete");
    }
  }

  return (
    <main className="min-h-screen px-6 py-32 max-w-6xl mx-auto">
      <header className="mb-12">
        <Link href="/admin" className="text-premium-accent text-sm hover:underline">
          ← Back to overview
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">Testimonials</h1>
        <p className="text-white/50 mt-2">
          Quotes shown in the Client Echoes section on the homepage.
        </p>
      </header>

      <Card className="p-8 mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Add a new testimonial</h2>
        <form onSubmit={onCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              type="text"
              required
              placeholder="Alex Rivera"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Role / Title"
              type="text"
              required
              placeholder="CEO of Nexus"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <Textarea
            label="Quote"
            required
            minLength={10}
            placeholder="Nex transformed our digital presence…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={creating}>
            {creating ? "Adding…" : "Add testimonial"}
          </Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table<Testimonial>
          rows={items}
          loading={loading}
          emptyMessage="No testimonials yet."
          columns={[
            { key: "name", header: "Name", render: (r) => <span className="text-white">{r.name}</span> },
            { key: "role", header: "Role", render: (r) => <span className="text-white/60">{r.role}</span> },
            { key: "text", header: "Quote", className: "max-w-md", render: (r) => <span className="text-white/70 line-clamp-2 italic">"{r.text}"</span> },
            { key: "order", header: "Order", render: (r) => <span className="text-white/40">{r.order}</span> },
            {
              key: "id",
              header: "",
              render: (r) => (
                <Button variant="danger" size="sm" onClick={() => onDelete(r.id)}>
                  Delete
                </Button>
              ),
            },
          ]}
        />
      </Card>
    </main>
  );
}