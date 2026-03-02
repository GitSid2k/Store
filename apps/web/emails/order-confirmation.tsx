import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  total: number;
}

export const OrderConfirmationEmail = ({
  orderId,
  customerName,
  total,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Ваш заказ от "Дуб & Сталь" подтвержден</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={heading}>Заказ #{orderId.slice(-8).toUpperCase()}</Heading>
        </Section>
        <Section style={content}>
          <Text style={paragraph}>Здравствуйте, {customerName}!</Text>
          <Text style={paragraph}>
            Спасибо за заказ в "Дуб & Сталь". Мы получили ваш заказ и уже начали
            его обработку. В ближайшее время мы свяжемся с вами для уточнения
            деталей доставки.
          </Text>
          <Text style={paragraph}>
            <strong>Сумма заказа:</strong> {new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(total)}
          </Text>
        </Section>
        <Section style={footer}>
          <Text style={footerText}>
            С уважением,<br />
            Команда "Дуб & Сталь"
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  padding: "0 48px",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const content = {
  padding: "0 48px",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const footer = {
  padding: "0 48px",
};

const footerText = {
  fontSize: "14px",
  lineHeight: "1.5",
  color: "#9ca299",
};
