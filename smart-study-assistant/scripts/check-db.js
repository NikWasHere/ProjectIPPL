// Script untuk cek data di database
// Run: node scripts/check-db.js

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...\n')

    // Count users
    const userCount = await prisma.user.count()
    console.log(`👥 Total Users: ${userCount}`)

    // Get all users
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          _count: {
            select: {
              documents: true,
              quizzes: true
            }
          }
        }
      })

      console.log('\n📋 User Details:')
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.name}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Created: ${user.createdAt.toLocaleString('id-ID')}`)
        console.log(`   Documents: ${user._count.documents}`)
        console.log(`   Quizzes: ${user._count.quizzes}`)
      })
    }

    // Count documents
    const docCount = await prisma.document.count()
    console.log(`\n📄 Total Documents/Summaries: ${docCount}`)

    // Count quizzes
    const quizCount = await prisma.quiz.count()
    console.log(`❓ Total Quizzes: ${quizCount}`)

    // Count questions
    const questionCount = await prisma.question.count()
    console.log(`📝 Total Questions: ${questionCount}`)

    console.log('\n✅ Database check complete!')
    console.log('\n💡 Tip: Buka Prisma Studio untuk GUI view:')
    console.log('   npx prisma studio')
    console.log('   Then open: http://localhost:5555')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
