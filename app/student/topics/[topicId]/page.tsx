import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layouts/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default async function TopicPage({
  params,
}: {
  params: { topicId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const topic = await prisma.topic.findUnique({
    where: { id: params.topicId },
    include: {
      chapter: {
        include: {
          class: true,
        },
      },
    },
  });

  if (!topic) {
    redirect("/student/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/student/classes/${topic.chapter.class.id}/chapters/${topic.chapter.id}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Chapter
        </Link>

        <Card className="mb-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">
                {topic.chapter.class.name} - {topic.chapter.title}
              </p>
              <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
            </div>
          </div>
        </Card>

        <Card>
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: topic.content }}
          />
        </Card>
      </main>
    </div>
  );
}

