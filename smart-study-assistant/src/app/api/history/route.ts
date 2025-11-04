import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // Fetch quizzes and summaries
    const [quizzes, summaries] = await Promise.all([
      prisma.quiz.findMany({
        where: { userId },
        include: { document: true },
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      prisma.summary.findMany({
        where: { userId },
        include: { document: true },
        orderBy: { createdAt: 'desc' },
        take: 50
      })
    ])

    // Combine and format history
    const history = [
      ...quizzes.map(quiz => ({
        id: quiz.id,
        type: 'quiz' as const,
        title: quiz.title,
        createdAt: quiz.createdAt.toISOString(),
        content: {
          questions: quiz.questions,
          documentTitle: quiz.document.title
        }
      })),
      ...summaries.map(summary => ({
        id: summary.id,
        type: 'summary' as const,
        title: summary.title,
        createdAt: summary.createdAt.toISOString(),
        content: {
          content: summary.content,
          documentTitle: summary.document.title
        }
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ history })
    
  } catch (error) {
    console.error('History fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
