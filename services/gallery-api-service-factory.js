import DummyGalleryAPIService from "./dummy-gallery-api-service"
import MainGalleryAPIService from "./main-gallery-api-service"

export function getGalleryAPIService() {
    const developmentMode = process.env.DEVELOPMENT_MODE;
    if (developmentMode) {
        return new DummyGalleryAPIService()
    } else {
        return new MainGalleryAPIService()
    }
}

export const GalleryAPIServiceFactory = (function () {

    let instance

    function createInstance() {
        const developmentMode = process.env.DEVELOPMENT_MODE;

        if (developmentMode) {
            return new DummyGalleryAPIService()
        } else {
            return new MainGalleryAPIService()
        }
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance()
            }
            return instance
        }
    }

})()