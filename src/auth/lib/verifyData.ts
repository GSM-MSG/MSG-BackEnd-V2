export type VerifyData = Record<
  string,
  { code: string; expiredAt: Date | null }
>;

export const verifyData: VerifyData = {};
