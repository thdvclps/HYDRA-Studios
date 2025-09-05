import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { Mode, CreateFunction, EditFunction, ImageFile, AspectRatio, HistoryItem } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. Please set your API key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const fileToBase64 = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = error => reject(error);
  });
};

const getCreatePrompt = (basePrompt: string, func: CreateFunction): string => {
    switch (func) {
        case 'sticker':
            return `A die-cut sticker of ${basePrompt}, vector art, vibrant colors, with a thin white border, on a neutral background.`;
        case 'text':
            return `A modern, minimalist logo for "${basePrompt}", vector design, clean lines, suitable for a tech company, on a white background.`;
        case 'comic':
            return `${basePrompt}, in the style of a classic comic book panel, with bold outlines, halftone dots, and dramatic shading.`;
        case 'free':
        default:
            return basePrompt;
    }
};

const getImageDetailsFromDataUrl = (imageDataUrl: string): Promise<{ width: number; height: number; size: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const base64String = imageDataUrl.split(',')[1];
            if (!base64String) {
                return reject(new Error("Invalid data URL for size calculation."));
            }
            // Decode base64 to get byte length for a more accurate size.
            const sizeInBytes = window.atob(base64String).length;
            const sizeInKB = Math.round(sizeInBytes / 1024);

            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
                size: sizeInKB,
            });
        };
        img.onerror = (err) => {
            console.error("Failed to load image for details", err);
            reject(new Error("Could not load image to get details."));
        };
        img.src = imageDataUrl;
    });
};


export const generateImage = async (
    mode: Mode,
    func: CreateFunction | EditFunction,
    prompt: string,
    image1?: ImageFile,
    image2?: ImageFile,
    aspectRatio: AspectRatio = '1:1'
): Promise<Omit<HistoryItem, 'id' | 'createdAt'>> => {
    try {
        let imageDataUrl: string | undefined;

        if (mode === 'create') {
            const fullPrompt = getCreatePrompt(prompt, func as CreateFunction);
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: fullPrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio,
                },
            });
            if (response.generatedImages && response.generatedImages.length > 0) {
                 const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                 imageDataUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            } else {
                throw new Error("No image was generated.");
            }
        } else { // edit mode
            if (!image1) throw new Error("An image is required for editing.");
            
            let editPrompt = prompt;
            if (func === 'compose' && image2) {
                 editPrompt = `${prompt}. Use the first provided image as the primary subject and structure.`;
            }

            const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        { inlineData: { data: image1.base64, mimeType: image1.mimeType } },
                        { text: editPrompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            if (response.candidates && response.candidates[0].content && Array.isArray(response.candidates[0].content.parts)) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        imageDataUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                        break;
                    }
                }
            }

            if (!imageDataUrl) {
              const textResponse = response.text;
              if (textResponse) {
                  throw new Error(`Image editing failed: ${textResponse}`);
              }
              throw new Error("No edited image was returned. This may be due to safety settings.");
            }
        }
        
        const details = await getImageDetailsFromDataUrl(imageDataUrl);

        return {
            imageDataUrl,
            ...details
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error(`Failed to generate image. ${error instanceof Error ? error.message : String(error)}`);
    }
};


export { fileToBase64 };