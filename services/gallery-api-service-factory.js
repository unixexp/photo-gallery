import DummyGalleryAPIService from "./dummy-gallery-api-service"
import GalleryAPIService from "./gallery-api-service"

export function getGalleryAPIService() {
    const developmentMode = process.env.DEVELOPMENT_MODE;
    if (developmentMode) {
        return new DummyGalleryAPIService()
    } else {
        return new GalleryAPIService()
    }
}

const GalleryAPIServiceFactory = (function () {
    let instance

    
})()

export default GalleryAPIServiceFactory