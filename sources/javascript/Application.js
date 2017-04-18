import EventEmitter from './EventEmitter.js'

export default class Application extends EventEmitter
{
    /**
     * Constructor
     */
    constructor()
    {
        super()

        this.setCanvas()
        this.loadImage()
    }

    /**
     * Set canvas
     */
    setCanvas()
    {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 800
        this.canvas.height = 800

        this.context = this.canvas.getContext('2d')

        document.body.appendChild(this.canvas)
    }

    /**
     * Load image
     */
    loadImage()
    {
        const image = new Image()

        image.addEventListener('load', () =>
        {
            this.image = image

            this.image.width *= 1
            this.image.height *= 1

            this.setPixels()
            this.sortPixels()
            this.drawPixels()
        })

        image.src = 'assets/images/test-400x400-2.jpg'
    }

    /**
     * Set pixels
     */
    setPixels()
    {
        // Draw image
        this.context.drawImage(this.image, 0, 0, this.image.width, this.image.height)

        // Set rows
        this.rows = []
        
        // Get image data
        const imageData = this.context.getImageData(0, 0, this.image.width, this.image.height)

        // Each pixel
        for(let index = 0; index < imageData.data.length; index += 4)
        {
            const pixelIndex = Math.floor(index / 4)

            // Create new row
            if(pixelIndex % this.image.width === 0)
            {
                this.rows.push([])
            }

            // Create pixel
            const pixel = {}
            pixel.r = imageData.data[index + 0]
            pixel.g = imageData.data[index + 1]
            pixel.b = imageData.data[index + 2]
            pixel.l = (pixel.r + pixel.g + pixel.b) / 3

            // Add to rows
            const row = Math.floor(pixelIndex / this.image.width)
            this.rows[row].push(pixel)
        }
    }

    /**
     * Sort pixels
     */
    sortPixels()
    {
        // Each row
        for(let row of this.rows)
        {
            row.sort(this.compare)
        }
    }

    /**
     * Compare function
     */
    compare(a, b)
    {
        return a.l - b.l
    }

    /**
     * Draw pixels
     */
    drawPixels()
    {
        const imageData = this.context.createImageData(this.image.width, this.image.height)

        let pixelIndex = 0

        // Each row
        for(let row of this.rows)
        {
            // Each pixel
            for(let pixel of row)
            {
                // Fill image data
                imageData.data[pixelIndex * 4 + 0] = pixel.r
                imageData.data[pixelIndex * 4 + 1] = pixel.g
                imageData.data[pixelIndex * 4 + 2] = pixel.b
                imageData.data[pixelIndex * 4 + 3] = 255

                // Update pixel index
                pixelIndex++
            }
        }

        // Draw back in canvas
        this.context.putImageData(imageData, this.image.width, 0)
    }
}