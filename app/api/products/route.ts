import { productsMock } from '@/shared/mocks/products';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(productsMock);
}
