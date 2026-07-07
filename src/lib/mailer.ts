// Mailer abstraction.
//
// Local dev uses ConsoleMailer, which logs the message to stdout — no external
// service is required. To wire up real email later (Resend, SendGrid, SMTP), add
// another implementation of the Mailer interface and switch the export at the
// bottom of this file.

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface Mailer {
  send(message: MailMessage): Promise<void>;
}

export class ConsoleMailer implements Mailer {
  async send(message: MailMessage): Promise<void> {
    // Visible, copy-paste-friendly format for local dev.
    console.log("\n📬 [ConsoleMailer] would send:");
    console.log(`  to:      ${message.to}`);
    console.log(`  subject: ${message.subject}`);
    console.log(`  body:    ${message.text}\n`);
  }
}

export const mailer: Mailer = new ConsoleMailer();
