import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layouts/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";

export default async function ChapterPage({
  params,
}: {
  params: { classId: string; chapterId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const chapter = await prisma.chapter.findUnique({
    where: { id: params.chapterId },
    include: {
      class: true,
      topics: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!chapter) {
    redirect("/student/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <Card className="mb-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{chapter.class.name}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{chapter.title}</h1>
              {chapter.description && (
                <p className="text-gray-600">{chapter.description}</p>
              )}
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Topics</h2>
          
          {chapter.topics.length === 0 ? (
            <Card className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No topics available in this chapter yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {chapter.topics.map((topic, index) => (
                <Link
                  key={topic.id}
                  href={`/student/topics/${topic.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Click to read the content
                        </p>
                      </div>
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

