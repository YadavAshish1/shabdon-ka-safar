import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layouts/Navbar";
import { Card } from "@/components/ui/Card";
import { ReplyForm } from "@/components/community/ReplyForm";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function PostPage({
  params,
}: {
  params: { postId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: {
      author: true,
      replies: {
        include: {
          author: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) {
    redirect("/student/community");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/student/community"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Link>

        <Card className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
            <span>By {post.author.name}</span>
            <span>•</span>
            <span>{format(new Date(post.createdAt), "MMMM d, yyyy 'at' h:mm a")}</span>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
        </Card>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Replies ({post.replies.length})
          </h2>

          {post.replies.length === 0 ? (
            <Card className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No replies yet. Be the first to reply!</p>
            </Card>
          ) : (
            <div className="space-y-4 mb-6">
              {post.replies.map((reply) => (
                <Card key={reply.id}>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 font-semibold">
                        {reply.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900">{reply.author.name}</span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(reply.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Reply</h3>
          <ReplyForm postId={post.id} />
        </Card>
      </main>
    </div>
  );
}

