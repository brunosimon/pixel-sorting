import EventEmitter from './EventEmitter.js'

export default class PixelSorter extends EventEmitter
{
    /**
     * Constructor
     */
    constructor()
    {
        super()

        this.orientation = 'vertical' // horizontal | vertical
        this.order = 'default' // default | reverse
        this.direction = 'default' // default | reverse
        this.proportion = 1
        this.date = null

        this.setCanvas()
    }

    /**
     * Set canvas
     */
    setCanvas()
    {
        // Original
        this.original = {}
        this.original.canvas = document.createElement('canvas')
        this.original.canvas.width = 1
        this.original.canvas.height = 1
        this.original.canvas.classList.add('pixel-sorter-canvas', 'pixel-sorter-canvas--original')

        this.original.context = this.original.canvas.getContext('2d')

        // Sorted
        this.sorted = {}
        this.sorted.canvas = document.createElement('canvas')
        this.sorted.canvas.width = 1
        this.sorted.canvas.height = 1
        this.sorted.canvas.classList.add('pixel-sorter-canvas', 'pixel-sorter-canvas--sorted')

        this.sorted.context = this.sorted.canvas.getContext('2d')
    }

    /**
     * Sort
     */
    sort(imageSrc)
    {
        const image = new Image()
        image.crossOrigin = "Anonymous"

        image.addEventListener('load', () =>
        {
            this.image = image

            this.image.width *= this.proportion
            this.image.height *= this.proportion

            this.original.canvas.width = this.image.width
            this.original.canvas.height = this.image.height

            this.sorted.canvas.width = this.image.width
            this.sorted.canvas.height = this.image.height

            this.setPixels()
            this.sortPixels()
            this.drawPixels()
        })

        image.src = imageSrc

        this.date = new Date()
    }

    /**
     * Set pixels
     */
    setPixels()
    {
        // Draw original image
        this.original.context.drawImage(this.image, 0, 0, this.image.width, this.image.height)

        // Set rows
        this.rows = []
        
        // Get image data
        const imageData = this.original.context.getImageData(0, 0, this.image.width, this.image.height)

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
            if(this.orientation === 'horizontal')
            {
                // Create new row
                if(x === 0)
                {
                    this.rows.push([])
                }

                this.rows[y][x] = pixel
            }
            // Vertical
            else if(this.orientation === 'vertical')
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
            let pixel = null
            let newRow = []

            // Default order
            if(this.order === 'default')
            {
                let index = 0

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

                        if(this.direction === 'default' ? nextPixel.l > pixel.l : nextPixel.l < pixel.l)
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
            }

            // Reverse order
            else if(this.order === 'reverse')
            {
                let index = row.length - 1

                // Each pixel until end of row
                while(index >= 0)
                {
                    // Set first pixel and create chunk
                    pixel = row[index]
                    const chunk = [pixel]

                    // Each next pixel until condition failed or end of row
                    let nextIndex = index
                    while(--nextIndex >= 0)
                    {
                        const nextPixel = row[nextIndex]

                        if(this.direction === 'default' ? nextPixel.l > pixel.l : nextPixel.l < pixel.l)
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
                    index -= chunk.length
                }
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
        return b.l - a.l
    }

    /**
     * Draw pixels
     */
    drawPixels()
    {
        const imageData = this.sorted.context.createImageData(this.image.width, this.image.height)

        let index = 0

        // Each row
        for(let row of this.rows)
        {
            // Each pixel
            for(let pixel of row)
            {
                let pixelIndex = null

                // Horizontal
                if(this.orientation === 'horizontal')
                {
                    pixelIndex = index
                }
                // Vertical
                else if(this.orientation === 'vertical')
                {
                    const x = index % this.image.height
                    const y = Math.floor(index / this.image.height)

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
        this.sorted.context.putImageData(imageData, 0, 0)
    }
}