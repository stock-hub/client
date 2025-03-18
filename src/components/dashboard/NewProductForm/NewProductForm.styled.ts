import styled from 'styled-components'

export const NewProductTag = styled.span`
  background-color: #d3d0d0;
  padding: 3px 3px;
  border-radius: 5px;
  margin-right: 5px;
`

export const ImagesPreview = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 2rem 0;

  & > div {
    padding: 10px;
  }
`

export const PicturePreview = styled.picture`
  & img {
    width: 10rem;
    height: 10rem;
    object-fit: cover;
    border-radius: 5px;
  }
`

export const DeleteImageBtn = styled.button`
  background: none;
  border: 2px solid red;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  color: red;
  font-size: 1.5rem;
  position: absolute;

  & i {
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 5px;
  }
`
