export const Auth = {
  currentAuthenticatedUser: jest.fn().mockResolvedValue({
    getSignInUserSession: jest.fn(),
  }),

  signIn: jest.fn(),
  signOut: jest.fn(),

  signUp: jest.fn().mockResolvedValue(undefined),
  confirmSignUp: jest.fn().mockResolvedValue(undefined),
  resendSignUp: jest.fn().mockResolvedValue(undefined),

  forgotPassword: jest.fn().mockResolvedValue(undefined),
}
