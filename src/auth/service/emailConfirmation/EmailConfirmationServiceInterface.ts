export interface EmailConfirmationServiceInterface {
  confirmEmail(email: string): Promise<void>;
  sendConfirmationMail(to: string): Promise<void>;
}
