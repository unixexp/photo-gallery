import Card from "@mui/material/Card"
import CardMedia from "@mui/material/CardMedia"

export default function UploadableCard({currentImage, setUploadableHandler, size}) {

    const handleUploadToState = (event) => {
        if (event.target.files && event.target.files[0]) {
            const uploadable = event.target.files[0]
            setUploadableHandler(uploadable)
        }
    }

    if (currentImage != null) {
        return (
            <Card>
                <label style={{cursor: "pointer"}}>
                    <CardMedia
                        component="img"
                        height={size}
                        image={currentImage}
                    />
                    <input style={{display: "none"}} type="file" onChange={handleUploadToState} />
                </label>
            </Card>
        )
    } else {
        return (
            <div>
                <label style={{cursor: "pointer"}}>
                    <div style={{padding: "8px", textAlign: "center"}}>Load image</div>
                    <input style={{display: "none"}} type="file" onChange={handleUploadToState} />
                </label>
            </div>
        )
    }

}