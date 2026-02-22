import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layouts/Navbar";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus, FileText, ArrowLeft } from "lucide-react";

export default async function ClassChapters({
  params,
}: {
  params: { classId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const classData = await prisma.class.findUnique({
    where: { id: params.classId },
    include: {
      chapters: {
        include: {
          _count: {
            select: { topics: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!classData) {
    redirect("/admin/classes");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Link
            href="/admin/classes"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Classes
          </Link>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{classData.name}</h1>
              <p className="text-gray-600">Manage chapters for this class</p>
            </div>
            <Link href={`/admin/chapters/create?classId=${params.classId}`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Chapter
              </Button>
            </Link>
          </div>

          {classData.chapters.length === 0 ? (
            <Card className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No chapters yet</p>
              <Link href={`/admin/chapters/create?classId=${params.classId}`}>
                <Button>Create Your First Chapter</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {classData.chapters.map((chapter) => (
                <Card key={chapter.id} className="hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{chapter.title}</h3>
                          {chapter.description && (
                            <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                          )}
                        </div>
                      </div>
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

