// Utility function to convert Blob URL to File
export const blobUrlToFile = async (blobUrl: string, fileName: string): Promise<File> => {
  const response = await fetch(blobUrl)
  const blob = await response.blob()

  return new File([blob], fileName, { type: blob.type })
}
