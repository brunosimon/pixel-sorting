import PixelSorter from './PixelSorter.js'

export default class Application
{
    /**
     * Constructor
     */
    constructor()
    {
        this.pixelSorter = new PixelSorter()
        this.pixelSorter.sort('https://unsplash.it/500/500/?random')

        document.body.appendChild(this.pixelSorter.original.canvas)
        document.body.appendChild(this.pixelSorter.sorted.canvas)
    }
}