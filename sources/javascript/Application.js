import PixelSorter from './PixelSorter.js'
import DatGUI from 'dat-gui'

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

        this.setDebug()
    }

    /**
     * Set debug
     */
    setDebug()
    {
        this.ui = new DatGUI.GUI()

        const config = {}

        // Options
        config.options = {}
        config.options.folder = this.ui.addFolder('options')
        config.options.fetch = () =>
        {
            this.pixelSorter.sort(this.pixelSorter.image.src)
        }

        config.options.folder.open()
        config.options.folder.add(this.pixelSorter, 'orientation', ['vertical', 'horizontal'])
        config.options.folder.add(this.pixelSorter, 'order', ['default', 'reverse'])
        config.options.folder.add(this.pixelSorter, 'direction', ['default', 'reverse'])
        config.options.folder.add(config.options, 'fetch').name('fetch same again')

        // From unsplash.it
        config.unsplashIt = {}
        config.unsplashIt.folder = this.ui.addFolder('from unsplash.it')
        config.unsplashIt.width = 500
        config.unsplashIt.height = 500
        config.unsplashIt.fetch = () =>
        {
            this.pixelSorter.sort(`https://unsplash.it/${config.unsplashIt.width}/${config.unsplashIt.height}/?random=${+ new Date()}`)
        }

        config.unsplashIt.folder.open()
        config.unsplashIt.folder.add(config.unsplashIt, 'width', 1, 2000)
        config.unsplashIt.folder.add(config.unsplashIt, 'height', 1, 2000)
        config.unsplashIt.folder.add(config.unsplashIt, 'fetch').name('fetch random')

        // From URL
        config.fromURL = {}
        config.fromURL.folder = this.ui.addFolder('from URL')
        config.fromURL.url = ''
        config.fromURL.fetch = () =>
        {
            this.pixelSorter.sort(config.fromURL.url)
        }

        config.fromURL.folder.open()
        config.fromURL.folder.add(config.fromURL, 'url')
        config.fromURL.folder.add(config.fromURL, 'fetch').name('fetch from URL')

        // Upload
        const $input = document.createElement('input')
        const reader = new FileReader()

        reader.addEventListener('load', () =>
        {
            this.pixelSorter.sort(reader.result)
        })

        $input.type = 'file'
        $input.accept = 'image/*'
        $input.addEventListener('change', (event) =>
        {
            reader.readAsDataURL($input.files[0])
        })

        config.fromFile = {}
        config.fromFile.folder = this.ui.addFolder('from file')
        config.fromFile.upload = () =>
        {
            $input.click()
        }

        config.fromFile.folder.open()
        config.fromFile.folder.add(config.fromFile, 'upload').name('fetch from file')

        // Download
        config.download = {}
        config.download.$link = document.createElement('a')
        config.download.folder = this.ui.addFolder('download')
        config.download.downloadOriginal = () =>
        {
            // Download
            config.download.$link.href = this.pixelSorter.original.canvas.toDataURL()
            config.download.$link.download = `pixel_sorting-original-${this.pixelSorter.original.canvas.width}x${this.pixelSorter.original.canvas.height}-${+ this.pixelSorter.date}.png`
            config.download.$link.click()
        }
        config.download.downloadSorted = () =>
        {
            // Download
            config.download.$link.href = this.pixelSorter.sorted.canvas.toDataURL()
            config.download.$link.download = `pixel_sorting-sorted-${this.pixelSorter.sorted.canvas.width}x${this.pixelSorter.sorted.canvas.height}-${+ this.pixelSorter.date}.png`
            config.download.$link.click()
        }
        config.download.downloadBoth = () =>
        {
            // Create a canvas contening both original and sorted results
            const width = this.pixelSorter.sorted.canvas.width
            const height = this.pixelSorter.sorted.canvas.height

            const canvas = document.createElement('canvas')
            canvas.width = width * 2
            canvas.height = height

            const context = canvas.getContext('2d')

            context.drawImage(this.pixelSorter.original.canvas, 0, 0, width, height)
            context.drawImage(this.pixelSorter.sorted.canvas, width, 0, width, height)

            // Download
            config.download.$link.href = canvas.toDataURL()
            config.download.$link.download = `pixel_sorting-both-${width}x${height}-${+ this.pixelSorter.date}.png`
            config.download.$link.click()
        }

        config.download.folder.open()
        config.download.folder.add(config.download, 'downloadOriginal').name('original')
        config.download.folder.add(config.download, 'downloadSorted').name('sorted')
        config.download.folder.add(config.download, 'downloadBoth').name('both')
    }
}