const DEFAULT_OPTIONS = {
  maxWidth: 1200,
  maxHeight: 1200,
  initialQuality: 0.82,
  minQuality: 0.35,
  qualityStep: 0.07,
  maxDataUrlLength: 900_000,
  outputType: 'image/jpeg',
};

export const processImageFile = (file, options = {}) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }

    const settings = { ...DEFAULT_OPTIONS, ...options };
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        let { width, height } = image;

        if (width > settings.maxWidth || height > settings.maxHeight) {
          const ratio = Math.min(settings.maxWidth / width, settings.maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Canvas is not supported'));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        let quality = settings.initialQuality;
        let output = canvas.toDataURL(settings.outputType, quality);

        while (output.length > settings.maxDataUrlLength && quality > settings.minQuality) {
          quality -= settings.qualityStep;
          output = canvas.toDataURL(settings.outputType, quality);
        }

        if (output.length > settings.maxDataUrlLength) {
          reject(new Error('Image is too large after compression'));
          return;
        }

        resolve(output);
      };

      image.onerror = () => reject(new Error('Invalid image file'));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
