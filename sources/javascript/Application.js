import EventEmitter from './EventEmitter.js'

export default class Application extends EventEmitter
{
    /**
     * Constructor
     */
    constructor()
    {
        super()

        this.direction = 'vertical' // horizontal | vertical

        this.setCanvas()
        this.loadImage()
    }

    /**
     * Set canvas
     */
    setCanvas()
    {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 1600
        this.canvas.height = 1600

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

        image.src = 'assets/images/400x400-5.jpg'
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
            const x = pixelIndex % this.image.width
            const y = Math.floor(pixelIndex / this.image.width)

            // Create pixel
            const pixel = {}
            pixel.r = imageData.data[index + 0] / 255
            pixel.g = imageData.data[index + 1] / 255
            pixel.b = imageData.data[index + 2] / 255
            pixel.l = (pixel.r + pixel.g + pixel.b) / 3

            // Horizontal
            if(this.direction === 'horizontal')
            {
                // Create new row
                if(x === 0)
                {
                    this.rows.push([])
                }

                this.rows[y][x] = pixel
            }
            // Vertical
            else if(this.direction === 'vertical')
            {
                // Create new row
                if(y === 0)
                {
                    this.rows.push([])
                }

                this.rows[x][y] = pixel
            }
        }
    }

    /**
     * Sort pixels
     */
    sortPixels()
    {
        // Each row
        let rowIndex = 0
        for(let row of this.rows)
        {
            let index = 0
            let pixel = null
            let newRow = []

            // Each pixel until end of row
            while(index < row.length)
            {
                // Set first pixel and create chunk
                pixel = row[index]
                const chunk = [pixel]

                // Each next pixel until condition failed or end of row
                let nextIndex = index
                while(++nextIndex < row.length)
                {
                    const nextPixel = row[nextIndex]

                    if(nextPixel.l > pixel.l)
                    {
                        chunk.push(nextPixel)
                    }
                    else
                    {
                        break
                    }
                }

                // Sort
                chunk.sort(this.compare)

                // Add chunk to new row
                newRow = [...newRow, ...chunk]

                // Increment index
                index += chunk.length
            }

            this.rows[rowIndex] = newRow
            rowIndex++
        }
    }

    /**
     * Compare function
     */
    compare(a, b)
    {
        let aValue = 0
        let bValue = 0

        // Lightness
        aValue = a.l
        bValue = b.l

        // // Red
        // aValue = a.r
        // bValue = b.r

        // // Blue
        // aValue = a.r
        // bValue = b.r
        
        // aValue = (Math.floor(a.r * 10) / 10) * 1000 + (Math.floor(a.g * 10) / 10) * 10000 + a.b * 100
        // bValue = (Math.floor(b.r * 10) / 10) * 1000 + (Math.floor(b.g * 10) / 10) * 10000 + b.b * 100
        
        // aValue = (Math.floor(a.r * 5) / 5) * 1000 + a.b
        // bValue = (Math.floor(b.r * 5) / 5) * 1000 + b.b
        
        // aValue = (Math.floor(a.b * 4) / 4)
        // bValue = (Math.floor(b.b * 4) / 4)

        return bValue - aValue
    }

    /**
     * Draw pixels
     */
    drawPixels()
    {
        const imageData = this.context.createImageData(this.image.width, this.image.height)

        let index = 0

        // Each row
        for(let row of this.rows)
        {
            // Each pixel
            for(let pixel of row)
            {
                let pixelIndex = null

                // Horizontal
                if(this.direction === 'horizontal')
                {
                    pixelIndex = index
                }
                // Vertical
                else if(this.direction === 'vertical')
                {
                    const x = index % this.image.width
                    const y = Math.floor(index / this.image.width)

                    pixelIndex = x * this.image.width + y
                }

                // Fill image data
                imageData.data[pixelIndex * 4 + 0] = pixel.r * 255
                imageData.data[pixelIndex * 4 + 1] = pixel.g * 255
                imageData.data[pixelIndex * 4 + 2] = pixel.b * 255
                imageData.data[pixelIndex * 4 + 3] = 255

                // Update pixel index
                index++
            }
        }

        // Draw back in canvas
        this.context.putImageData(imageData, this.image.width, 0)
    }
}