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
    }
}