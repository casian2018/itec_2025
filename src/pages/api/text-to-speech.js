export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, voiceId } = req.body;

    if (!text || !voiceId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5
            }
          }),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('ElevenLabs API error:', errorData);
        throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();

      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(audioBuffer));
    } catch (error) {
      console.error('Text-to-Speech error:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
