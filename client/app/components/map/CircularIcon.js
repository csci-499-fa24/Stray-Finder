// Function to create a circular icon, with fallback color if the image fails to load
export const createCircularIcon = (imageUrl, fallbackColor, callback) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl

    img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 50
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')

        // Create a circular clip for the icon
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

        // Draw the image within the circular region
        ctx.drawImage(img, 0, 0, size, size)

        callback(canvas.toDataURL())
    }

    img.onerror = () => {
        // Draw a colored circle as a fallback if the image fails to load
        const canvas = document.createElement('canvas')
        const size = 50
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')

        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fillStyle = fallbackColor
        ctx.fill()

        callback(canvas.toDataURL())
    }
}
