"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layouts/Navbar";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Topic {
  id: string;
  title: string;
  content: string;
  order: number;
  chapter: {
    id: string;
    title: string;
    class: {
      name: string;
    };
  };
}

export default function EditTopic({ params }: { params: { topicId: string } }) {
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    chapterId: "",
    title: "",
    content: "",
    order: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch topic data
    fetch(`/api/admin/topics/${params.topicId}`)
      .then((res) => res.json())
      .then((data) => {
        setTopic(data);
        setFormData({
          chapterId: data.chapter.id,
          title: data.title,
          content: data.content,
          order: data.order,
        });
      })
      .catch((err) => console.error(err));

    // Fetch chapters
    fetch("/api/admin/chapters")
      .then((res) => res.json())
      .then((data) => setChapters(data))
      .catch((err) => console.error(err));
  }, [params.topicId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.content || formData.content.trim() === "") {
      setError("Content is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/topics/${params.topicId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update topic");
        return;
      }

      router.push("/admin/topics");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <p>Loading...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Link href="/admin/topics" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Topics
          </Link>

          <Card className="max-w-4xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Topic</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="chapterId" className="block text-sm font-medium text-gray-700 mb-2">
                  Chapter
                </label>
                <select
                  id="chapterId"
                  value={formData.chapterId}
                  onChange={(e) => setFormData({ ...formData, chapterId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  required
                >
                  <option value="">Select a chapter</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.class.name} - {chapter.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Topic Title
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Basic Addition"
                />
              </div>

              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  placeholder="Write your topic content here..."
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Topic"}
                </Button>
                <Link href="/admin/topics">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
              </div>
            </form>
          </Card>
        </main>
      </div>
    </div>
  );
}

