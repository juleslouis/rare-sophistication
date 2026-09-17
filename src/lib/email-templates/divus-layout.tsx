import React from "react";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type EmailLocale = "fr" | "en";

interface DivusLayoutProps {
  children: React.ReactNode;
  locale: EmailLocale;
  preview: string;
  showHeader?: boolean;
}

const footerCopy = {
  fr: {
    house: "DIVUS PARIS — Maison de collection",
    reason: "Vous recevez cet email suite à votre inscription à l'accès anticipé.",
  },
  en: {
    house: "DIVUS PARIS — Collection house",
    reason: "You are receiving this email following your early-access registration.",
  },
};

export function DivusLayout({
  children,
  locale,
  preview,
  showHeader = true,
}: DivusLayoutProps) {
  const footer = footerCopy[locale];

  return (
    <Html lang={locale} dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {showHeader ? (
            <>
              <Text style={wordmark}>DIVUS</Text>
              <Section style={headerRuleWrap}>
                <Hr style={rule} />
              </Section>
            </>
          ) : null}
          {children}
          <Text style={signature}>DIVUS</Text>
          <Section style={footerBlock}>
            <Text style={footerText}>
              {footer.house}
              <br />
              {footer.reason}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const body = {
  margin: "0",
  padding: "0",
  backgroundColor: "#ffffff",
};

export const container = {
  maxWidth: "568px",
  margin: "0 auto",
  padding: "64px 24px",
  backgroundColor: "#F7F5F2",
};

export const wordmark = {
  margin: "0 0 40px",
  textAlign: "center" as const,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "15px",
  lineHeight: "1.4",
  letterSpacing: "6px",
  color: "#0A0A0A",
  textTransform: "uppercase" as const,
};

export const headerRuleWrap = { paddingBottom: "56px" };

export const rule = {
  width: "36px",
  margin: "0 auto",
  borderColor: "#A4A09A",
  borderTopWidth: "1px",
};

export const signature = {
  margin: "0",
  textAlign: "center" as const,
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "13px",
  lineHeight: "1.4",
  letterSpacing: "3px",
  color: "#0A0A0A",
  textTransform: "uppercase" as const,
};

const footerBlock = { paddingTop: "72px" };

const footerText = {
  margin: "0",
  textAlign: "center" as const,
  fontFamily: "Helvetica, Arial, sans-serif",
  fontSize: "11px",
  lineHeight: "1.7",
  letterSpacing: "0.5px",
  color: "#8C8880",
};