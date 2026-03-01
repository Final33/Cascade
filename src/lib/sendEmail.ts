export async function sendEmail(
  emailType: String,
  email: any,
  referrerName: string,
  referralLink: string
) {
  console.log("emailing...");
  //post to /api/send
  const response = await fetch(`https://app.kolly.ai/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      emailType: emailType,
      email: email,
      referrerName: referrerName || "",
      referralLink: referralLink || "",
    }),
  });
}
