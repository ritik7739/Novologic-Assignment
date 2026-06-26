import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'ritik@novologic.com' },
    update: {
      name: 'Ritik',
      address: 'Noida, Uttar Pradesh, India',
      phone: '+91 9135855899',
    },
    create: {
      name: 'Ritik',
      email: 'ritik@novologic.com',
      address: 'Noida, Uttar Pradesh, India',
      phone: '+91 9135855899',
    },
  });

  const existingWorkbook = await prisma.workbook.findFirst({
    where: { userId: user.id },
  });

  if (!existingWorkbook) {
    const content = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Novologic Workbook' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Start writing your workbook...' }],
        },
      ],
    };

    const workbook = await prisma.workbook.create({
      data: {
        userId: user.id,
        content,
      },
    });

    await prisma.workbookVersion.create({
      data: {
        workbookId: workbook.id,
        content,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
