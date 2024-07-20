import React from 'react'
import { Gallery, Carousel } from './ViewProductImgs.styled'

type Props = {
  imgs: string[] | undefined
}

export const ViewProductImgs: React.FC<Props> = ({ imgs }) => {
  const isMobile = window.matchMedia('(max-width: 480px)').matches
  const loadingImage = 'https://res.cloudinary.com/andresgarcia/image/upload/v1721432239/stockhub/Loading_icon.gif'

  const imgCount = imgs ? imgs.length : 0

  return isMobile ? (
    <Carousel id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" data-interval="false">
      <div className="carousel-inner">
        {imgs === undefined ? (
          <div className="carousel-item active">
            <img src={loadingImage} className="d-block w-100" alt="loading_image" />
          </div>
        ) : (
          imgs.map((img, idx) => (
            <div className={`carousel-item ${idx === 0 ? 'active' : ''}`} key={idx}>
              <img src={img} className="d-block w-100" alt={`image_${idx}`} />
            </div>
          ))
        )}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </Carousel>
  ) : (
    <Gallery imgCount={imgCount}>
      {imgs === undefined ? (
        <div className="loading-image">
          <img src={loadingImage} alt="loading_image" />
        </div>
      ) : (
        imgs.map((imgPath, idx) => (
          <figure className={`gallery__item gallery__item--${idx + 1}`} key={idx}>
            <img src={imgPath} className="gallery__img" alt={`gallery_image_${idx + 1}`} />
          </figure>
        ))
      )}
    </Gallery>
  )
}
