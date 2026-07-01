interface Dimensions {
  width: number;
  height: number;
}

/**
 * Calcula as novas dimensões de uma imagem para que não ultrapasse a dimensão máxima.
 */
const calculateNewDimensions = (width: number, height: number, maxDimension: number): Dimensions => {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }
  
  if (width > height) {
    return {
      width: maxDimension,
      height: Math.round((height * maxDimension) / width),
    };
  }

  return {
    width: Math.round((width * maxDimension) / height),
    height: maxDimension,
  };
};

/**
 * Comprime um arquivo de imagem para garantir que seu tamanho final seja menor ou igual ao limite.
 * Caso o arquivo original já seja menor ou igual ao limite, ele é retornado sem alterações.
 */
export async function compressImage(file: File, maxSizeBytes: number = 16 * 1024 * 1024): Promise<File> {
  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (readerEvent) => {
      const image = new Image();
      
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 2048;
        const newDimensions = calculateNewDimensions(image.width, image.height, maxDimension);

        canvas.width = newDimensions.width;
        canvas.height = newDimensions.height;

        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Não foi possível obter o contexto 2D do Canvas.'));
          return;
        }

        context.drawImage(image, 0, 0, newDimensions.width, newDimensions.height);

        const attemptCompression = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Falha ao gerar o Blob da imagem comprimida.'));
                return;
              }

              const isSizeAcceptable = blob.size <= maxSizeBytes;
              const isQualityAtMinimum = quality <= 0.1;

              if (isSizeAcceptable || isQualityAtMinimum) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
                return;
              }

              attemptCompression(quality - 0.15);
            },
            'image/jpeg',
            quality
          );
        };

        attemptCompression(0.85);
      };
      
      image.onerror = () => reject(new Error('Falha ao carregar a imagem.'));
      
      const fileDataUrl = readerEvent.target?.result;
      if (typeof fileDataUrl === 'string') {
        image.src = fileDataUrl;
        return;
      }
      
      reject(new Error('Formato de leitura de arquivo inválido.'));
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler o arquivo.'));
    reader.readAsDataURL(file);
  });
}
