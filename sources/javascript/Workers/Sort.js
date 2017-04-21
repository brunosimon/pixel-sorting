export default function()
{
    function sortPixels(rows, order, direction)
    {
        let newRows = []

        // Each row
        let rowIndex = 0
        for(let row of rows)
        {
            let pixel = null
            let newRow = []

            // Default order
            if(order === 'default')
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

                        if(direction === 'default' ? nextPixel.l > pixel.l : nextPixel.l < pixel.l)
                        {
                            chunk.push(nextPixel)
                        }
                        else
                        {
                            break
                        }
                    }

                    // Sort
                    chunk.sort(function(a, b){return b.l - a.l})

                    // Add chunk to new row
                    for(let chunkPixel of chunk)
                    {
                    	newRow.push(chunkPixel)
                    }

                    // Increment index
                    index += chunk.length
                }
            }

            // Reverse order
            else if(order === 'reverse')
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

                        if(direction === 'default' ? nextPixel.l > pixel.l : nextPixel.l < pixel.l)
                        {
                            chunk.push(nextPixel)
                        }
                        else
                        {
                            break
                        }
                    }

                    // Sort
                    chunk.sort(function(a, b){return b.l - a.l})

                    // Add chunk to new row
                    for(let chunkPixel of chunk)
                    {
                    	newRow.push(chunkPixel)
                    }

                    // Increment index
                    index -= chunk.length
                }
            }

            newRows[rowIndex] = newRow
            rowIndex++
        }

        return newRows
    }

    self.onmessage = function(event)
    {
    	const rows = sortPixels(event.data.rows, event.data.order, event.data.direction)
    	self.postMessage(rows)
    }
}