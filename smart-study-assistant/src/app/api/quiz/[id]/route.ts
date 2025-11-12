import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET single quiz by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const quizId = params.id

    const quiz = await prisma.quiz.findFirst({
      where: {
        id: quizId,
        userId // Ensure user owns this quiz
      },
      include: {
        document: true
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        type: quiz.type,
        questions: quiz.questions,
        document: {
          id: quiz.document.id,
          title: quiz.document.title,
          content: quiz.document.content
        },
        createdAt: quiz.createdAt.toISOString(),
        updatedAt: quiz.updatedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Get quiz error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}

// PUT - Update quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const quizId = params.id
    const body = await request.json()
    const { title, questions } = body

    // Verify ownership
    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        id: quizId,
        userId
      }
    })

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'Quiz not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update quiz
    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        title: title || existingQuiz.title,
        questions: questions || existingQuiz.questions,
        updatedAt: new Date()
      },
      include: {
        document: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Quiz updated successfully',
      quiz: {
        id: updatedQuiz.id,
        title: updatedQuiz.title,
        type: updatedQuiz.type,
        questions: updatedQuiz.questions,
        updatedAt: updatedQuiz.updatedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Update quiz error:', error)
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    )
  }
}

// DELETE quiz
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    const quizId = params.id

    // Verify ownership
    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        id: quizId,
        userId
      }
    })

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'Quiz not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete quiz (questions are stored as JSON, will be deleted with quiz)
    await prisma.quiz.delete({
      where: { id: quizId }
    })

    return NextResponse.json({
      success: true,
      message: 'Quiz deleted successfully'
    })

  } catch (error) {
    console.error('Delete quiz error:', error)
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    )
  }
}
