"use client";

// /admin/gallery — CRUD UI for gallery items.

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiFetch, ApiError } from "@/lib/api";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  order: number;
  createdAt: string;
}

export default function AdminGalleryPage() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch<GalleryItem[]>("/api/public/content/gallery");
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
      await apiFetch("/api/admin/content/gallery", {
        method: "POST",
        json: { src, alt, caption: caption || null },
      });
      setSrc("");
      setAlt("");
      setCaption("");
      await load();
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create");
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    try {
      await apiFetch(`/api/admin/content/gallery/${id}`, { method: "DELETE" });
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
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">Gallery</h1>
        <p className="text-white/50 mt-2">
          Add or remove items shown in the Visual Symphony section on the homepage.
        </p>
      </header>

      <Card className="p-8 mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">Add a new item</h2>
        <form onSubmit={onCreate} className="space-y-4">
          <Input
            label="Image URL"
            type="url"
            required
            placeholder="https://images.unsplash.com/…"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
          />
          <Input
            label="Alt text (required for accessibility)"
            type="text"
            required
            placeholder="What is shown in this image?"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
          />
          <Input
            label="Caption (optional, shown on hover)"
            type="text"
            placeholder="Alpine Threshold"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={creating}>
            {creating ? "Adding…" : "Add gallery item"}
          </Button>
        </form>
      </Card>

      <Card className="p-0 overflow-hidden">
        <Table<GalleryItem>
          rows={items}
          loading={loading}
          emptyMessage="No gallery items yet."
          columns={[
            {
              key: "src",
              header: "Preview",
              render: (r) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.src} alt={r.alt} className="w-16 h-16 object-cover rounded-md border border-white/10" />
              ),
            },
            { key: "alt", header: "Alt", render: (r) => <span className="text-white/80">{r.alt}</span> },
            { key: "caption", header: "Caption", render: (r) => <span className="text-white/60">{r.caption ?? "—"}</span> },
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