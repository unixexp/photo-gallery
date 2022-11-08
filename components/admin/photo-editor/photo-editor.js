import { useState } from "react"
import { useSelector } from "react-redux"
import { selectCategory } from "../adminSlice"

import { ImageList } from "@mui/material"
import PhotoElement from "./photo-element/photo-element"

export default function PhotoEditor({ galleryAPIService }) {

    const category = useSelector(selectCategory)
    const itemData = loadPhotos()

    const handleOpenCreatePhotoDialog = () => {}
    const handleOpenEditPhotoDialog = (id) => {}
    const handleOpenDeletePhotoDialog = (id) => {}

    return (
        <ImageList cols={5} gap={8}>
            {itemData.map((item) => (
                <PhotoElement
                    key={item.id}
                    image={item}
                    handleOpenCreatePhotoDialog={handleOpenCreatePhotoDialog}
                    handleOpenEditPhotoDialog={handleOpenEditPhotoDialog}
                    handleOpenDeletePhotoDialog={handleOpenDeletePhotoDialog}
                />
            ))}
        </ImageList>
      )

}

const loadPhotos = () => {

    return [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
            description: 'swabdesign',
            n: 1
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
            description: 'Pavel Nekoranec',
            n: 2
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
            description: 'Charles Deluvio',
            n: 3
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
            description: 'Christian Mackie',
            n: 4
        },
        {
            id: 5,
            url: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
            description: 'Darren Richardson',
            n: 5
        },
        {
            id: 6,
            url: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
            description: 'Taylor Simpson',
            n: 6
        },
        {
            id: 7,
            url: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
            description: 'Ben Kolde',
            n: 7
        },
        {
            id: 8,
            url: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
            description: 'Philipp Berndt',
            n: 8
        },
        {
            id: 9,
            url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
            description: 'Jen P.',
            n: 9
        },
        {
            id: 10,
            url: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
            description: 'Douglas Sheppard',
            n: 10
        },
        {
            id: 11,
            url: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
            description: 'Fi Bell',
            n: 11
        },
        {
            id: 12,
            url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
            description: 'Hutomo Abrianto',
            n: 12
        },
      ];

}