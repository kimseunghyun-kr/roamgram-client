export interface MediaFile {
    contentType: string;
    sizeBytes: number;
    originalFileName: string;
    s3Key?: string; // This will be returned by the backend after the pre-signed URL is created
  }

  export {}