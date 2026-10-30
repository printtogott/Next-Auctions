import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type VerificationEmailParams = {
  userId: string;
  userEmail: string;
  userName: string;
  idFrontUrl?: string;
  idBackUrl?: string;
  faceIdUrl?: string;
};

export async function sendAdminVerificationEmail({
  userId,
  userEmail,
  userName,
  idFrontUrl,
  idBackUrl,
  faceIdUrl,
}: VerificationEmailParams) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://next-auctions.pages.dev";
  const approveUrl = `${baseUrl}/api/admin/verify-user?userId=${userId}&action=VERIFIED`;
  const rejectUrl = `${baseUrl}/api/admin/verify-user?userId=${userId}&action=REJECTED`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; color: #18181b; }
          .card { background: #ffffff; border-radius: 12px; padding: 32px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e4e4e7; }
          .header { border-bottom: 1px solid #f4f4f5; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #09090b; }
          .subtitle { font-size: 14px; color: #71717a; margin: 0; }
          .user-details { background: #fafafa; border-radius: 8px; padding: 16px; margin-bottom: 24px; border: 1px solid #f4f4f5; }
          .user-details p { margin: 6px 0; font-size: 14px; }
          .label { font-weight: 600; color: #52525b; }
          .docs-grid { margin-bottom: 28px; }
          .doc-item { margin-bottom: 12px; font-size: 14px; }
          .doc-link { color: #2563eb; text-decoration: none; font-weight: 500; }
          .doc-link:hover { text-decoration: underline; }
          .actions { display: flex; gap: 12px; margin-top: 24px; }
          .btn { display: inline-block; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; text-align: center; }
          .btn-approve { background-color: #16a34a; color: #ffffff !important; }
          .btn-reject { background-color: #dc2626; color: #ffffff !important; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">New Identity Verification Submitted</h1>
            <p class="subtitle">A user has uploaded identity verification documents requiring review.</p>
          </div>

          <div class="user-details">
            <p><span class="label">Name:</span> ${userName}</p>
            <p><span class="label">Email:</span> ${userEmail}</p>
            <p><span class="label">User ID:</span> <code>${userId}</code></p>
          </div>

          <div class="docs-grid">
            <h3 style="font-size: 15px; margin-bottom: 12px;">Uploaded Verification Documents:</h3>
            <div class="doc-item">
              🪪 <strong>ID Front:</strong> ${idFrontUrl ? `<a class="doc-link" href="${idFrontUrl}" target="_blank">View ID Front Document</a>` : '<span style="color:#a1a1aa">Not provided</span>'}
            </div>
            <div class="doc-item">
              🪪 <strong>ID Back:</strong> ${idBackUrl ? `<a class="doc-link" href="${idBackUrl}" target="_blank">View ID Back Document</a>` : '<span style="color:#a1a1aa">Not provided</span>'}
            </div>
            <div class="doc-item">
              🤳 <strong>Face / Selfie ID:</strong> ${faceIdUrl ? `<a class="doc-link" href="${faceIdUrl}" target="_blank">View Selfie ID Photo</a>` : '<span style="color:#a1a1aa">Not provided</span>'}
            </div>
          </div>

          <hr style="border: 0; border-top: 1px solid #f4f4f5; margin: 24px 0;" />

          <div class="actions">
            <a href="${approveUrl}" class="btn btn-approve">✓ Approve Verification</a>
            <a href="${rejectUrl}" class="btn btn-reject">✕ Reject Verification</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return await resend.emails.send({
    from: "ttbids Verification <onboarding@resend.dev>",
    to: ["nigelcharles3000@gmail.com"],
    subject: `[Verification Request] ${userName} (${userEmail})`,
    html: htmlContent,
  });
}
