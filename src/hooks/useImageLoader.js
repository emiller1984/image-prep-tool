import { useState, useCallback } from 'react'

/**
 * Load an image File into an HTMLImageElement.
 * Returns: { image, imageInfo, error, loading, loadImage, clearImage }
 */
export default function useImageLoader() {
  const [image, setImage] = useState(null)
  const [imageInfo, setImageInfo] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const loadImage = useCallback((file) => {
    setError(null)
    setLoading(true)

    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      setLoading(false)
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      setImage(img)
      setImageInfo({
        name: file.name,
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: file.size,
        type: file.type,
      })
      setLoading(false)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      setError('Failed to load image. The file may be corrupted or unsupported.')
      setLoading(false)
    }

    img.src = url
  }, [])

  const clearImage = useCallback(() => {
    if (image?.src) {
      URL.revokeObjectURL(image.src)
    }
    setImage(null)
    setImageInfo(null)
    setError(null)
  }, [image])

  return { image, imageInfo, error, loading, loadImage, clearImage }
}
