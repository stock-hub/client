import "./ViewProductImgs.css"

const ViewProductImgs = ({ imgs }) => {
  const isMobile = window.matchMedia("(max-width: 480px)").matches
  const loadingImage = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3ALoading_icon.gif&psig=AOvVaw1XQ5qtfInku40St5KZ_HAT&ust=1666533660116000&source=images&cd=vfe&ved=0CA0QjRxqFwoTCOja1uj_8_oCFQAAAAAdAAAAABAE'

  return (
    isMobile
      ?
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" data-interval="false">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={imgs === undefined ? loadingImage : imgs[0]} className="d-block w-100" alt="first_image" />
          </div>
          <div className="carousel-item">
            <img src={imgs === undefined ? loadingImage : imgs[1]} className="d-block w-100" alt="second_image" />
          </div>
          <div className="carousel-item">
            <img src={imgs === undefined ? loadingImage : imgs[2]} className="d-block w-100" alt="third_image" />
          </div>
          <div className="carousel-item">
            <img src={imgs === undefined ? loadingImage : imgs[3]} className="d-block w-100" alt="fourth_image" />
          </div>
          <div className="carousel-item">
            <img src={imgs === undefined ? loadingImage : imgs[4]} className="d-block w-100" alt="fifth_image" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      :
      <div className="gallery">
        {
          imgs?.map((imgPath, idx) => {
            return <figure className={`gallery__item gallery__item--${idx + 1}`} key={idx}>
              <img src={imgPath} className="gallery__img" alt={`gallery_image_${idx + 1}`} />
            </figure>
          })
        }
      </div>
  )
}

export default ViewProductImgs