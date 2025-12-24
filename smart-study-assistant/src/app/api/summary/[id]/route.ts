import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET single summary by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: summaryId } = await params

    const summary = await prisma.summary.findFirst({
      where: {
        id: summaryId,
        userId // Ensure user owns this summary
      },
      include: {
        document: true
      }
    })

    if (!summary) {
      return NextResponse.json(
        { error: 'Summary not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      summary: {
        id: summary.id,
        title: summary.title,
        content: summary.content,
        type: summary.type,
        document: {
          id: summary.document.id,
          title: summary.document.title,
          content: summary.document.content
        },
        createdAt: summary.createdAt.toISOString(),
        updatedAt: summary.updatedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Get summary error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    )
  }
}

// PUT - Update summary
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: summaryId } = await params
    const body = await request.json()
    const { title, content } = body

    // Verify ownership
    const existingSummary = await prisma.summary.findFirst({
      where: {
        id: summaryId,
        userId
      }
    })

    if (!existingSummary) {
      return NextResponse.json(
        { error: 'Summary not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update summary
    const updatedSummary = await prisma.summary.update({
      where: { id: summaryId },
      data: {
        title: title || existingSummary.title,
        content: content || existingSummary.content,
        updatedAt: new Date()
      },
      include: {
        document: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Summary updated successfully',
      summary: {
        id: updatedSummary.id,
        title: updatedSummary.title,
        content: updatedSummary.content,
        type: updatedSummary.type,
        updatedAt: updatedSummary.updatedAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Update summary error:', error)
    return NextResponse.json(
      { error: 'Failed to update summary' },
      { status: 500 }
    )
  }
}

// DELETE summary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: summaryId } = await params

    // Verify ownership
    const existingSummary = await prisma.summary.findFirst({
      where: {
        id: summaryId,
        userId
      }
    })

    if (!existingSummary) {
      return NextResponse.json(
        { error: 'Summary not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete summary
    await prisma.summary.delete({
      where: { id: summaryId }
    })

    return NextResponse.json({
      success: true,
      message: 'Summary deleted successfully'
    })

  } catch (error) {
    console.error('Delete summary error:', error)
    return NextResponse.json(
      { error: 'Failed to delete summary' },
      { status: 500 }
    )
  }
}
