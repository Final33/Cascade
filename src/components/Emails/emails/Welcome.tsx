import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Heading,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.WEBSITE_URL ? `${process.env.WEBSITE_URL}` : "";

export const KollyWelcomeEmail = () => (
  <Html>
    <Head />
    <Preview>
      Welcome to Kolly, your AI-powered platform for standout college
      applications!
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Button href="https://app.kolly.ai">
            <Img
              src={`https://i.ibb.co/VTYz1hd/Kolly-Full-Logo-Dark-No-Bg.png`}
              width="100"
              alt="Kolly"
            />
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>Hi there,</Text>
          <Text style={paragraph}>
            Welcome to Kolly! We're thrilled to have you join us. Kolly is
            designed to be your ultimate AI-powered platform for creating
            standout college applications.
          </Text>

          <br />
          <Button style={button} href="https://app.kolly.ai">
            Transform Your College Essays with Kolly
          </Button>
          <br />
          <Text style={paragraph}>Let's explore our main features:</Text>

          <Heading as="h2" style={h2}>
            AI Essay Generator
          </Heading>
          <Text style={paragraph}>
            Create an Ivy League level essay in 10 minutes. Our personalized
            5-step process helps you generate and edit your college essays in
            seconds, guiding you through values, anecdotes, structure, and final
            drafts.
          </Text>
          <Img
            src={`https://framerusercontent.com/images/HaxLHHPYq3t00NP4KcRN1dLhuU.png?scale-down-to=1024`}
            alt="Feature 1"
            style={image}
          />

          <Heading as="h2" style={h2}>
            AI Essay Feedback
          </Heading>
          <Text style={paragraph}>
            Get high-quality essay feedback with just one click. Kolly analyzes
            your college essay using advanced AI, helping you refine your
            writing and boost your chances of success.
          </Text>
          <Img
            src={`https://framerusercontent.com/images/T5SMbtd5hczTVtDm4YakTHYw4.png?scale-down-to=1024`}
            alt="Feature 3"
            style={image}
          />

          <Heading as="h2" style={h2}>
            AI Extracurricular Generator
          </Heading>
          <Text style={paragraph}>
            Generate tailored extracurricular activities based on your profile.
            Choose your favorites and get detailed overviews, example
            descriptions, and actionable to-do plans to make your application
            shine.
          </Text>
          <Img
            src={`https://framerusercontent.com/images/IuLrnrirPe5sztLKSxZf6QV2cA.png?scale-down-to=1024`}
            alt="Feature 2"
            style={image}
          />

          <Heading as="h2" style={h2}>
            Example Essays
          </Heading>
          <Text style={paragraph}>
            Get inspired by our curated collection of 500+ high-quality example
            essays from top schools. Use them as models to guide your writing
            and ensure your essays stand out in the competitive admissions
            process.
          </Text>
          <Img
            src={`https://framerusercontent.com/images/CaOggO9MWPJUQXnZn8TRTbs24.png?scale-down-to=1024`}
            alt="Feature 4"
            style={image}
          />

          <Heading as="h2" style={h2}>
            And So Much More...
          </Heading>
          <Text style={paragraph}>
            Our features revolutionize applying to college:
            <ul>
              <li>Generate Hook: Create engaging introductory hooks</li>
              <li>
                Write About Next: Get real-time suggestions for compelling
                themes
              </li>
              <li>
                AI College Consultant: Personalized advice at your fingertips
              </li>
              <li>Extracurriculars: Revise activities to Common App format</li>
              <li>
                Continue Writing: Let AI help develop your essay's narrative
              </li>
              <li>GPT-4: Leverage cutting-edge AI for sophisticated writing</li>
            </ul>
          </Text>
          <Img
            src={`https://i.ibb.co/d55MmXF/Website-Homepage-4.png`}
            alt="Feature 5"
            style={image}
          />
          <br />
          <br />
          <Button style={button} href="https://app.kolly.ai">
            Start Writing with Kolly
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            We're here to support you every step of the way. Join our Discord
            community for priority support and to connect with other students.
          </Text>
          <Text style={coupon}>
            <i>
              <b>P.S.</b> If you made it this far, here's a 20% off code for
              you:{" "}
            </i>
            <b>Kolly20</b>
          </Text>
          <Text style={paragraph}>
            Warmly,
            <br />
            Dylan Ott
            <br />
            Founder & CEO
            <br />
            <a href="mailto:founders@kolly.ai">founders@kolly.ai</a>
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            Kolly is developed at the ivy league. © Dotter, Inc.
          </Text>
          <Text style={footer}>
            <a href="mailto:founders@kolly.ai">Click here to unsubscribe</a>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default KollyWelcomeEmail;

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const h2 = {
  color: "black",
};

const image = {
  maxWidth: "100%",
};

const coupon = {
  color: "#004684",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "black",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const button = {
  backgroundColor: "#004684",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
