import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layouts/Navbar";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";
import { classTypes } from "@/lib/utils";

export default async function AdminClasses() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const classes = await prisma.class.findMany({
    include: {
      _count: {
        select: { chapters: true },
      },
    },
    orderBy: { type: "asc" },
  });

  // Get existing class types
  const existingTypes = classes.map((c) => c.type);
  
  // Find missing class types
  const missingTypes = classTypes.filter(
    (ct) => !existingTypes.includes(ct.value as any)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
            <Link href="/admin/classes/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Class
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Card key={cls.id} className="hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{cls.name}</h3>
                      <p className="text-sm text-gray-500">{cls.type}</p>
                    </div>
                  </div>
                </div>
                {cls.description && (
                  <p className="text-gray-600 mb-4">{cls.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {cls._count.chapters} Chapters
                  </span>
                  <Link href={`/admin/classes/${cls.id}/chapters`}>
                    <Button variant="outline" size="sm">Manage</Button>
                  </Link>
                </div>
              </Card>
            ))}

            {missingTypes.length > 0 && (
              <Card className="border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
                <Link href="/admin/classes/create" className="flex flex-col items-center justify-center h-full py-8">
                  <Plus className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium">Create New Class</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {missingTypes.length} class type(s) available
                  </p>
                </Link>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

