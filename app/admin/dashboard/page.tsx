import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layouts/Navbar";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { BookOpen, Users, FileText, MessageSquare, Plus, ArrowRight, Info } from "lucide-react";


export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [classCount, chapterCount, topicCount, studentCount, postCount] = await Promise.all([
    prisma.class.count(),
    prisma.chapter.count(),
    prisma.topic.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.post.count(),
  ]);

  const stats = [
    { label: "Classes", value: classCount, icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-100", link: "/admin/classes" },
    { label: "Chapters", value: chapterCount, icon: FileText, color: "text-green-600", bgColor: "bg-green-100", link: "/admin/chapters" },
    { label: "Topics", value: topicCount, icon: FileText, color: "text-purple-600", bgColor: "bg-purple-100", link: "/admin/topics" },
    { label: "Students", value: studentCount, icon: Users, color: "text-orange-600", bgColor: "bg-orange-100", link: "/admin/community" },
    { label: "Community Posts", value: postCount, icon: MessageSquare, color: "text-pink-600", bgColor: "bg-pink-100", link: "/admin/community" },
  ];

  const quickActions = [
    { label: "Create Class", description: "Add a new class (5th, 6th, SSC Prep, etc.)", link: "/admin/classes/create", icon: BookOpen , bgColor: "bg-transparent", color:"text-current"},
    { label: "Create Chapter", description: "Add a chapter to a class", link: "/admin/chapters/create", icon: FileText , bgColor: "bg-transparent", color:"text-current"},
    { label: "Create Topic", description: "Add content with rich text editor", link: "/admin/topics/create", icon: FileText, bgColor: "bg-transparent", color:"text-current" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage classes, chapters, topics, and monitor student activity</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.link}>
                    <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Link key={stat.label} href={stat.link}>
                    <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-16 h-16 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Getting Started Guide */}
          {classCount === 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    To start uploading content for students, follow these steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-4">
                    <li>Create a Class (e.g., Class 5, Class 6, SSC Prep, GK)</li>
                    <li>Add Chapters to organize content within each class</li>
                    <li>Create Topics with rich text content for each chapter</li>
                  </ol>
                  <Link href="/admin/classes/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Class
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}

