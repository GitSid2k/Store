import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;

export const resend = resendKey 
  ? new Resend(resendKey)
  : ({
      emails: {
        send: async () => console.warn("Resend API key missing. Email not sent."),
      },
    } as unknown as Resend);

