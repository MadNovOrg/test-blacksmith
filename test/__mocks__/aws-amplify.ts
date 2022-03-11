export const Auth = {
  signUp: jest.fn().mockResolvedValue(undefined),
  confirmSignUp: jest.fn().mockResolvedValue(undefined),
  resendSignUp: jest.fn().mockResolvedValue(undefined),

  forgotPassword: jest.fn().mockResolvedValue(undefined),
}
