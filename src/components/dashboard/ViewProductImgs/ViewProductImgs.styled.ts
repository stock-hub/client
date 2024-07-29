import styled from 'styled-components'

export const Gallery = styled.div<{ $imgCount: number }>`
  display: grid;
  grid-gap: 5px;
  grid-template-columns: 10;
  grid-template-rows: 5;
  position: relative;
  margin-bottom: 2rem;

  & .gallery__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${({ $imgCount }) =>
    $imgCount === 1 &&
    `

& .gallery__item--1 {
  grid-template-columns: 4fr;
  grid-template-rows: 1fr;
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  margin: 0;
  
  & img {
    border-radius: 10px;
    width: 70%
  }
}

& .loading-image {
  grid-column: 1 / 9;
  grid-row: 1 / 9;
  display: flex;
  justify-content: center;
  align-items: center;
  
  & img {
    width: 100px;
    height: 100px;
  }
}
`}

  ${({ $imgCount }) =>
    $imgCount === 2 &&
    `

& .gallery__item--1 {
  grid-column: 1 / 5;
  grid-row: 1 / 5;
  margin: 0;
  
  & img {
    border-radius: 10px 0 0 10px;
  }
}

& .gallery__item--2 {
  grid-column: 5 / 10;
  grid-row: 1 / 5;
  margin: 0;

  & img {
    border-radius: 0 10px 10px 0;
  }
}

& .loading-image {
  grid-column: 1 / 9;
  grid-row: 1 / 9;
  display: flex;
  justify-content: center;
  align-items: center;
  
  & img {
    width: 100px;
    height: 100px;
  }
}
`}

  ${({ $imgCount }) =>
    $imgCount === 3 &&
    `

& .gallery__item--1 {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  margin: 0;
  
  & img {
    border-radius: 10px 0 0 10px;
  }
}

& .gallery__item--2 {
  grid-column: 4 / 6;
  grid-row: 1 / 3;
  margin: 0;
}

& .gallery__item--3 {
  grid-column: 7 / 9;
  grid-row: 1 / 3;
  margin: 0;
  
  & img {
    border-radius: 0 10px 10px 0;
  }
}

& .loading-image {
  grid-column: 1 / 9;
  grid-row: 1 / 9;
  display: flex;
  justify-content: center;
  align-items: center;
  
  & img {
    width: 100px;
    height: 100px;
  }
}
`}

  ${({ $imgCount }) =>
    $imgCount > 3 &&
    `

& .gallery__item--1 {
  grid-column: 1 / 5;
  grid-row: 1 / 5;
  margin: 0;
  
  & img {
    border-radius: 10px 0 0 10px;
  }
}

& .gallery__item--2 {
  grid-column: 5 / 7;
  grid-row: 1 / 3;
  margin: 0;
}

& .gallery__item--3 {
  grid-column: 7 / 9;
  grid-row: 1 / 3;
  margin: 0;
  
  & img {
    border-radius: 0 10px 0 0;
  }
}

& .gallery__item--4 {
  grid-column: 5 / 7;
  grid-row: 3 / 5;
  margin: 0;
}

& .gallery__item--5 {
  grid-column: 7 / 9;
  grid-row: 3 / 5;
  margin: 0;
  
  & img {
    border-radius: 0 0 10px 0;
  }
}

& .loading-image {
  grid-column: 1 / 9;
  grid-row: 1 / 9;
  display: flex;
  justify-content: center;
  align-items: center;
  
  & img {
    width: 100px;
    height: 100px;
  }
}
`}
`

export const Carousel = styled.div`
  & img {
    width: 100%;
    height: 15rem;
    object-fit: cover;
  }
`
