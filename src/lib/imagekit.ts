// ImageKit upload utility - uploads via Netlify function

async function compressImage(file: File, maxWidth = 800, quality = 0.7): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob || file);
          },
          'image/jpeg',
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadScreenshotToImageKit(
  file: File,
  registrationId: string
): Promise<string> {
  try {
    // Compress image before uploading
    const compressedBlob = await compressImage(file, 600, 0.65);
    const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });

    const base64File = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    });

    const response = await fetch('/.netlify/functions/upload-screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file: base64File,
        fileName: `payment_${registrationId}_${Date.now()}.jpg`
      })
    });

    if (!response.ok) {
      let message = `Upload failed (${response.status}): ${response.statusText}`;
      try {
        const errorData = await response.json();
        message = errorData.message || message;
        console.error('Upload error details:', errorData);
      } catch {
        // Could not parse error response
      }
      throw new Error(message);
    }

    const data = await response.json();
    if (!data.success || !data.url) {
      throw new Error('Upload failed: Invalid response from server');
    }

    return data.url;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    if (error instanceof Error) {
      throw error; // Re-throw with original message
    }
    throw new Error('Failed to upload payment screenshot. Please try again.');
  }
}
