import Head from 'next/head';
import { useState } from 'react';
import ColorPalettes from '../components/ColorPalettes';
import styles from './index.module.css';

export default function Home() {
  const [textInput, setTextInput] = useState('');
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
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
      setTextInput('');
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Color Palettes</title>
        <link rel='icon' href='/palette.png' />
      </Head>

      <main className={styles.main}>
        <img src='/palette.png' className={styles.icon} />
        <h3>Analyze text & generate palettes</h3>
        <form onSubmit={onSubmit}>
          <input
            type='text'
            name='text'
            placeholder='Enter a passage of text'
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <input type='submit' value='Generate palettes' />
        </form>
        <ColorPalettes palettes={result} />
      </main>
    </div>
  );
}
