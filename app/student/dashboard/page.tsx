import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layouts/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { BookOpen, MessageSquare, ArrowRight } from "lucide-react";
import { classTypes } from "@/lib/utils";
import { Prisma } from "@prisma/client";

type ClassWithChapters = Prisma.ClassGetPayload<{
  include: {
    chapters: {
      include: {
        _count: {
          select: { topics: true };
        };
      };
    };
  };
}>;

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const userClass = session.user.class as string | undefined;
  
  let classes: ClassWithChapters[] = [];
  if (userClass) {
    const classData = await prisma.class.findUnique({
      where: { type: userClass as any },
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
    
    if (classData) {
      classes = [classData];
    }
  } else {
    // If no class assigned, show all classes
    classes = await prisma.class.findMany({
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
      orderBy: { type: "asc" },
    });
  }

  const recentPosts = await prisma.post.findMany({
    take: 5,
    include: {
      author: true,
      _count: {
        select: { replies: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-600">
            {userClass 
              ? `Continue learning from your ${classTypes.find(c => c.value === userClass)?.label || userClass} class`
              : "Explore available classes and start learning"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Classes</h2>
              
              {classes.length === 0 ? (
                <Card className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No classes available yet</p>
                  <p className="text-sm text-gray-500">Contact your administrator to get started</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {classes.map((classItem) => (
                    <Card key={classItem.id} className="hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{classItem.name}</h3>
                            {classItem.description && (
                              <p className="text-sm text-gray-600 mt-1">{classItem.description}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {classItem.chapters.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Chapters ({classItem.chapters.length})
                          </p>
                          {classItem.chapters.map((chapter) => (
                            <Link
                              key={chapter.id}
                              href={`/student/classes/${classItem.id}/chapters/${chapter.id}`}
                              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{chapter.title}</p>
                                  <p className="text-sm text-gray-600">
                                    {chapter._count.topics} topics
                                  </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No chapters available yet</p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Community</h2>
                <Link href="/student/community">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>

              <Card>
                {recentPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-4">No posts yet</p>
                    <Link href="/student/community">
                      <Button size="sm">Start Discussion</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/student/community/${post.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{post.author.name}</span>
                          <span>{post._count.replies} replies</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

