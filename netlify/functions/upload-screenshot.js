import ImageKit from 'imagekit';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method Not Allowed' })
    };
  }

  try {
    const { file, fileName } = JSON.parse(event.body || '{}');
    
    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'No file provided' })
      };
    }

    if (!file.startsWith('data:')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Invalid file format. Must be base64 data URL' })
      };
    }

    const safeFileName = fileName || `payment_${Date.now()}.jpg`;

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !publicKey || !urlEndpoint) {
      console.error('Missing ImageKit credentials:', {
        hasPrivateKey: !!privateKey,
        hasPublicKey: !!publicKey,
        hasUrlEndpoint: !!urlEndpoint
      });
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: 'ImageKit credentials not configured' })
      };
    }

    const imagekit = new ImageKit({
      publicKey: publicKey,
      privateKey: privateKey,
      urlEndpoint: urlEndpoint
    });

    const uploadPayload = {
      file,
      fileName: safeFileName,
      folder: '/event-registrations/payment-screenshots',
      useUniqueFileName: true
    };

    console.log('Starting ImageKit upload:', { fileName: safeFileName });
    
    const data = await imagekit.upload(uploadPayload);
    
    console.log('Upload successful:', { url: data.url });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        url: data.url
      })
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message || 'Upload failed'
      })
    };
  }
}
