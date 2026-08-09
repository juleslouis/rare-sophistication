import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props {
  locale?: "fr" | "en";
}

const copy = {
  fr: {
    preview: "Votre inscription à la liste d'accès anticipé DIVUS est enregistrée.",
    eyebrow: "DIVUS PARIS",
    heading: "Votre inscription est enregistrée.",
    body: "Votre inscription à la liste d'accès anticipé DIVUS est enregistrée. Vous serez informé avant l'ouverture de la série.",
    closing: "Le temps est le premier artisan du luxe.",
    signature: "DIVUS — Paris",
  },
  en: {
    preview: "Your registration on the DIVUS early access list is recorded.",
    eyebrow: "DIVUS PARIS",
    heading: "Your registration is recorded.",
    body: "Your registration on the DIVUS early access list is recorded. You will be informed before the series opens.",
    closing: "Time is the first craftsman of luxury.",
    signature: "DIVUS — Paris",
  },
};

const Email = ({ locale = "fr" }: Props) => {
  const t = copy[locale] ?? copy.fr;
  return (
    <Html lang={locale} dir="ltr">
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={eyebrow}>{t.eyebrow}</Text>
          <Hr style={rule} />
          <Heading style={heading}>{t.heading}</Heading>
          <Text style={paragraph}>{t.body}</Text>
          <Section style={{ paddingTop: "24px" }}>
            <Text style={closing}>{t.closing}</Text>
            <Text style={signature}>{t.signature}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    data?.locale === "en"
      ? "DIVUS — Early access list"
      : "DIVUS — Liste d'accès anticipé",
  displayName: "Confirmation liste d'accès anticipé",
  previewData: { locale: "fr" },
} satisfies TemplateEntry;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Georgia, 'Times New Roman', serif",
  color: "#1c1a17",
};

const container = { padding: "48px 32px", maxWidth: "560px" };

const eyebrow = {
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: "10px",
  letterSpacing: "0.28em",
  textTransform: "uppercase" as const,
  color: "#7a7268",
  margin: "0 0 16px",
};

const rule = { borderColor: "#e3ded6", margin: "0 0 32px" };

const heading = {
  fontSize: "26px",
  fontWeight: 400,
  lineHeight: "1.3",
  margin: "0 0 24px",
};

const paragraph = {
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: "14px",
  lineHeight: "1.8",
  color: "#3d382f",
  margin: "0",
};

const closing = {
  fontSize: "16px",
  fontStyle: "italic" as const,
  color: "#1c1a17",
  margin: "0 0 8px",
};

const signature = {
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: "10px",
  letterSpacing: "0.24em",
  textTransform: "uppercase" as const,
  color: "#7a7268",
  margin: "0",
};
