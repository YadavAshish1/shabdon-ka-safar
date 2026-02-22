import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layouts/Navbar";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

export default async function AdminChapters() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const chapters = await prisma.chapter.findMany({
    include: {
      class: true,
      _count: {
        select: { topics: true },
      },
    },
    orderBy: [
      { class: { type: "asc" } },
      { order: "asc" },
    ],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Chapters</h1>
            <Link href="/admin/chapters/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Chapter
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter) => (
              <Card key={chapter.id} className="hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{chapter.title}</h3>
                        <p className="text-sm text-gray-500">{chapter.class.name}</p>
                      </div>
                    </div>
                    {chapter.description && (
                      <p className="text-gray-600 mb-3">{chapter.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Order: {chapter.order}</span>
                      <span>•</span>
                      <span>{chapter._count.topics} Topics</span>
                    </div>
                  </div>
                  <Link href={`/admin/chapters/${chapter.id}/topics`}>
                    <Button variant="outline" size="sm">Manage Topics</Button>
                  </Link>
                </div>
              </Card>
            ))}

            {chapters.length === 0 && (
              <Card className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No chapters yet</p>
                <Link href="/admin/chapters/create">
                  <Button>Create Your First Chapter</Button>
                </Link>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

