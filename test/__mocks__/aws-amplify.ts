export const Auth = {
  currentAuthenticatedUser: vi.fn().mockResolvedValue({
    getSignInUserSession: vi.fn(),
  }),

  signIn: vi.fn(),
  signOut: vi.fn(),

  signUp: vi.fn().mockResolvedValue(undefined),
  confirmSignUp: vi.fn().mockResolvedValue(undefined),
  resendSignUp: vi.fn().mockResolvedValue(undefined),

  forgotPassword: vi.fn().mockResolvedValue(undefined),
}
