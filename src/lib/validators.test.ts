import {
  loginSchema,
  signupSchema,
  periodSchema,
  changePasswordSchema,
} from './validators';

describe('loginSchema', () => {
  it('requires a valid email and non-empty password', () => {
    expect(loginSchema.safeParse({ email: '', password: '' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'not-email', password: 'x' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
  });
});

describe('signupSchema', () => {
  const base = {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    password: 'Password123',
    confirmPassword: 'Password123',
    dateOfBirth: '1998-01-01',
  };

  it('accepts a valid payload', () => {
    expect(signupSchema.safeParse(base).success).toBe(true);
  });

  it('rejects a weak password', () => {
    expect(signupSchema.safeParse({ ...base, password: 'weak', confirmPassword: 'weak' }).success).toBe(
      false,
    );
  });

  it('rejects mismatched confirmation with a path on confirmPassword', () => {
    const result = signupSchema.safeParse({ ...base, confirmPassword: 'Different1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('confirmPassword'))).toBe(true);
    }
  });

  it('rejects an unrealistic date of birth', () => {
    expect(signupSchema.safeParse({ ...base, dateOfBirth: '2025-01-01' }).success).toBe(false);
  });
});

describe('periodSchema', () => {
  it('rejects an end date before the start date', () => {
    const result = periodSchema.safeParse({
      startDate: '2026-08-10',
      endDate: '2026-08-01',
      flow: 'MEDIUM',
    });
    expect(result.success).toBe(false);
  });

  it('accepts a valid period', () => {
    const result = periodSchema.safeParse({
      startDate: '2020-08-01',
      endDate: '2020-08-05',
      flow: 'HEAVY',
    });
    expect(result.success).toBe(true);
  });
});

describe('changePasswordSchema', () => {
  it('requires the new passwords to match', () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: 'x',
        newPassword: 'Password123',
        confirmPassword: 'Password124',
      }).success,
    ).toBe(false);
  });
});
