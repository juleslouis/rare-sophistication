import React from "react";
import { Img } from "@react-email/components";
import { DivusLayout, type EmailLocale } from "./divus-layout";
import type { TemplateEntry } from "./registry";

interface Props {
  locale?: EmailLocale;
}

const IMAGE_URL = "https://divus.lovable.app/email/atelier.jpg";

const copy = {
  fr: {
    preview: "DIVUS — un premier indice.",
    alt: "Des mains à l'ouvrage dans l'atelier.",
  },
  en: {
    preview: "DIVUS — a first clue.",
    alt: "Hands at work in the atelier.",
  },
};

const Email = ({ locale = "fr" }: Props) => {
  const t = copy[locale] ?? copy.fr;
  return (
    <DivusLayout locale={locale} preview={t.preview} showHeader={false}>
      <Img src={IMAGE_URL} alt={t.alt} width="520" height="640" style={image} />
      <div style={signatureSpace} />
    </DivusLayout>
  );
};

export const template = {
  component: Email,
  subject: (data: Record<string, any>) =>
    data?.locale === "en" ? "DIVUS" : "DIVUS",
  displayName: "Indice visuel — Atelier",
  previewData: { locale: "fr" },
} satisfies TemplateEntry;

const image = {
  display: "block",
  width: "100%",
  maxWidth: "520px",
  height: "640px",
  objectFit: "cover" as const,
  margin: "0",
};

const signatureSpace = { height: "40px", lineHeight: "40px" };
