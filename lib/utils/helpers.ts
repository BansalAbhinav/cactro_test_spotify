import { NextResponse } from 'next/server';

export function createApiResponse(
  success: boolean,
  message: string,
  data?: any,
  status: number = 200
): NextResponse {
  return NextResponse.json({
    success,
    message,
    data,
    timestamp: new Date().toISOString(),
  }, { status });
}

export function createErrorResponse(
  message: string,
  status: number = 400,
  errors?: string[]
): NextResponse {
  return NextResponse.json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  }, { status });
}
