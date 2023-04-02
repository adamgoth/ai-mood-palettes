import Head from 'next/head';
import { useState } from 'react';
import ColorPalettes from '../components/ColorPalettes';
import { Flex, Button, Image, Heading, Textarea, Text } from '@chakra-ui/react';

export default function Home() {
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(JSON.parse(data.result));
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <Head>
        <title>OpenAI Color Palettes</title>
        <link rel='icon' href='/palette.png' />
      </Head>

      <Flex
        as='main'
        sx={{ flexDirection: 'column', alignItems: 'center', pt: '60px' }}
      >
        <Image width='34px' src='/palette.png' />
        <Heading
          sx={{
            fontSize: '32px',
            lineHeight: '40px',
            fontWeight: 'bold',
            color: '#202123',
            m: '16px 0 40px',
          }}
        >
          Analyze text & generate palettes
        </Heading>
        <form onSubmit={onSubmit}>
          <Flex sx={{ width: '320px', flexDir: 'column' }}>
            <Textarea
              type='text'
              name='text'
              placeholder='Enter a passage of text'
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <Button
              isLoading={isLoading}
              colorScheme={'green'}
              type='submit'
              sx={{ mt: '16px' }}
            >
              Generate palette
            </Button>
          </Flex>
        </form>
      </Flex>
      {result && (
        <Flex
          sx={{
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <ColorPalettes palette={result.palette} />
          <Text sx={{ maxWidth: '450px', textAlign: 'center', mt: '12px' }}>
            {result.analysis}
          </Text>
        </Flex>
      )}
    </div>
  );
}
