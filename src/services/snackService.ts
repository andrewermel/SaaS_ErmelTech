import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../lib/prisma.js';

import { SnackWithTotals } from '../types/entities.js';

import type { Portion } from '../types/entities.js';

interface TotalsResult {
  totalCost: string;
  totalWeightG: number;
  suggestedPrice: string;
}

const calculateTotals = (
  snackPortions: Array<{
    portion: Portion;
    quantity: number;
  }>
): TotalsResult => {
  const totalCostDecimal = snackPortions.reduce(
    (sum: Decimal, sp) =>
      sum.plus(
        new Decimal(String(sp.portion.cost)).mul(
          sp.quantity
        )
      ),
    new Decimal(0)
  );
  return {
    totalCost: totalCostDecimal.toFixed(4),
    totalWeightG: snackPortions.reduce(
      (s: number, sp) =>
        s + sp.portion.weightG * sp.quantity,
      0
    ),
    suggestedPrice: totalCostDecimal
      .mul(new Decimal(2))
      .toFixed(4),
  };
};

export class SnackService {
  async createSnack(
    name: string,
    companyId: number,
    imageUrl?: string,
    finalPrice?: number | null
  ) {
    const data: any = {
      name: name.trim(),
      companyId,
      imageUrl: imageUrl || null,
    };

    if (finalPrice) {
      data.finalPrice = new Decimal(finalPrice);
    }

    return prisma.snack.create({
      data,
      include: {
        snackPortions: { include: { portion: true } },
      },
    }) as any;
  }

  async getSnackWithTotals(
    snackId: number,
    companyId: number
  ): Promise<SnackWithTotals | null> {
    const snack = await prisma.snack.findFirst({
      where: { id: snackId, companyId },
      include: {
        snackPortions: { include: { portion: true } },
      },
    });

    if (!snack) return null;

    const { totalCost, totalWeightG, suggestedPrice } =
      calculateTotals(
        snack.snackPortions.map(sp => ({
          portion: sp.portion as Portion,
          quantity: sp.quantity,
        }))
      );

    const portions = snack.snackPortions.map(sp => ({
      ...(sp.portion as Portion),
      quantity: sp.quantity,
    }));

    return {
      id: snack.id,
      name: snack.name,
      imageUrl: snack.imageUrl,
      companyId: snack.companyId,
      portions,
      totalCost,
      totalWeightG,
      suggestedPrice,
      createdAt: snack.createdAt,
      updatedAt: snack.updatedAt,
    };
  }

  async getAllSnacks(
    companyId: number
  ): Promise<SnackWithTotals[]> {
    const snacks = await prisma.snack.findMany({
      where: { companyId },
      include: {
        snackPortions: { include: { portion: true } },
      },
    });

    return snacks.map(snack => {
      const { totalCost, totalWeightG, suggestedPrice } =
        calculateTotals(
          snack.snackPortions.map(sp => ({
            portion: sp.portion as Portion,
            quantity: sp.quantity,
          }))
        );

      const portions = snack.snackPortions.map(sp => ({
        ...(sp.portion as Portion),
        quantity: sp.quantity,
      }));

      return {
        id: snack.id,
        name: snack.name,
        imageUrl: snack.imageUrl,
        companyId: snack.companyId,
        portions,
        totalCost,
        totalWeightG,
        suggestedPrice,
        createdAt: snack.createdAt,
        updatedAt: snack.updatedAt,
      };
    });
  }

  async addPortion(
    snackId: number,
    portionId: number,
    companyId: number
  ) {
    return prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const snack = await tx.snack.findFirst({
          where: { id: snackId, companyId },
        });
        if (!snack) throw new Error('Snack not found.');

        const portion = await tx.portion.findFirst({
          where: { id: portionId, companyId },
        });
        if (!portion)
          throw new Error(
            'Portion not found or does not belong to this company.'
          );

        const existing = await tx.snackPortion.findUnique({
          where: {
            snackId_portionId: { snackId, portionId },
          },
        });

        if (existing) {
          return tx.snackPortion.update({
            where: {
              snackId_portionId: { snackId, portionId },
            },
            data: { quantity: existing.quantity + 1 },
          }) as any;
        }

        return tx.snackPortion.create({
          data: { snackId, portionId, quantity: 1 },
        }) as any;
      }
    );
  }

  async removePortion(
    snackId: number,
    portionId: number,
    companyId: number
  ): Promise<{ message: string }> {
    return prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const snack = await tx.snack.findFirst({
          where: { id: snackId, companyId },
        });
        if (!snack) throw new Error('Snack not found.');

        const snackPortion =
          await tx.snackPortion.findUnique({
            where: {
              snackId_portionId: { snackId, portionId },
            },
          });

        if (!snackPortion) {
          throw new Error('Portion not found in snack.');
        }

        if (snackPortion.quantity > 1) {
          await tx.snackPortion.update({
            where: {
              snackId_portionId: { snackId, portionId },
            },
            data: { quantity: snackPortion.quantity - 1 },
          });
        } else {
          await tx.snackPortion.delete({
            where: {
              snackId_portionId: { snackId, portionId },
            },
          });
        }

        return { message: 'Portion removed.' };
      }
    );
  }

  async deleteSnack(snackId: number, companyId: number) {
    const existing = await prisma.snack.findFirst({
      where: { id: snackId, companyId },
    });
    if (!existing) throw new Error('Snack not found.');

    return prisma.snack.delete({
      where: { id: snackId },
    }) as any;
  }

  async getPublicMenu(companySlug: string) {
    const company = await prisma.company.findUnique({
      where: { slug: companySlug },
    });

    if (!company) return null;

    const snacks = await prisma.snack.findMany({
      where: { companyId: company.id },
      include: {
        snackPortions: { include: { portion: true } },
      },
    });

    return {
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
      },
      snacks: snacks.map((snack: any) => {
        const { totalCost, totalWeightG, suggestedPrice } =
          calculateTotals(
            snack.snackPortions.map((sp: any) => ({
              portion: sp.portion as Portion,
              quantity: sp.quantity,
            }))
          );

        return {
          id: snack.id,
          name: snack.name,
          imageUrl: snack.imageUrl,
          finalPrice: snack.finalPrice
            ? snack.finalPrice.toString()
            : null,
          suggestedPrice,
          totalCost,
          totalWeightG,
        };
      }),
    };
  }
}
