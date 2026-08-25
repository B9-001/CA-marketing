import type { Lead } from "@/lib/types/database";

export function leadConfirmationEmail(lead: Lead) {
  return {
    subject: `We've received your consultation request — ${lead.lead_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0b1220;">
        <h1 style="font-size: 20px;">Thanks, ${lead.full_name.split(" ")[0]} 👋</h1>
        <p>We've received your request to book a growth consultation with <strong>CA Marketing</strong>. Your reference number is <strong>${lead.lead_number}</strong>.</p>
        <p>Someone from our team will reach out within 1 business day to schedule your consultation${lead.phone ? " by phone or WhatsApp" : ""}.</p>
        <p style="margin-top: 24px; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <strong>What you told us:</strong><br/>
          Service needed: ${lead.service_needed || "Not specified"}<br/>
          Main challenge: ${lead.main_challenge || "Not specified"}
        </p>
        <p style="margin-top: 24px; color: #64748b; font-size: 13px;">— The CA Marketing team</p>
      </div>
    `,
  };
}

export function leadNotificationEmail(lead: Lead) {
  return {
    subject: `🔥 New ${lead.lead_temperature} lead (${lead.lead_score}/100) — ${lead.full_name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0b1220;">
        <h1 style="font-size: 18px;">New consultation request</h1>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding:4px 0;color:#64748b;">Lead</td><td>${lead.lead_number}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Name</td><td>${lead.full_name}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Business</td><td>${lead.business_name || "-"}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Email</td><td>${lead.email}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Phone</td><td>${lead.phone || "-"}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Service</td><td>${lead.service_needed || "-"}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Budget</td><td>${lead.budget || "-"}</td></tr>
          <tr><td style="padding:4px 0;color:#64748b;">Score</td><td>${lead.lead_score}/100 (${lead.lead_temperature})</td></tr>
        </table>
        <p style="margin-top: 16px;">${lead.message || lead.main_challenge || ""}</p>
      </div>
    `,
  };
}
