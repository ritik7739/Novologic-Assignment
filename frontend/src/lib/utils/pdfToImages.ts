const DEFAULT_SCALE = 2;
export const MAX_EMBEDDED_PDF_PAGES = 50;
const PDFJS_VERSION = '3.11.174';
const PDFJS_CDN_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
const PDFJS_WORKER_URL = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

type RenderPdfPagesOptions = {
  maxPages?: number;
  onProgress?: (currentPage: number, totalPages: number) => void;
};

type PdfJsModule = typeof import('pdfjs-dist/legacy/build/pdf');

declare global {
  interface Window {
    pdfjsLib?: PdfJsModule;
  }
}

let pdfJsLoadPromise: Promise<PdfJsModule> | null = null;

function loadPdfJs() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('PDF rendering is only available in the browser'));
  }

  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    return Promise.resolve(window.pdfjsLib);
  }

  pdfJsLoadPromise ??= new Promise<PdfJsModule>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[data-pdfjs-version="${PDFJS_VERSION}"]`);
    const script = existingScript ?? document.createElement('script');

    script.dataset.pdfjsVersion = PDFJS_VERSION;
    script.src = PDFJS_CDN_URL;
    script.async = true;

    script.addEventListener(
      'load',
      () => {
        if (!window.pdfjsLib) {
          reject(new Error('PDF.js failed to load'));
          return;
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        resolve(window.pdfjsLib);
      },
      { once: true },
    );
    script.addEventListener('error', () => reject(new Error('PDF.js failed to load')), { once: true });

    if (!existingScript) {
      document.head.append(script);
    }
  });

  return pdfJsLoadPromise;
}

function canvasToPngBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to render PDF page'));
        return;
      }

      resolve(blob);
    }, 'image/png');
  });
}

export async function renderPdfPagesToImages(file: File, options: RenderPdfPagesOptions = {}): Promise<Blob[]> {
  const pdfjsLib = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = Math.min(pdfDoc.numPages, options.maxPages ?? pdfDoc.numPages);
  const pageImages: Blob[] = [];

  try {
    for (let pageNum = 1; pageNum <= totalPages; pageNum += 1) {
      options.onProgress?.(pageNum, totalPages);

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: DEFAULT_SCALE });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Canvas is not supported in this browser');
      }

      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      await page.render({ canvasContext: context, viewport }).promise;
      pageImages.push(await canvasToPngBlob(canvas));
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
    }

    return pageImages;
  } finally {
    await pdfDoc.cleanup();
    loadingTask.destroy();
  }
}
