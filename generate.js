export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageBase64, productName, scene, person, style } = req.body;

  if (!imageBase64) return res.status(400).json({ error: 'Imagen requerida' });

  const FAL_KEY = process.env.FAL_KEY;
  if (!FAL_KEY) return res.status(500).json({ error: 'FAL_KEY no configurada' });

  const scenes = {
    workshop: 'professional electronics repair workshop with tools on workbench, warm industrial lighting, dark background',
    home: 'clean modern home environment, cozy natural lighting',
    outdoor: 'dramatic outdoor night adventure, mountains and stars, dark cinematic lighting',
    gym: 'modern gym, energetic atmosphere, fitness equipment visible',
    studio: 'clean white photography studio, soft professional lighting',
  };

  const persons = {
    man30: 'confident Latin American male technician in his 30s, wearing safety glasses, focused professional expression',
    woman30: 'confident Latin American female professional in her late 20s, smiling naturally',
    couple: 'happy smiling Latin American couple in their 30s, casual modern clothing',
    young: 'young Latin American person in their early 20s, casual trendy style, big smile',
    kid: 'happy excited Latin American child around 8 years old, big joyful smile',
  };

  const styles = {
    t1: 'dark dramatic cinematic style, dark blue and black background, strong rim lighting, moonlight effect',
    t2: 'modern lifestyle dark background, professional and sleek, bold vibrant colors',
    t3: 'bright clean light gray background, health and fitness lifestyle, fresh natural colors',
    t4: 'dark tech futuristic environment, blue and cyan glow effects',
    t5: 'colorful vibrant pink background, playful fun theme',
  };

  const prompt = `Professional commercial advertisement photo for Latin American e-commerce. ${persons[person] || persons.man30}, in ${scenes[scene] || scenes.workshop}, confidently using or holding this exact product. ${styles[style] || styles.t1}. The product from the reference image is prominently visible and clearly identifiable in the scene. Photo-realistic, high quality commercial photography, vibrant colors, sharp focus, vertical composition 9:16 ratio. No text, no logos, no watermarks.`;

  try {
    const response = await fetch('https://fal.run/fal-ai/flux-pro/kontext', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_url: imageBase64,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        image_size: 'portrait_16_9',
      }),
    });

    const data = await response.json();

    if (data.error) return res.status(400).json({ error: data.error });
    if (!data.images || !data.images[0]) return res.status(400).json({ error: 'No se generó imagen', data });

    res.json({ imageUrl: data.images[0].url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const config = { api: { bodyParser: { sizeLimit: '20mb' } } };
