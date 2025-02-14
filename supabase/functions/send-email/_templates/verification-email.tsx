
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Hr,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface VerificationEmailProps {
  userEmail: string;
  verificationUrl: string;
}

export const VerificationEmail = ({
  userEmail,
  verificationUrl,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address for Saver</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to Saver!</Heading>
        
        <Text style={text}>
          Thanks for signing up! Please verify your email address to get started.
        </Text>
        
        <Button href={verificationUrl} style={button}>
          Verify Email Address
        </Button>
        
        <Text style={text}>
          Or copy and paste this URL into your browser:
        </Text>
        
        <Text style={link}>{verificationUrl}</Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          If you didn't create an account with Saver, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
}

const text = {
  color: '#444444',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '24px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '100%',
  margin: '24px auto',
  maxWidth: '260px',
  padding: '16px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
}

const link = {
  color: '#2563eb',
  fontSize: '14px',
  textDecoration: 'none',
  margin: '16px 0 32px',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#dddddd',
  margin: '42px 0 26px',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  margin: '12px 0',
}

export default VerificationEmail;
