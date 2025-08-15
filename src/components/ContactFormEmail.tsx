import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type ContactFormEmailProps = {
  message: string;
  senderEmail: string;
  senderName: string;
};

const ContactFormEmail = ({ message, senderEmail, senderName }: ContactFormEmailProps) => (
  <Html>
    <Head>
      <Tailwind>
        <Body className='bg-slate-200 text-black'>
          <Container>
            <Section className='bg-white my-10 px-10 rounded-md'>
              <Heading className='leading-tight'>
                You received this message from contact form in your portfolio.
              </Heading>
              <Text>{message}</Text>
              <Hr />
              <Text>
                From: {senderName} ({senderEmail})
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Head>
  </Html>
);

export default ContactFormEmail;
